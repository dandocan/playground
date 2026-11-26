import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appDir = fileURLToPath(new URL("../src/app/", import.meta.url));
const proxyFile = new URL("../src/proxy.ts", import.meta.url);
const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;
const WILDCARD = "/:path*";

async function pageFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await pageFiles(path)));
    else if (PAGE_FILE.test(entry.name)) files.push(path);
  }
  return files;
}

// Route groups such as (auth) do not appear in the URL.
function routeOf(file) {
  const segments = relative(appDir, file)
    .split(sep)
    .slice(0, -1)
    .filter((segment) => !/^\(.*\)$/.test(segment));
  return `/${segments.join("/")}`;
}

async function protectedRoutes() {
  const routes = [];
  for (const file of await pageFiles(appDir)) {
    if (/<ProtectedPage[\s>]/.test(await readFile(file, "utf8"))) {
      routes.push(routeOf(file));
    }
  }
  return routes;
}

async function proxyMatchers() {
  const source = await readFile(proxyFile, "utf8");
  const array = source.match(/matcher:\s*\[([^\]]*)\]/);
  assert.ok(array, "Could not find a literal `matcher` array in src/proxy.ts.");
  return [...array[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
}

function covers(pattern, route) {
  if (pattern.endsWith(WILDCARD)) {
    const base = pattern.slice(0, -WILDCARD.length);
    return route === base || route.startsWith(`${base}/`);
  }
  assert.match(
    pattern,
    /^\/[\w\-/[\]]*$/,
    `Unsupported matcher pattern "${pattern}". Use "/path" or "/path/:path*", or extend this test.`,
  );
  return route === pattern;
}

test("pages wrapped in ProtectedPage and the proxy matcher stay in sync", async (t) => {
  const routes = await protectedRoutes();
  const matchers = await proxyMatchers();

  assert.ok(
    routes.length > 0,
    "No page uses <ProtectedPage>. If that is intentional, remove this test; otherwise route detection broke.",
  );

  await t.test("every protected page is covered by the proxy matcher", () => {
    const uncovered = routes.filter(
      (route) => !matchers.some((pattern) => covers(pattern, route)),
    );
    assert.deepEqual(
      uncovered,
      [],
      `Add these routes to the matcher in src/proxy.ts: ${uncovered.join(", ")}`,
    );
  });

  await t.test("every proxy matcher entry guards a protected page", () => {
    const orphaned = matchers.filter(
      (pattern) => !routes.some((route) => covers(pattern, route)),
    );
    assert.deepEqual(
      orphaned,
      [],
      `No page under these matcher entries uses <ProtectedPage>: ${orphaned.join(", ")}`,
    );
  });
});
