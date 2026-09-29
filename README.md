# Coach Arena 5K

Event website for the Coach Robert Arena Five-Year Anniversary 5K on
October 18, 2026, at Lincoln Park in Jersey City. The event supports the
Robert Arena Scholarship for Hudson County students.

## What the site does

- Shares event details, the course map, prizes, and registration information.
- Accepts registrations and business inquiries.
- Gives organizers a dashboard to review entries, verify donations, and export registrations.
- Sends registration receipt emails and business inquiry notifications when email is configured.

Participants donate at least $20 through GoFundMe, then register using their
donor name. Organizers verify donations manually. The site does not collect
card information.

## Run locally

Use **Node.js 24** and **npm**. From the repository folder:

```sh
npm ci
```

Copy `.env.example` to `.env.local` (`Copy-Item .env.example .env.local` in
PowerShell, or `cp .env.example .env.local` on macOS/Linux), then run:

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000). Public pages work without service
credentials; form submissions and organizer access require Supabase setup.
If PowerShell blocks `npm.ps1`, use `npm.cmd` instead.

## Configuration

Set these values in `.env.local` for development and in the hosting environment
for deployments. Never commit `.env.local` or secrets.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site origin, without a trailing slash; locally `http://localhost:3000`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key. |
| `ADMIN_EMAIL` | Organizer email; must match the database access policies. |
| `RESEND_API_KEY` | Server-only key for registration and business notification emails. |
| `EMAIL_FROM` | Sender address on a verified Resend domain. |

See [Organizer and email setup](docs/organizer-setup.md) for database migrations,
magic-link sign-in, and email configuration. Preview deployments need a separate
database configuration; they do not fall back to production.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development. |
| `npm run check` | Run ESLint, TypeScript checks, and Vitest tests. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build locally. |
| `npm run test:smoke` | Check public pages in desktop and mobile browsers. |
| `npm run test:e2e` | Run the full browser suite with the disposable local database. |

You can also run `npm run lint`, `npm run typecheck`, or `npm test` separately.
Browser tests require Chromium (`npx playwright install chromium`). Full browser
tests also require Docker and `npm run test:stack:start`.

## Stack and deployment

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase, and Resend.
Vercel hosts the site; GoFundMe handles donations.

The documented release workflow uses `main` for production and other branches
for Vercel previews. Open a pull request and pass the required checks before
merging; a merge to `main` can publish the changes.

See [Testing and release workflow](docs/testing-and-releases.md) for the full
test setup, CI checks, and deployment rules.
