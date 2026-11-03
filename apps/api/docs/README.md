# API Guide

The API is a NestJS HTTP service. Root setup and workspace commands are documented in the [repository README](../../../README.md); cross-app request flow is summarized in the [project context](../../../.github/project-context.md).

## Structure

- [`src/main.ts`](../src/main.ts) creates the Nest application and listens on `API_PORT` (default `3001`).
- [`src/app.module.ts`](../src/app.module.ts) is the root module and composes controllers and providers.
- Controllers define HTTP routes and delegate application behavior to providers or services.
- Services hold application behavior that should not be coupled to HTTP transport.
- `src/**/*.spec.ts` contains unit tests; `test/` contains HTTP integration tests.

The current baseline exposes `GET /`, which returns `Hello World!`. The web app exposes this backend through `/api`, but Nest receives the path without that prefix.

## Adding an Endpoint

1. Define the HTTP route in an appropriate controller and delegate non-trivial behavior to a service.
2. Register new controllers or providers with the owning Nest module.
3. Add a focused unit test for behavior and an e2e test when the HTTP contract or module wiring needs coverage.
4. If the web app consumes the endpoint, use its same-origin `/api/...` path and update any relevant web tests or docs.

Keep the current structure lightweight. Introduce feature modules or additional layers when the application has enough related behavior to justify them, rather than pre-building unused architecture.

## Validation

Run these from the repository root:

```sh
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api lint
pnpm --filter api build
```

Unit and e2e tests use Vitest. E2e tests use Supertest against a Nest application instance, so they can verify the HTTP contract without requiring a separately running server.