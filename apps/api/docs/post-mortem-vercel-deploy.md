# Post-mortem: NestJS API failing on Vercel

Branch `fix/nestjs-api-vercel`. The API worked with `pnpm dev` but returned 500s under `vercel dev` and then in Vercel preview deployments.

## Summary

Four separate problems stacked on top of each other, each hiding the next. Three were fixed in code. The last one (`Cannot find package '@nestjs/core'` in the deployment) stopped after a redeploy with no new commit; its cause is inferred, not confirmed.

## Timeline

| #   | Where              | Symptom                                                                                    | Cause                                                                                                                                                                                                               | Resolution                                                                                                                                                                |
| --- | ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `vercel dev`       | `GET /api` returned 500, "Bridge is not ready, please try again"                           | `src/main.ts` awaited `bootstrap()` at module level, unlike the entrypoint in Vercel's NestJS docs. The Vercel Node bridge was never marked ready.                                                                  | Call `void bootstrap()` instead. The `main.spec.ts` assertion now uses `vi.waitFor`.                                                                                      |
| 2   | `vercel dev`       | `TypeError: Cannot read properties of undefined (reading 'getHello')`                      | `vercel dev` transpiles `src/*.ts` without emitting decorator metadata, so constructor injection by type left `appService` undefined. `nest start` compiles with `tsc` and does emit it.                            | Use `@Inject(AppService)` in `AppController`.                                                                                                                             |
| 3   | Preview deployment | `SyntaxError: Cannot use import statement outside a module` for `/var/task/main.js`        | The built function maps `dist/*` to the function root but `package.json` stayed under `apps/api/`, so Node treated `main.js` as CommonJS. `@nestjs/core` 12 is ESM-only, so switching to CommonJS is not an option. | Add `src/package.json` (`{ "type": "module" }`) and list it under `assets` in `nest-cli.json`, so `nest build` copies it to `dist/package.json`.                          |
| 4   | Preview deployment | `ERR_MODULE_NOT_FOUND: Cannot find package '@nestjs/core' imported from /var/task/main.js` | With pnpm's default layout, dependencies sit under `apps/api/node_modules`, while `main.js` is at the function root, so they are not on its resolution path.                                                        | Add a root `.npmrc` with `node-linker=hoisted`. After that, the error persisted through two deployments, then went away after a redeploy without a new commit. See below. |

## What is verified and what is not

- Verified locally with `vercel build`, including Vercel CLI 65.11.0, the same version as the cloud: with `node-linker=hoisted`, the API function maps `node_modules/@nestjs/core/...` at its root, and `package.json` with `"type": "module"` maps there too.
- Verified in the cloud build log: `node_modules/@nestjs/core` was a real directory at the repo root, both before and after the second service's install step.
- Not verified: why the error in row 4 persisted after `.npmrc` was committed and then stopped. The leading hypothesis is that a stale build cache from an earlier deployment (restored on every build) kept an old function layout, and that a redeploy with the cache skipped fixed it. Nobody confirmed that was the redeploy that worked. If `/api` fails again after dependency or layout changes, redeploy without the build cache first.
- Not verified: whether removing the top-level `await` (row 1) was required on its own, or whether the `@Inject` change (row 2) was needed independently of the runner used.

## Impact

- Developers: `vercel dev` and previews now serve the API. `pnpm dev` and `pnpm start` behavior is unchanged.
- The whole workspace, including `web`, now installs with a hoisted `node_modules`. Run `pnpm install` once after pulling.
- Providers injected by constructor type in the API need an explicit `@Inject(...)` to work under `vercel dev`.
- `apps/api/src/package.json` is a workaround for packaging and can be removed if Vercel starts keeping the real `package.json` next to the compiled output.

## Lessons

- The same error text can come from different layers. The 500 from `/api` in the web proxy was passed through from the NestJS service, so the web log showed only `GET /api 500`.
- Logs from `console.log` in `main.ts` were not visible under `vercel dev`, which hid the startup behavior for a while. Reproducing the packaging with a local `vercel build` and inspecting `.vc-config.json` (`filePathMap`) was the quickest way to see where files end up.
- The Vercel dashboard's Output tab lists routes and functions, not the files inside them, so it cannot confirm dependency placement.
- When a fix has no visible effect, check build-cache reuse before assuming the fix is wrong.

## Follow-ups

- Confirm the cache hypothesis, for example by checking that a clean redeploy reproduces the failure without `.npmrc` and succeeds with it.
