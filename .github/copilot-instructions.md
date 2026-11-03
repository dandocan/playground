# Repository Guidance

- This repository is a pnpm workspace with a Next.js app in `apps/web` and a NestJS app in `apps/api`. Keep changes within the owning app unless a shared workspace concern requires a root-level change.
- For cross-app or architectural work, read [project-context.md](project-context.md) first. Update it when app boundaries, request flow, runtime configuration, or test conventions change.
- Inspect the relevant implementation and nearby tests before changing behavior. Follow the existing framework, naming, formatting, and error-handling conventions.
- Prefer the smallest complete change. Avoid speculative abstractions, unrelated cleanup, and new dependencies when existing platform or project utilities are sufficient.
- Add or update tests for behavior changes. Use Vitest for the API and Node's test runner for the web app; keep tests focused on observable behavior.
- Run the narrowest relevant check after editing, then broader checks when the change crosses app boundaries. Root commands include `pnpm lint`, `pnpm test`, and `pnpm build`.
- Use pnpm for dependency and workspace commands. When dependencies change, update the root lockfile and verify with `pnpm install --frozen-lockfile` when appropriate.
- Preserve unrelated user changes. Do not commit unless explicitly asked.
