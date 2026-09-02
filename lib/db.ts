import fs from "fs";
import path from "path";
import postgres from "postgres";
import type { DBShape, User } from "./types";

/**
 * The store, behind two drivers: Postgres when DATABASE_URL is set, otherwise
 * a JSON file so the app still runs with nothing provisioned.
 *
 * Every collection is one table of `id` plus a JSONB `data` column. The domain
 * objects are documents — a project carries its products, socials and strategy
 * inline — so shredding them into relational columns would be a large
 * migration that buys nothing at this size. The key columns that exist
 * (email, user_id, project_id) are the ones actually queried.
 *
 * Prefer the scoped functions. read()/write() move the entire database, which
 * is how the JSON file always behaved and was carried over unchanged. That was
 * a mistake: every authenticated request pulled every post belonging to every
 * user, and every credit decrement rewrote them all again. On a metered
 * database that does not merely run slowly, it exhausts the transfer quota and
 * the app stops answering. They remain only for genuinely global callers.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const EMPTY: DBShape = { users: [], projects: [], posts: [], transactions: [], supportMessages: [] };

/**
 * The connection string, whichever name the provider used.
 *
 * The Supabase integration injects `POSTGRES_URL` and never `DATABASE_URL`.
 * Reading only the latter meant the app quietly fell back to the JSON file
 * store in production — writes would land on an ephemeral serverless disk and
 * vanish on the next request, with no error anywhere to explain it.
 *
 * `DATABASE_URL` still wins when set, so a manual override works.
 *
 * `POSTGRES_URL` is the pooled connection (port 6543). Prefer it over
 * `POSTGRES_URL_NON_POOLING`, which opens a backend per invocation and
 * exhausts the connection limit under any real concurrency.
 */
function connectionString(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export function usingPostgres(): boolean {
  return !!connectionString();
}

/**
 * Lazily created — constructing a client at module scope would throw during
 * `next build`, when DATABASE_URL is not necessarily present.
 *
 * The options matter for a pooled, serverless deployment:
 *
 * - `prepare: false` is required by Supabase's transaction-mode pooler
 *   (Supavisor, port 6543). It hands each transaction whichever backend is
 *   free, so a prepared statement created on one connection is not there on
 *   the next. Leaving this on produces intermittent "prepared statement does
 *   not exist" errors under load rather than a clean failure.
 * - `max` must not be 1. It was, and it made a demo seed take 6.7 minutes
 *   instead of 0.8 seconds: `readForUser` fans five queries out with
 *   Promise.all, and on a single connection they serialise behind each other
 *   while every other request in the process waits its turn. Fluid Compute
 *   reuses one instance across concurrent requests, so this bites in
 *   production too, not just against a long-lived dev server. It stays small
 *   because connections are multiplied by the number of live instances.
 * - `ssl: "require"` because every hosted provider expects TLS, and the
 *   connection strings they hand out do not always carry `sslmode`.
 */
let _sql: ReturnType<typeof postgres> | null = null;
function sql() {
  if (!_sql) {
    _sql = postgres(connectionString()!, {
      prepare: false,
      max: process.env.VERCEL ? 3 : 5,
      idle_timeout: 20,
      connect_timeout: 15,
      ssl: "require",
    });
  }
  return _sql;
}

/**
 * Every table is `id` plus a JSONB `data` column, so every read unwraps the
 * same shape. Taking `unknown` here keeps the driver's own row type out of the
 * call sites — postgres.js exports a `Row` of its own, and casting between the
 * two at twenty places was noise that hid nothing useful.
 */
type DataRow = { data: unknown };
const rows = <T>(result: unknown): T[] => (result as DataRow[]).map((x) => x.data as T);
const first = <T>(result: unknown): T | null => (result as DataRow[])[0]?.data as T ?? null;

/**
 * postgres.js types its JSON parameter as a structural JSONValue, which plain
 * interfaces do not satisfy without an index signature. These are all plain
 * serialisable documents, so the cast is safe and beats widening every domain
 * type just to appease the driver.
 */
type DriverJson = Parameters<ReturnType<typeof postgres>["json"]>[0];
const asJson = (value: unknown) => value as DriverJson;

/* ------------------------------------------------------------------ */
/* schema                                                              */
/* ------------------------------------------------------------------ */

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const q = sql();
      await q`create table if not exists users (
        id text primary key, email text unique not null, data jsonb not null)`;
      await q`create table if not exists projects (
        id text primary key, user_id text not null, data jsonb not null)`;
      await q`create index if not exists projects_user_id_idx on projects (user_id)`;
      await q`create table if not exists posts (
        id text primary key, project_id text not null, data jsonb not null)`;
      await q`create index if not exists posts_project_id_idx on posts (project_id)`;
      await q`create table if not exists transactions (
        id text primary key, user_id text not null, data jsonb not null)`;
      await q`create index if not exists transactions_user_id_idx on transactions (user_id)`;
      await q`create table if not exists support_messages (
        id text primary key, user_id text not null, data jsonb not null)`;
    })().catch((err) => {
      // Let the next call retry rather than caching a failed bootstrap.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

/* ------------------------------------------------------------------ */
/* file driver                                                         */
/* ------------------------------------------------------------------ */

let cache: DBShape | null = null;
let cacheStamp = "";

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY, null, 2));
}

