import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config.ts";

test("API rewrites", async (t) => {
  const originalUrl = process.env.API_URL;
  t.after(() => {
    if (originalUrl === undefined) {
      delete process.env.API_URL;
    } else {
      process.env.API_URL = originalUrl;
    }
  });

  for (const [name, apiUrl, destination] of [
    ["default backend", undefined, "http://localhost:3001/:path*"],
    ["custom backend", "http://localhost:4001", "http://localhost:4001/:path*"],
    ["trailing slash", "http://localhost:4001/", "http://localhost:4001/:path*"],
  ]) {
    await t.test(name, async () => {
      if (apiUrl === undefined) {
        delete process.env.API_URL;
      } else {
        process.env.API_URL = apiUrl;
      }
      assert.deepEqual(await nextConfig.rewrites(), [
        { source: "/api/:path*", destination },
      ]);
    });
  }
});
