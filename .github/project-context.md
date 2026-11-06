# Project Context

## Overview

This is a pnpm workspace containing a Next.js frontend and a NestJS API. It is currently a starter application: the web app has a landing page, and the API exposes a basic greeting endpoint. Do not assume a database, authentication system, or established domain model exists.

See the [README](../README.md) for setup, environment variables, and root commands.

## Runtime Flow

- The frontend is a Next.js App Router application in `apps/web`.
- The API is a NestJS application in `apps/api`; its entry point listens on `PORT`, then `API_PORT`, defaulting to `3001`.
- The Next.js Node.js route handler at `apps/web/src/app/api/[[...path]]/route.ts` proxies `/api` and `/api/*` to `API_URL` at request time. It removes the `/api` prefix, so a browser request to `/api/users` reaches NestJS as `/users`.
- Frontend code should use same-origin paths such as `/api/users`. Treat `/api` as reserved for the backend proxy; other Next.js routes under that prefix can shadow or conflict with it.
- The root `vercel.json` defines one project with `web` (Next.js) and `api` (NestJS) services. Only `web` has a public rewrite; `api` stays internal. The web proxy still exposes backend endpoints publicly.
- `web` declares a service binding to `api`, which injects server-only `API_URL` at function runtime. Never configure that variable manually on Vercel or read it at build time or in middleware. A missing binding on Vercel is an explicit error; ordinary local development defaults to `http://localhost:3001`.

## Code Ownership

| Concern                   | Location                                                      | Notes                                          |
| ------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Web routes and page UI    | [`apps/web/src/app`](../apps/web/src/app)                     | App Router pages, layouts, and styles          |
| Web runtime API proxy     | [`apps/web/src/app/api/[[...path]]/route.ts`](../apps/web/src/app/api/%5B%5B...path%5D%5D/route.ts) | Owns `/api` forwarding over the binding |
| Vercel service routing    | [`vercel.json`](../vercel.json)                               | Service definitions, public routing, and bindings |
| Web app development notes | [`apps/web/docs/README.md`](../apps/web/docs/README.md)       | UI structure, backend requests, and validation |
| API bootstrap and port    | [`apps/api/src/main.ts`](../apps/api/src/main.ts)             | Creates and starts the Nest application        |
| API module composition    | [`apps/api/src/app.module.ts`](../apps/api/src/app.module.ts) | Registers controllers and providers            |
| API HTTP endpoints        | `apps/api/src/*controller.ts`                                 | Keep transport concerns in controllers         |
| API behavior              | `apps/api/src/*service.ts`                                    | Put reusable application logic in services     |
| API development notes     | [`apps/api/docs/README.md`](../apps/api/docs/README.md)       | Endpoint structure, tests, and validation      |

Keep frontend presentation and routing in the web app, and backend endpoints and server-side behavior in the API. Coordinate changes to the HTTP contract across both apps.

## Tests

- API unit tests use Vitest and live alongside source as `*.spec.ts`; HTTP integration tests live in `apps/api/test` and use the e2e Vitest config.
- Web tests use Node's built-in test runner and live in `apps/web/test`.
- Prefer the owning app's test command while iterating, then use the root commands from the README when a change spans apps.
- Pull requests run [`pull-request.yml`](workflows/pull-request.yml): `pnpm lint`, `pnpm test`, and `pnpm test:e2e` in one job, and `pnpm build` in another.

## Keeping This Guide Useful

Update this document when app ownership, request routing, runtime configuration, or test conventions change. Keep setup steps and command details in the README rather than duplicating them here.