/** Identity of the file on disk, so we can tell when someone else has written. */
function stamp(): string {
  try {
    const s = fs.statSync(DB_FILE);
    return `${s.mtimeMs}:${s.size}`;
  } catch {
    return "";
  }
}

function readFile(): DBShape {
  ensureFile();
  const current = stamp();
  if (cache && current === cacheStamp) return cache;
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8")) as Partial<DBShape>;
    cache = { ...EMPTY, ...parsed };
  } catch {
    cache = { ...EMPTY };
  }
  cacheStamp = current;
  return cache;
}

function writeFileStore(next: DBShape) {
  ensureFile();
  cache = next;
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(next, null, 2));
  fs.renameSync(tmp, DB_FILE);
  cacheStamp = stamp();
}

/* ------------------------------------------------------------------ */
/* bulk upsert                                                         */
/* ------------------------------------------------------------------ */

/**
 * One statement per table rather than one per row. Saving a project once meant
 * ninety concurrent inserts through the serverless driver; that burst failed
 * intermittently and left projects with none of their posts. Expanding a JSON
 * array server-side keeps it to a single round trip at any row count.
 */
type Runner = ReturnType<typeof postgres>;

async function upsertAll(db: DBShape, q: Runner) {
  const support = db.supportMessages || [];

  if (db.users.length)
    await q`insert into users (id, email, data)
            select x->>'id', x->>'email', x from jsonb_array_elements(${q.json(asJson(db.users))}::jsonb) as x
            on conflict (id) do update set email = excluded.email, data = excluded.data`;
  if (db.projects.length)
    await q`insert into projects (id, user_id, data)
            select x->>'id', x->>'userId', x from jsonb_array_elements(${q.json(asJson(db.projects))}::jsonb) as x
            on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`;
  if (db.posts.length)
    await q`insert into posts (id, project_id, data)
            select x->>'id', x->>'projectId', x from jsonb_array_elements(${q.json(asJson(db.posts))}::jsonb) as x
            on conflict (id) do update set project_id = excluded.project_id, data = excluded.data`;
  if (db.transactions.length)
    await q`insert into transactions (id, user_id, data)
            select x->>'id', x->>'userId', x from jsonb_array_elements(${q.json(asJson(db.transactions))}::jsonb) as x
            on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`;
  if (support.length)
    await q`insert into support_messages (id, user_id, data)
            select x->>'id', x->>'userId', x from jsonb_array_elements(${q.json(asJson(support))}::jsonb) as x
            on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`;
}

