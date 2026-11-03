# Web App Guide

The web app is a Next.js App Router frontend. Root setup and workspace commands are documented in the [repository README](../../../README.md); cross-app architecture is summarized in the [project context](../../../.github/project-context.md).

## Structure

- [`src/app/page.tsx`](../src/app/page.tsx) implements the home route.
- [`src/app/layout.tsx`](../src/app/layout.tsx) defines the shared root layout and document metadata.
- `src/app/*.module.css` contains page-scoped styles; `src/app/globals.css` contains global styles.
- [`next.config.ts`](../next.config.ts) owns the backend rewrite and Next.js configuration.
- `public/` holds static assets, and `test/` holds web-specific tests.

## Backend Requests

Call the backend through same-origin paths such as `fetch('/api/users')`. Next.js rewrites `/api/:path*` to `API_URL` and removes the `/api` prefix before forwarding the request. The default backend URL is `http://localhost:3001`.

Keep `/api` reserved for the backend proxy. Adding a Next.js route under that prefix can conflict with the rewrite. `API_URL` is used by Next.js configuration and must be set when building for a non-default production backend.

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

The current test suite uses Node's built-in test runner to verify the Next.js rewrite configuration. Add tests alongside the existing files in `test/` and use the built-in `node:test` and `node:assert` APIs unless the project adopts another runner.
