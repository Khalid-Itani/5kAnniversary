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

The connected Supabase project URL and publishable key also have safe public
defaults in `src/lib/supabase/config.ts`, so a Vercel deployment can accept
registrations before environment variables are added. Override those values in
Vercel when rotating the publishable key or moving to another project. Never put
a Supabase secret or service-role key in this file.

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

## Deployment

The repository is intended for Vercel. Configure every environment variable in
Vercel before deploying, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin,
and add the production callback URL to Supabase Auth. Deployment is intentionally
separate from local implementation and should be approved before publishing.
