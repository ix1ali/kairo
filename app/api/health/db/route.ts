import { usingPostgres, pingDatabase } from "@/lib/db";

/**
 * Database heartbeat.
 *
 * Supabase pauses a free project after a week without activity, and a paused
 * project has to be resumed by hand in the dashboard. For a live product that
 * means the first customer after a quiet week finds a broken site. A daily
 * cron hitting this endpoint keeps the project counted as active.
 *
 * It doubles as a monitoring check: a 200 here means the app can reach its
 * database, which is the thing that actually broke last time.
 *
 * The query is deliberately `select 1` — it costs no measurable egress, which
 * matters on a 5 GB monthly allowance.
 */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Vercel signs cron invocations when CRON_SECRET is set. When it is, refuse
  // anything else, so this cannot be used to keep a database warm on someone
  // else's behalf or to probe availability.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = req.headers.get("authorization");
    if (header !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  if (!usingPostgres()) {
    return Response.json({ ok: true, driver: "file", note: "No DATABASE_URL set." });
  }

  const started = Date.now();
  try {
    await pingDatabase();
    return Response.json({ ok: true, driver: "postgres", ms: Date.now() - started });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[koala:health] database unreachable", message);
    return Response.json(
      { ok: false, driver: "postgres", ms: Date.now() - started, error: message.slice(0, 300) },
      { status: 503 }
    );
  }
}
