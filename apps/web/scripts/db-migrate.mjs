import { spawnSync } from "node:child_process";

const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) {
  console.error("DATABASE_URL_UNPOOLED is not set.");
  process.exit(1);
}

// The auth config reads DATABASE_URL, so point it at the direct connection for migrations.
const result = spawnSync(
  "auth",
  ["migrate", "--yes", "--config", "src/lib/auth.ts"],
  {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, DATABASE_URL: url },
  },
);
process.exit(result.status ?? 1);
