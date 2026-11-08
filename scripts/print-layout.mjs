// Temporary diagnostic for the Vercel API deploy; remove once resolved.
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const kind = (p) => {
  if (!existsSync(p)) return "missing";
  return lstatSync(p).isSymbolicLink() ? "symlink" : "directory";
};
const npmrc = existsSync(resolve(root, ".npmrc"))
  ? readFileSync(resolve(root, ".npmrc"), "utf8").trim()
  : "missing";

console.log(`[layout:${process.argv[2]}] cwd=${process.cwd()}`);
console.log(`[layout:${process.argv[2]}] .npmrc=${npmrc}`);
for (const p of [
  "node_modules/@nestjs/core",
  "node_modules/@nestjs/common",
  "node_modules/.pnpm",
  "apps/api/node_modules/@nestjs/core",
  "apps/web/node_modules/next",
]) {
  console.log(`[layout:${process.argv[2]}] ${p}: ${kind(resolve(root, p))}`);
}
