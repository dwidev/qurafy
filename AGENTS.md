# Repository Guidelines

## Project Structure & Module Organization
Core application code lives in `src/`. Routes and API handlers use the Next.js App Router under `src/app`, including grouped segments such as `src/app/(dashboard)` and `src/app/api`. Reusable UI sits in `src/components`, while feature-specific code is organized by domain in `src/features/<feature>/{api,components,server,types}`. Database access and schema definitions live in `src/db`. Static assets belong in `public/`, and SQL migrations plus Drizzle metadata live in `migrations/`.

## Build, Test, and Development Commands
Use `bun install` to install dependencies. Use `bun run dev` to start the local Next.js server, `bun run build` to produce a production build, and `bun run start` to serve that build. Run `bun run lint` before opening a PR; this uses the root `eslint.config.mjs`. For schema changes, run `bun run db:generate` to create migration files and `bun run db:migrate` to apply them.

## Coding Style & Naming Conventions
This repo uses TypeScript with `strict` mode enabled and the `@/*` import alias from `tsconfig.json`. Follow the existing style: 2-space indentation, double quotes, semicolons, and named exports for shared modules. Use `PascalCase` for React components (`DashboardPage.tsx`), `camelCase` for variables and functions, and kebab-like route folder names only where Next.js routing requires them. Keep feature logic inside its domain folder instead of growing `src/components` into a catch-all.

## Testing Guidelines
There is currently no committed automated test runner. Until one is added, treat `bun run lint` and a successful `bun run build` as the minimum validation for every change. When adding tests, place them next to the feature they cover and use `*.test.ts` or `*.test.tsx` naming so they are easy to discover later.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes such as `feat:` and `refactor:`. Keep commit subjects imperative and concise, for example `fix: handle missing profile state in dashboard`. PRs should describe the user-facing change, note any migration or env changes, and include screenshots for UI updates. Link the relevant issue or planning document when one exists.

## Security & Configuration Tips
Do not commit `.env.local` or secrets. Start from `.env.example` and keep auth, SMTP, and database values local. Review `drizzle.config.ts` and generated migrations carefully before merging schema changes.
