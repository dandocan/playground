import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { gzipSync } from "node:zlib";
import * as route from "../src/app/api/[[...path]]/route.ts";

test("API runtime proxy", async (t) => {
  const originalUrl = process.env.API_URL;
  const originalVercel = process.env.VERCEL;
  t.after(() => {
    for (const [name, value] of [
      ["API_URL", originalUrl],
      ["VERCEL", originalVercel],
    ]) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
  const requests = [];
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    requests.push({
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: Buffer.concat(chunks).toString(),
    });
    if (req.url === "/redirect") {
      res.writeHead(307, { location: "/api/items" });
      res.end();
    } else if (req.url === "/compressed") {
      const body = gzipSync("compressed response");
      res.writeHead(200, {
        "content-encoding": "gzip",
        "content-length": body.length,
      });
      res.end(body);
    } else {
      res.writeHead(201, {
        "content-type": "application/json",
        "set-cookie": ["one=1; HttpOnly", "two=2; HttpOnly"],
        connection: "keep-alive, x-hop",
        "x-hop": "private",
      });
      res.end('{"ok":true}');
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  const base = `http://127.0.0.1:${server.address().port}`;
  process.env.VERCEL = "1";
  process.env.API_URL = base;

  await t.test("forwards the root, nested paths and queries", async () => {
    for (const path of ["", "/", "/items/a%2Fb?limit=2&limit=3"]) {
      const response = await route.GET(new Request(`http://web/api${path}`));
      assert.equal(response.status, 201);
      assert.deepEqual(await response.json(), { ok: true });
      assert.equal(requests.at(-1).url, path || "/");
      assert.equal(response.headers.get("x-hop"), null);
      assert.equal(response.headers.get("connection"), null);
      assert.deepEqual(response.headers.getSetCookie(), [
        "one=1; HttpOnly",
        "two=2; HttpOnly",
      ]);
    }
  });

  await t.test("forwards methods, bodies and application headers", async () => {
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      const response = await route[method](new Request("http://web/api/items", {
        method,
        headers: {
          authorization: "Bearer test",
          "content-type": "application/json",
          connection: "keep-alive, x-hop",
          "x-hop": "private",
          host: "web",
        },
        body: '{"name":"example"}',
      }));
      await response.text();
      assert.equal(requests.at(-1).method, method);
      assert.equal(requests.at(-1).body, '{"name":"example"}');
      assert.equal(requests.at(-1).headers.authorization, "Bearer test");
      assert.equal(requests.at(-1).headers["content-type"], "application/json");
      assert.equal(requests.at(-1).headers["x-hop"], undefined);
      assert.equal(requests.at(-1).headers.host, new URL(base).host);
    }
    const response = await route.HEAD(new Request("http://web/api", { method: "HEAD" }));
    assert.equal(requests.at(-1).method, "HEAD");
    assert.equal(await response.text(), "");
  });

  await t.test("reads the binding per request and preserves its base path", async () => {
    process.env.API_URL = `${base}/internal/`;
    const response = await route.GET(new Request("http://web/api//other.test/items?q=1"));
    await response.text();
    assert.equal(requests.at(-1).url, "/internal//other.test/items?q=1");
    process.env.API_URL = base;
  });

  await t.test("preserves redirects without following them", async () => {
    const response = await route.GET(new Request("http://web/api/redirect"));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "/api/items");
  });

  await t.test("does not forward stale compression headers", async () => {
    const response = await route.GET(new Request("http://web/api/compressed"));
    assert.equal(await response.text(), "compressed response");
    assert.equal(response.headers.get("content-encoding"), null);
    assert.equal(response.headers.get("content-length"), null);
  });

  await t.test("reports missing bindings instead of using localhost on Vercel", (t) => {
    delete process.env.API_URL;
    const errors = t.mock.method(console, "error", () => {});
    return route.GET(new Request("http://web/api")).then((response) => {
      assert.equal(response.status, 500);
      assert.equal(errors.mock.callCount(), 1);
    });
  });

  await t.test("reports connection failures without leaking the internal URL", async (t) => {
    process.env.API_URL = "http://127.0.0.1:1";
    const errors = t.mock.method(console, "error", () => {});
    const response = await route.GET(new Request("http://web/api"));
    assert.equal(response.status, 502);
    assert.equal(await response.text(), "API service is unavailable.");
    assert.equal(errors.mock.callCount(), 1);
  });

  await t.test("retains the localhost default outside Vercel", async (t) => {
    delete process.env.API_URL;
    delete process.env.VERCEL;
    const fetch = t.mock.method(globalThis, "fetch", async () => new Response("local"));
    const response = await route.GET(new Request("http://web/api"));
    assert.equal(await response.text(), "local");
    assert.equal(fetch.mock.calls[0].arguments[0].href, "http://localhost:3001/");
  });
});
