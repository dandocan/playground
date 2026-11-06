# Web App Guide

The web app is a Next.js App Router frontend. Root setup and workspace commands are documented in the [repository README](../../../README.md); cross-app architecture is summarized in the [project context](../../../.github/project-context.md).

## Structure

- [`src/app/page.tsx`](../src/app/page.tsx) implements the home route.
- [`src/app/layout.tsx`](../src/app/layout.tsx) defines the shared root layout and document metadata.
- `src/app/*.module.css` contains page-scoped styles; `src/app/globals.css` contains global styles.
- [`next.config.ts`](../next.config.ts) owns Next.js configuration.
- [`src/app/api/[[...path]]/route.ts`](../src/app/api/%5B%5B...path%5D%5D/route.ts) owns the runtime backend proxy.
- `public/` holds static assets, and `test/` holds web-specific tests.

## Backend Requests

Call the backend through same-origin paths such as `fetch('/api/users')`. The Node.js route handler proxies `/api` and `/api/*` to `API_URL`, removing the `/api` prefix before forwarding the request. It forwards HTTP methods, bodies, query strings, application headers, and upstream statuses without caching or following redirects. Request bodies are buffered; response bodies are streamed.

On Vercel, the `web` service calls the internal `api` service through a binding that injects `API_URL`. Do not set it manually. Bindings are runtime-only: do not use them in Next.js configuration, static generation, or middleware. The proxy logs missing configuration and connection failures and returns explicit 500 or 502 responses.

Outside Vercel, `API_URL` can override the default `http://localhost:3001` at runtime, including after a production build. Keep `/api` reserved for the backend proxy; adding another Next.js route under that prefix can shadow it.

## UI Changes

- Keep route-specific UI with its App Router route. Extract shared components only when there is actual reuse or a clear ownership boundary.
- Components are Server Components by default. Add a client boundary only for browser-only behavior or React state and event handling.
- Use the existing CSS Modules and global stylesheet conventions before introducing another styling system or dependency.
- For backend integration, cover request behavior and relevant failure states; avoid hard-coded backend hosts in browser code.

## Validation

Run these from the repository root:

```sh
pnpm --filter web test
pnpm --filter web lint
pnpm --filter web build
```

The current test suite uses Node's built-in test runner to verify runtime proxy behavior against a local HTTP server and the Vercel service configuration. Add tests alongside the existing files in `test/` and use the built-in `node:test` and `node:assert` APIs unless the project adopts another runner.
