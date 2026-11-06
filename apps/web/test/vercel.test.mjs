import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import nextConfig from "../next.config.ts";

test("Vercel routes public traffic through web and binds its internal API", async () => {
  const config = JSON.parse(await readFile(new URL("../../../vercel.json", import.meta.url)));
  assert.deepEqual(config.services, {
    api: { root: "apps/api", framework: "nestjs" },
    web: {
      root: "apps/web",
      framework: "nextjs",
      bindings: [{ type: "service", service: "api", format: "url", env: "API_URL" }],
    },
  });
  assert.deepEqual(config.rewrites, [
    { source: "/(.*)", destination: { service: "web" } },
  ]);
  assert.equal(nextConfig.rewrites, undefined);
});
