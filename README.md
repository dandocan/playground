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

The Next.js runtime proxy forwards `/api` and `/api/*` to NestJS, stripping the `/api` prefix.
Frontend requests can use relative URLs such as `fetch('/api')`, without CORS configuration.
Keep other frontend API routes outside this prefix to avoid shadowing the backend proxy.

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
| `pnpm test` | Run backend unit tests and frontend proxy and deployment configuration tests |
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

`API_URL` is server-only, must include the protocol, and is read per request,
not during builds. Outside Vercel it defaults to `http://localhost:3001`.
Next.js uses `PORT` (default 3000); NestJS uses `PORT`, then `API_PORT`, then
3001. For ordinary workspace development, leave `PORT` unset so the two apps
use different defaults.

## Vercel deployment

Import the repository as **one Vercel project**, with its Root Directory set
to the repository root. [`vercel.json`](vercel.json) defines two independently
built services:

| Service | Framework | Public access |
| --- | --- | --- |
| `web` | Next.js | All paths through the top-level catch-all rewrite |
| `api` | NestJS | Internal only; no direct public rewrite |

The `web` service declares a binding to `api`. Vercel injects `API_URL` at
function runtime: **do not set it manually in Vercel**. The web app's Node.js
route handler forwards `/api` and `/api/*` over this binding, preserving the
existing public API URLs while stripping `/api` before NestJS receives them.
These API endpoints remain publicly accessible through the web proxy; an
internal service binding is not application-level authentication.

No binding is read during builds or from middleware. NestJS honors the `PORT`
provided by Vercel. No separate API project, public backend URL, or CORS setup
is needed.

With the Vercel CLI installed and authenticated, run from the repository root:

```sh
vercel dev
```

This runs both services together and injects the binding. Check `/` for the
frontend and `/api` for `Hello World!` on the local URL printed by the CLI.
Use `vercel deploy` or the connected Git integration to deploy the same project.