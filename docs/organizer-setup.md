# Organizer and email setup

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

The database policies currently allow `5kyearrun@gmail.com`. Changing
`ADMIN_EMAIL` alone does not change database access; update the policies through
a reviewed migration if the organizer changes.

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

Registration receipt emails also use `RESEND_API_KEY` and `EMAIL_FROM`. They are
attempted after the registration is saved and explain that donation verification
is still pending. Updating a donation status in the dashboard does not currently
send a confirmation email automatically.