/* ------------------------------------------------------------------ */
/* scoped access — prefer these                                        */
/* ------------------------------------------------------------------ */

export async function getUserById(id: string): Promise<User | null> {
  if (!usingPostgres()) return readFile().users.find((u) => u.id === id) || null;
  await ensureSchema();
  return first<User>(await sql()`select data from users where id = ${id} limit 1`);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const key = email.trim().toLowerCase();
  if (!usingPostgres()) return readFile().users.find((u) => u.email.toLowerCase() === key) || null;
  await ensureSchema();
  return first<User>(await sql()`select data from users where lower(email) = ${key} limit 1`);
}

export async function insertUser(user: User): Promise<void> {
  if (!usingPostgres()) {
    const db = readFile();
    db.users.push(user);
    writeFileStore(db);
    return;
  }
  await ensureSchema();
  const q = sql();
  await q`insert into users (id, email, data)
          values (${user.id}, ${user.email}, ${q.json(asJson(user))}::jsonb)`;
}

/** Reads one user, applies a change, writes back that single row. */
export async function updateUser<T>(id: string, fn: (u: User) => T): Promise<T | null> {
  if (!usingPostgres()) {
    const db = readFile();
    const u = db.users.find((x) => x.id === id);
    if (!u) return null;
    const out = fn(u);
    writeFileStore(db);
    return out;
  }
  const user = await getUserById(id);
  if (!user) return null;
  const out = fn(user);
  const q = sql();
  await q`update users set email = ${user.email}, data = ${q.json(asJson(user))}::jsonb where id = ${id}`;
  return out;
}

/** Everything belonging to one account, and nothing belonging to anyone else. */
export async function readForUser(userId: string): Promise<DBShape> {
  if (!usingPostgres()) {
    const db = readFile();
    const mine = new Set(db.projects.filter((p) => p.userId === userId).map((p) => p.id));
    return {
      users: db.users.filter((u) => u.id === userId),
      projects: db.projects.filter((p) => p.userId === userId),
      posts: db.posts.filter((p) => mine.has(p.projectId)),
      transactions: db.transactions.filter((t) => t.userId === userId),
      supportMessages: (db.supportMessages || []).filter((m) => m.userId === userId),
    } as DBShape;
  }

  await ensureSchema();
  const q = sql();

  /*
   * One round trip, not five.
   *
   * This used to fan five queries out with Promise.all. Against Supabase's
   * transaction-mode pooler that produced reads which lagged behind committed
   * writes by a second or more — a project created and immediately listed came
   * back missing, while a separate connection could already see it. Collapsing
   * the reads into a single statement removes the pipelining that caused it,
   * and costs four fewer round trips while it is at it.
   */
  const [slice] = (await q`
    select
      (select coalesce(json_agg(data), '[]'::json) from users where id = ${userId}) as users,
      (select coalesce(json_agg(data), '[]'::json) from projects where user_id = ${userId}) as projects,
      (select coalesce(json_agg(p.data), '[]'::json) from posts p
         join projects r on r.id = p.project_id where r.user_id = ${userId}) as posts,
      (select coalesce(json_agg(data), '[]'::json) from transactions where user_id = ${userId}) as transactions,
      (select coalesce(json_agg(data), '[]'::json) from support_messages where user_id = ${userId}) as support
  `) as unknown as {
    users: DBShape["users"];
    projects: DBShape["projects"];
    posts: DBShape["posts"];
    transactions: DBShape["transactions"];
    support: DBShape["supportMessages"];
  }[];

  return {
    users: slice.users,
    projects: slice.projects,
    posts: slice.posts,
    transactions: slice.transactions,
    supportMessages: slice.support,
  } as DBShape;
}

/**
 * Applies a change to one account and writes back only that account's rows.
 * Deletes are scoped to the account, so a slice can never remove data
 * belonging to anyone else the way a whole-database write can.
 */
