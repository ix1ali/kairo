# Database setup (Supabase)

The app talks to any Postgres through a single connection string. The driver is
`postgres.js`, configured in `lib/db.ts` for a pooled serverless deployment.

## 1. Accept the marketplace terms

The CLI cannot do this for you:

https://vercel.com/hayakel/~/integrations/accept-terms/supabase?source=cli

Then either retry `vercel integration add supabase`, which provisions the
project and injects the environment variables, or create a project directly at
supabase.com and copy the connection string yourself.

## Provisioned

`vercel integration add supabase` created **supabase-fuchsia-helmet** and
connected it to the `koala` project. The stale Neon variables were removed
first — the install refuses to overwrite existing names.

Note the integration injects **`POSTGRES_URL`**, not `DATABASE_URL`. The code
reads either (`connectionString()` in `lib/db.ts`); if it had only read
`DATABASE_URL` the app would have silently fallen back to the JSON file store
in production and lost every write.

## 2. Use the right connection string

Supabase offers three. **Use the Transaction pooler.**

| String | Port | Use it? |
|---|---|---|
| Direct connection | 5432 | No — IPv6-only, and one connection per serverless invocation exhausts the limit |
| Session pooler | 5432 | No — holds a backend for the whole session |
| **Transaction pooler** | **6543** | **Yes** — a backend per transaction, which is what short-lived functions need |

```bash
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

`lib/db.ts` already sets `prepare: false`, which the transaction pooler
requires — it hands each transaction whichever backend is free, so a prepared
statement made on one is missing on the next. Without it you get intermittent
"prepared statement does not exist" errors under load rather than a clean
failure.

## 3. Replace the old variables

Production still carries the Neon variables. Remove them, or they will confuse
whoever reads the project next:

```bash
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production        # paste the pooler string
```

The `PG*`, `POSTGRES_*` and `NEON_PROJECT_ID` entries are unused by this
codebase — only `DATABASE_URL` is read (`usingPostgres()` in `lib/db.ts`).

Locally, uncomment `DATABASE_URL` in `.env.local` and replace its value.

## 4. Schema

There is no migration step. `ensureSchema()` creates the five tables and their
indexes on the first query, so the first request against an empty database sets
it up.

## The inactivity pause

**Supabase pauses free projects after one week of no activity**, and resuming
is manual. For a live product that means the first visitor after a quiet week
finds a broken site.

`vercel.json` schedules a daily cron against `/api/health/db`, which runs
`select 1`. That keeps the project active and costs no measurable egress.

Set `CRON_SECRET` in Vercel and the endpoint refuses anything without it, so it
cannot be used as a public availability probe. Vercel sends the header
automatically on cron invocations.

Note the Hobby plan only permits daily crons. That is well inside the one-week
window, but if you ever drop the cron, the pause comes back.

## Watching the 5 GB egress allowance

The free tier includes 5 GB of egress per month. Measured against the current
data, one dashboard load reads about **628 KB** — every post belonging to the
user, including captions, prompts and art direction, to render counts and six
upcoming items. That is roughly **8,350 dashboard loads per month**.

Two changes would cut it by around 90% and are worth doing before real traffic:

- The overview needs `count(*)` and `limit 6`, not all rows
- The calendar grid needs day, status, hook and platform — not the caption,
  visual prompt, art direction and revision history

Until then, treat 5 GB as the real ceiling on how much the app can be used.
