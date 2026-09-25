# Coach Arena 5K

Mobile-first event website for the Coach Robert Arena Five-Year Anniversary 5K,
held October 18, 2026 in Lincoln Park, Jersey City. The event raises money for
the Robert Arena Scholarship for Hudson County students.

## Stack

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4
- Supabase Postgres and passwordless organizer authentication
- Resend for registration confirmation email
- Vercel for eventual hosting
- GoFundMe for all donation processing

This site never collects card information. A participant donates at least $20 on
GoFundMe, submits the donor name during registration, and an organizer verifies
the match manually.

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

The public pages render without environment variables. Form submissions and the
admin dashboard require Supabase configuration.

## Commands

- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm test` runs the Vitest suite.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SITE_URL`: canonical site origin, without a trailing slash.
- `NEXT_PUBLIC_SUPABASE_URL`: project URL; safe for the browser.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: current Supabase publishable key.
- `ADMIN_EMAIL`: the only email allowed to request an admin magic link.
- `RESEND_API_KEY`: server-only Resend key.
- `EMAIL_FROM`: sender on a domain verified in Resend.

Database configuration is required explicitly for every environment. An
unconfigured preview never falls back to production. Configure a separate
Supabase project before using hosted previews for submissions. Never put a
Supabase secret or service-role key in public application code.

## Database setup

Apply migrations in `supabase/migrations/` to the connected project. Public
tables have row-level security enabled. Public forms write through validated
Server Actions using tightly limited anonymous insert policies. Authenticated
reads and updates are restricted to the configured organizer email. No elevated
database key is required by the application.

## Admin access

Open `/admin/login` and request a magic link using the configured `ADMIN_EMAIL`.
The dashboard shows registrations and business inquiries, supports manual
donation-status updates, and exports registrations as CSV.

For the production Supabase project, set the Auth Site URL to
`https://coacharena5k.com` and allow the exact redirect
`https://coacharena5k.com/auth/callback?next=/admin`. Configure custom SMTP using
the verified Resend sender: host `smtp.resend.com`, port `465`, username
`resend`, and the Resend API key as the SMTP password. Keep email confirmation
enabled. Admin access remains restricted to `5kyearrun@gmail.com` by both the
application and database policies.

Business inquiries are saved before an email notification is attempted. Set
`RESEND_API_KEY` and `EMAIL_FROM` in Vercel production to enable notifications
to `5kyearrun@gmail.com`. Messages contain the business/contact names, email,
phone, city, interest category, and message; Reply-To points to the submitter.
If delivery fails, the inquiry remains in the dashboard and the server logs
record the failure. There is currently no automatic retry queue.

## Deployment

See [Testing and release workflow](docs/testing-and-releases.md) for local
commands, regression coverage, GitHub Actions, and the current deployment rules.

The repository is intended for Vercel. Configure every environment variable in
Vercel before deploying, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin,
and add the production callback URL to Supabase Auth. Deployment is intentionally
separate from local implementation and should be approved before publishing.
