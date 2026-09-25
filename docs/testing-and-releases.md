# Testing and release workflow

## How this site currently reaches production

Vercel project `coach-arena-5k` is linked to `Khalid-Itani/5kAnniversary`, with
`main` configured as its production branch. A push/merge to `main` can deploy
production. Other branches get Vercel previews.

The September recovery fixes were deployed using `vercel deploy --prod` from
the local working directory. That uploads files even if they are uncommitted.
Saving, staging, or committing locally does not itself update the live site.
This is why the live site had fixes that GitHub did not yet contain.

The new GitHub workflow runs tests; it does not deploy or change production
credentials. `vercel.json` additionally runs lint, TypeScript and Vitest before
Vercel builds. Full browser checks must be required on the PR before merging.
Do not assume that a green Vercel build means the separate browser job passed.

## Commands

Use Node 24 and npm. On Windows PowerShell, use `npm.cmd`/`npx.cmd` if the
execution policy blocks `npm.ps1`.

```sh
npm ci
npm run check             # lint, TypeScript and all Vitest tests
npm run test:watch        # rerun relevant Vitest tests while editing
npx playwright install chromium
npm run test:smoke        # browser smoke tests; no database or Docker needed
```

Full tests require Docker Desktop locally (Linux containers); GitHub's Ubuntu
runner already has Docker. No paid accounts or production secrets are needed.

```sh
npm run test:stack:start  # disposable local Supabase; applies checked-in migrations
npm run test:e2e          # production build + desktop and mobile Chromium tests
npm run test:e2e:ui       # interactive test runner for debugging
npm run test:report       # HTML results and failure traces
npm run test:stack:stop   # removes the disposable stack without saving its data
```

The runner starts its own server on `127.0.0.1:3100`, with a separate
`.next-test` build. It refuses non-local database endpoints, overrides local
production environment variables, and disables Resend sending. Auth emails
stay in the local mail catcher. Generated keys, reports and state are ignored
by Git. Do not add production credentials to these tests.

After editing migrations, stop and restart the disposable stack so every
migration is applied from scratch. The stack is dedicated to testing and its
contents may be discarded. Never point these commands at a hosted project.

## What gets retested

| Layer | Coverage |
|---|---|
| Vitest | Validation, email contents/recipient, delivery failures, save-before-notify, organizer allowlist, cookie-free public clients, no production fallback |
| Playwright smoke | Public pages, mobile overflow, empty form errors, unauthorized login/admin/export, failed auth callback |
| Playwright with real local Supabase | Registration and business forms signed in/out, duplicate registration, invalid inputs, saved records, admin updates/export/sign-out, RLS and grants |

The signed-in form tests are regressions for PostgreSQL `42501`: organizer
cookies previously changed the database role and broke INSERTs. They establish
a real local Supabase session, submit the visible form and inspect the saved
record. They would fail if the public form used the cookie-bearing client again.

Session fixtures use the local Auth API; they do not pretend to validate real
Gmail delivery. Email template/delivery-error behavior is covered by Vitest.
Before changing SMTP/DNS/provider configuration, separately check a controlled
live sign-in and business notification. Unit tests cannot detect a paused
hosted database, DNS failures, email quotas or provider outages.

For every change:

1. Write/update a test for the intended new behavior.
2. For a bug, first demonstrate the new test fails on the broken behavior.
3. Fix it; rerun the targeted test, then the complete required suites.
4. Keep existing tests unless the requirements actually changed. Do not delete
   failing assertions just to make CI green.
5. Manually review changed layouts on desktop and a real phone, keyboard
   navigation and any new error messages. Mobile Chromium emulation is not Safari.

## Learn GitHub Actions with this repository

Open `.github/workflows/ci.yml`. A **workflow** is an automated recipe. An
**event** starts it (push, pull request, or manual dispatch). A **job** runs on a
fresh GitHub-hosted machine called a **runner**. A **step** runs a command or
reusable action. An **artifact** is an uploaded result such as a test report.

This workflow has two independent jobs: `Quality checks` and `Browser and
database regression`. The browser job creates a fresh database and production
build, runs both browser sizes, uploads failure evidence, then stops the stack.
It requests only read access to repository contents and uses no repository secrets.

Practice:

1. Create a feature branch: `git switch -c feat/my-change`.
2. Edit code and tests, then run `npm run check` and the relevant browser tests.
3. Review `git diff`, stage specific files, and commit: `git commit -m "feat: describe change"`.
4. Push: `git push -u origin feat/my-change`, then open a PR targeting `main`.
5. In the PR's Checks tab, open each job. Expand a failed step to read its log.
6. In the repository's Actions tab, open the run and download
   `browser-test-report`. Open its trace to inspect a failed browser interaction.
7. Push a fix to the same branch; checks rerun automatically.
8. Merge only when required checks pass and the preview/manual review is done.

To practice a failure safely, change an expected value in a test on your feature
branch, push it, inspect the red check, then correct it. Never merge that exercise.
`workflow_dispatch` also enables a Run workflow button once the workflow is on
the default branch. A local YAML file does not run on GitHub until pushed.

## Enforce the release gate

At setup inspection, `main` was unprotected. In GitHub Settings → Rules →
Rulesets (or Branches), protect `main`, require a pull request and require:

- `Quality checks`
- `Browser and database regression`

Require the branch to be up to date, and prevent direct pushes/bypasses as
appropriate for the repository owner. These are GitHub repository settings,
not settings that a workflow file can turn on. Until configured, a failing CI
job does not prevent a direct main push and its Vercel deployment.

Vercel previews need their own database configuration to test writes; otherwise
they show setup errors. CI runs a complete isolated app and database regardless.
For urgent CLI releases, first commit the exact source, pass the full test suite,
then deploy and record the commit/deployment URL. A source rollback does not undo
database migrations; keep migrations backward compatible when possible.

## References

- [Playwright and GitHub Actions](https://playwright.dev/docs/ci-intro)
- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [Vercel Git deployments](https://vercel.com/docs/git)
