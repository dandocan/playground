import assert from "node:assert/strict";
import test from "node:test";
import { sendEmail } from "../src/lib/email.ts";

const message = { to: "user@example.com", subject: "Hi", text: "Body" };

test("sendEmail", async (t) => {
  const names = ["RESEND_API_KEY", "EMAIL_FROM", "NODE_ENV"];
  const originalEnv = Object.fromEntries(names.map((n) => [n, process.env[n]]));
  const originalFetch = globalThis.fetch;
  t.afterEach(() => {
    for (const n of names) {
      if (originalEnv[n] === undefined) delete process.env[n];
      else process.env[n] = originalEnv[n];
    }
    globalThis.fetch = originalFetch;
  });

  await t.test("posts to Resend with the configured sender", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "App <no-reply@example.com>";
    let call;
    globalThis.fetch = async (url, init) => {
      call = { url, init };
      return new Response("{}", { status: 200 });
    };

    await sendEmail(message);

    assert.equal(call.url, "https://api.resend.com/emails");
    assert.equal(call.init.headers.Authorization, "Bearer re_test");
    assert.deepEqual(JSON.parse(call.init.body), {
      from: "App <no-reply@example.com>",
      ...message,
    });
  });

  await t.test("includes Resend's error when sending fails", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "App <no-reply@example.com>";
    globalThis.fetch = async () => new Response("bad recipient", { status: 422 });

    await assert.rejects(sendEmail(message), /422: bad recipient/);
  });

  await t.test("logs instead of sending without a key in development", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = "development";
    globalThis.fetch = async () => assert.fail("fetch must not be called");
    const logged = [];
    t.mock.method(console, "info", (line) => logged.push(line));

    await sendEmail(message);

    assert.match(logged[0], /to=user@example\.com/);
    assert.match(logged[0], /Body/);
  });

  await t.test("refuses to run without a key in production", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.NODE_ENV = "production";

    await assert.rejects(sendEmail(message), /RESEND_API_KEY/);
  });
});
