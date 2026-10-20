# Playground

A personal project monorepo using pnpm workspaces, Next.js (App Router), and NestJS.

## Requirements

- Node.js 22.22.3+ on the 22.x LTS line (use `nvm use` with the included `.nvmrc`);
  see `engines.node` in `package.json` for other supported releases
- pnpm 10.34.7 (pinned in `package.json`; install with `npm install --global pnpm@10.34.7`)

## Quick start

```sh
pnpm install --frozen-lockfile
pnpm dev
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
| `pnpm dev` | Start both apps in watch mode |
| `pnpm build` | Build both apps |
| `pnpm start` | Start both production servers after building |
| `pnpm lint` | Lint both apps |
| `pnpm test` | Run backend unit tests and frontend proxy configuration tests |
| `pnpm test:e2e` | Run backend HTTP integration tests |

To target one workspace, use commands such as `pnpm --filter web dev`
or `pnpm --filter api start:dev`. Install dependencies from the root;
`pnpm-workspace.yaml` defines the workspaces and the repository uses a single
`pnpm-lock.yaml`. Use `pnpm install` when changing dependencies and
`pnpm install --frozen-lockfile` in CI to enforce the committed lockfile.

## Configuration

The defaults require no environment files. To use a different backend address,
set `API_PORT` for NestJS and `API_URL` for Next.js:

```sh
API_PORT=4001 API_URL=http://localhost:4001 pnpm dev
```

`API_URL` is server-only and must include the protocol.
Next.js resolves rewrites at build time for production, so set `API_URL` when
running `pnpm build` as well. `PORT` controls the Next.js port (default 3000);
`API_PORT` independently controls the NestJS port (default 3001).