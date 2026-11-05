import assert from "node:assert/strict";
import test from "node:test";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

test("Tailwind generates utility classes", async () => {
  const result = await postcss([tailwindcss()]).process(
    '@import "tailwindcss"; @source inline("flex");',
    { from: undefined },
  );

  assert.match(result.css, /\.flex\s*\{/);
});
