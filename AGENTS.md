# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js 16 App Router application. Keep the root focused on project-level files such as `README.md`, dependency manifests, and tool configuration. Use this layout:

- `src/app/` for routes, layouts, route handlers, and Server Actions.
- `src/components/` for reusable UI components.
- `src/lib/` for validation, service clients, configuration, and business logic.
- `supabase/migrations/` for reviewed database schema changes.
- `public/` for static images and other files served unchanged.
- Colocate deterministic unit tests with their modules; reserve `tests/` for integration and end-to-end coverage.

Document intentional departures in the pull request that introduces them.

## Build, Test, and Development Commands

Use npm and keep these commands working:

- `npm run dev` to start the local development server.
- `npm run build` to create a production build.
- `npm test` to run the Vitest suite.
- `npm run lint` to check formatting and static-analysis rules.
- `npm run typecheck` to run the TypeScript compiler without output.

Do not commit generated build output or dependency directories.

## Coding Style & Naming Conventions

Follow ESLint, TypeScript strict mode, and the existing Tailwind CSS conventions. Use two-space indentation for JSON, YAML, JavaScript, and TypeScript. Use `PascalCase` for components and classes, `camelCase` for functions and variables, and kebab-case for general filenames. Favor Server Components by default; add `"use client"` only where browser state or effects are necessary.

## Testing Guidelines

Add tests with each behavior change and regression fix. Name tests after the unit or feature under test, such as `event-details.test.ts`. Keep tests deterministic and avoid relying on external services unless they are mocked or clearly designated as integration tests. Before opening a pull request, run the full test and lint commands defined by the project.

## Commit & Pull Request Guidelines

There is no existing commit history from which to infer a convention. Use short, imperative commit subjects, optionally following Conventional Commits (for example, `feat: add anniversary timeline` or `fix: validate event dates`). Pull requests should explain the change and validation performed, link relevant issues, and include screenshots or recordings for visible UI changes. Keep each pull request focused and call out follow-up work explicitly.

## Security & Configuration

Never commit secrets, credentials, or local environment files. Keep `.env.example` sanitized and document every required variable. Public forms must validate server-side. Supabase secret keys and Resend keys are server-only and must never use a `NEXT_PUBLIC_` prefix. Keep row-level security enabled and direct client access revoked for registration and business-inquiry data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
