# Repository Guidelines

For up to date information, see the README.md. You may traverse and read the mentioned files as needed. You may search the web to understand current, modern-day best practices.

## Project Structure & Module Organization
- `src/routes` drives SvelteKit routing; pair `+page.svelte`, `+page.server.ts`, and optional `+layout` files per feature (e.g., `chat`, `dashboard`).
- Shared logic lives under `src/lib` (`logger.ts`, `constants.ts`, reusable assets) and `src/hooks.server.ts` wires Supabase auth across requests.
- Static assets belong in `static/`; long-form explanations sit in `docs/` (`architecture.md`, `gotchas.md`).
- Environment defaults are in `.env.development`; copy to `.env` for local secrets.

## Build, Test, and Development Commands
- `pnpm run dev`: start the Vite dev server with HMR against the Supabase dev project.
- `pnpm run build`: produce the optimized SvelteKit output; run before shipping backend changes.
- `pnpm run preview`: serve the production build locally to sanity-check routing and auth flows.
- `pnpm run check`: run SvelteKit sync plus type and Svelte checks; required before opening a PR.
- `pnpm run lint` / `pnpm run format`: enforce Prettier + ESLint; use `format` to auto-fix prior to commits.

## Coding Style & Naming Conventions
- Prettier enforces tabs, single quotes, and `printWidth` 100; do not override per file.
- Prefer TypeScript for components, stores, and utilities. 
- Name Svelte files with feature context (`chat/+page.svelte`), and colocate server actions in `+page.server.ts`.
- Log through `$lib/logger` so output remains structured via `pino`.

## Testing Guidelines
- Type safety and Svelte compile checks run via `pnpm run check`; wire new data types into `src/database.types.ts` to maintain coverage of Supabase queries. You should run type checks at the end of implementation to maintain code quality.
- When adding forms or auth flows, add manual test notes in the PR and exercise `/auth/confirm` to verify enrollment cycles.
- Keep any future Vitest suites under `src/lib/__tests__` and mirror route structure for clarity.

## Commit & Pull Request Guidelines
- Use imperative, all-lowercase subject lines (~60 chars) mirroring existing history (`Add chat flows`).
- Group related changes per commit; include `pnpm run check` output in the PR body.
- PRs must describe the user-facing impact, link to tracking issues, and attach screenshots or screen recordings for UI updates.
- Call out Supabase schema changes explicitly and provide migration or seed steps.

## Security & Configuration Tips
- Never commit real Supabase keys; rely on `.env.development` templates and document required vars in the PR.
- Rotate service-role keys after debugging sessions and disable verbose logging in production builds.
