# Playground

A personal project monorepo using npm workspaces, Next.js (App Router), and NestJS.

## Requirements

- Node.js 22.12+ (use `nvm use` with the included `.nvmrc`)
- npm 10+

## Quick start

```sh
npm ci
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001 (returns `Hello World!`)
- Proxied backend: http://localhost:3000/api

Next.js forwards `/api` and `/api/*` to NestJS, stripping the `/api` prefix.
Frontend requests can use relative URLs such as `fetch('/api')`, without CORS configuration.
Keep frontend API routes outside this prefix to avoid shadowing the backend proxy.

## Structure

```text
apps/
  web/   Next.js frontend (TypeScript, ESLint)
  api/   NestJS backend (TypeScript, Oxlint, Vitest)
```

## Commands

Run these from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start both apps in watch mode |
| `npm run build` | Build both apps |
| `npm start` | Start both production servers after building |
| `npm run lint` | Lint both apps |
| `npm test` | Run backend unit tests and frontend proxy configuration tests |
| `npm run test:e2e` | Run backend HTTP integration tests |

To target one workspace, use commands such as `npm run dev --workspace web`
or `npm run start:dev --workspace api`. Install dependencies from the root;
the repository uses a single `package-lock.json`.

## Configuration

The defaults require no environment files. To use a different backend address,
set `API_PORT` for NestJS and `API_URL` for Next.js:

```sh
API_PORT=4001 API_URL=http://localhost:4001 npm run dev
```

`API_URL` is server-only and must include the protocol.
Next.js resolves rewrites at build time for production, so set `API_URL` when
running `npm run build` as well. `PORT` controls the Next.js port (default 3000);
`API_PORT` independently controls the NestJS port (default 3001).