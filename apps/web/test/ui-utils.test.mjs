import assert from "node:assert/strict";
import { test } from "node:test";
import { cn } from "../src/lib/utils.ts";

test("cn joins conditional class names", () => {
  assert.equal(cn("px-2", false && "hidden", "text-sm"), "px-2 text-sm");
});

test("cn resolves conflicting tailwind classes in favour of the last one", () => {
  assert.equal(cn("px-2 py-1", "px-4"), "py-1 px-4");
});