export async function mutateForUser<T>(userId: string, fn: (db: DBShape) => T): Promise<T> {
  const slice = await readForUser(userId);
  const result = fn(slice);

  if (!usingPostgres()) {
    const db = readFile();
    const merge = <T2 extends { id: string }>(all: T2[], next: T2[]) => {
      const map = new Map(all.map((x) => [x.id, x]));
      for (const x of next) map.set(x.id, x);
      return [...map.values()];
    };
    const kept = new Set(slice.projects.map((p) => p.id));
    const mine = new Set(db.projects.filter((p) => p.userId === userId).map((p) => p.id));
    writeFileStore({
      ...db,
      users: merge(db.users, slice.users),
      projects: merge(db.projects, slice.projects).filter(
        (p) => p.userId !== userId || kept.has(p.id)
      ),
      posts: merge(db.posts, slice.posts).filter(
        (p) => !mine.has(p.projectId) || kept.has(p.projectId)
      ),
      transactions: merge(db.transactions, slice.transactions),
      supportMessages: merge(db.supportMessages || [], slice.supportMessages || []),
    });
    return result;
  }

  await ensureSchema();
  const projectIds = slice.projects.map((p) => p.id);
  const postIds = slice.posts.map((p) => p.id);

  /*
   * One transaction, for two reasons.
   *
   * Atomicity: the upserts and the tidy-up deletes were separate autocommits,
   * so a failure between them left a half-written account behind.
   *
   * Visibility: separate autocommits over a pooled connection left a window of
   * about a second where a freshly created project was invisible to the very
   * next read, while a different connection could already see it. A single
   * commit removes the window.
   */
  await sql().begin(async (tx) => {
    await upsertAll(slice, tx as unknown as Runner);
    await tx`delete from projects where user_id = ${userId} and not (id = any(${projectIds}::text[]))`;
    await tx`delete from posts where project_id = any(${projectIds}::text[])
             and not (id = any(${postIds}::text[]))`;
  });

  return result;
}

/* ------------------------------------------------------------------ */
/* whole-database access — only for genuinely global callers           */
/* ------------------------------------------------------------------ */

export async function read(): Promise<DBShape> {
  if (!usingPostgres()) return readFile();
  await ensureSchema();
  const q = sql();
  const [users, projects, posts, transactions, support] = await Promise.all([
    q`select data from users`,
    q`select data from projects`,
    q`select data from posts`,
    q`select data from transactions`,
    q`select data from support_messages`,
  ]);
  return {
    users: rows(users),
    projects: rows(projects),
    posts: rows(posts),
    transactions: rows(transactions),
    supportMessages: rows(support),
  } as DBShape;
}

export async function write(next: DBShape) {
  if (!usingPostgres()) return writeFileStore(next);
  await ensureSchema();
  const q = sql();
  await upsertAll(next, q);
  await q`delete from users where not (id = any(${next.users.map((u) => u.id)}::text[]))`;
  await q`delete from projects where not (id = any(${next.projects.map((p) => p.id)}::text[]))`;
  await q`delete from posts where not (id = any(${next.posts.map((p) => p.id)}::text[]))`;
  await q`delete from transactions where not (id = any(${next.transactions.map((t) => t.id)}::text[]))`;
  await q`delete from support_messages where not (id = any(${(next.supportMessages || []).map((m) => m.id)}::text[]))`;
}

export async function mutate<T>(fn: (db: DBShape) => T): Promise<T> {
  const db = await read();
  const result = fn(db);
  await write(db);
  return result;
}

/**
 * Cheapest possible round trip to the database.
 *
 * Used by the health route and the keep-alive cron. Deliberately does not call
 * ensureSchema — this must stay a single trivial statement so it costs no
 * measurable egress on a metered plan, and so a schema problem shows up as a
 * schema error rather than a connectivity one.
 */
export async function pingDatabase(): Promise<void> {
  await sql()`select 1`;
}

export function uid(prefix = "") {
  const s = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  return prefix ? `${prefix}_${s}` : s;
}
