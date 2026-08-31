import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import type { DBShape, User } from "./types";

/**
 * The store, behind two drivers: Neon Postgres when DATABASE_URL is set,
 * otherwise a JSON file so the app still runs with nothing provisioned.
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

export function usingPostgres(): boolean {
  return !!process.env.DATABASE_URL;
}

/** Lazily created — a top-level neon() call would throw during `next build`. */
let _sql: ReturnType<typeof neon> | null = null;
function sql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}

type Row = { data: unknown };
const rows = <T>(r: Row[]): T[] => r.map((x) => x.data as T);

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
async function upsertAll(db: DBShape) {
  const q = sql();
  const support = db.supportMessages || [];

  if (db.users.length)
    await q`insert into users (id, email, data)
            select x->>'id', x->>'email', x from jsonb_array_elements(${JSON.stringify(db.users)}::jsonb) as x
            on conflict (id) do update set email = excluded.email, data = excluded.data`;
  if (db.projects.length)
    await q`insert into projects (id, user_id, data)
            select x->>'id', x->>'userId', x from jsonb_array_elements(${JSON.stringify(db.projects)}::jsonb) as x
            on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`;
  if (db.posts.length)
    await q`insert into posts (id, project_id, data)
            select x->>'id', x->>'projectId', x from jsonb_array_elements(${JSON.stringify(db.posts)}::jsonb) as x
            on conflict (id) do update set project_id = excluded.project_id, data = excluded.data`;
  if (db.transactions.length)
    await q`insert into transactions (id, user_id, data)
            select x->>'id', x->>'userId', x from jsonb_array_elements(${JSON.stringify(db.transactions)}::jsonb) as x
            on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`;
  if (support.length)
    await q`insert into support_messages (id, user_id, data)
            select x->>'id', x->>'userId', x from jsonb_array_elements(${JSON.stringify(support)}::jsonb) as x
            on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`;
}

/* ------------------------------------------------------------------ */
/* scoped access — prefer these                                        */
/* ------------------------------------------------------------------ */

export async function getUserById(id: string): Promise<User | null> {
  if (!usingPostgres()) return readFile().users.find((u) => u.id === id) || null;
  await ensureSchema();
  const r = (await sql()`select data from users where id = ${id} limit 1`) as Row[];
  return (r[0]?.data as User) || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const key = email.trim().toLowerCase();
  if (!usingPostgres()) return readFile().users.find((u) => u.email.toLowerCase() === key) || null;
  await ensureSchema();
  const r = (await sql()`select data from users where lower(email) = ${key} limit 1`) as Row[];
  return (r[0]?.data as User) || null;
}

export async function insertUser(user: User): Promise<void> {
  if (!usingPostgres()) {
    const db = readFile();
    db.users.push(user);
    writeFileStore(db);
    return;
  }
  await ensureSchema();
  await sql()`insert into users (id, email, data)
              values (${user.id}, ${user.email}, ${JSON.stringify(user)}::jsonb)`;
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
  await sql()`update users set email = ${user.email}, data = ${JSON.stringify(user)}::jsonb where id = ${id}`;
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
  const [users, projects, posts, transactions, support] = await Promise.all([
    q`select data from users where id = ${userId}`,
    q`select data from projects where user_id = ${userId}`,
    q`select p.data from posts p join projects r on r.id = p.project_id where r.user_id = ${userId}`,
    q`select data from transactions where user_id = ${userId}`,
    q`select data from support_messages where user_id = ${userId}`,
  ]);

  return {
    users: rows(users as Row[]),
    projects: rows(projects as Row[]),
    posts: rows(posts as Row[]),
    transactions: rows(transactions as Row[]),
    supportMessages: rows(support as Row[]),
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
  const q = sql();
  await upsertAll(slice);

  const projectIds = slice.projects.map((p) => p.id);
  const postIds = slice.posts.map((p) => p.id);
  await q`delete from projects where user_id = ${userId} and not (id = any(${projectIds}::text[]))`;
  await q`delete from posts where project_id = any(${projectIds}::text[])
          and not (id = any(${postIds}::text[]))`;

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
    users: rows(users as Row[]),
    projects: rows(projects as Row[]),
    posts: rows(posts as Row[]),
    transactions: rows(transactions as Row[]),
    supportMessages: rows(support as Row[]),
  } as DBShape;
}

export async function write(next: DBShape) {
  if (!usingPostgres()) return writeFileStore(next);
  await ensureSchema();
  const q = sql();
  await upsertAll(next);
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

export function uid(prefix = "") {
  const s = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  return prefix ? `${prefix}_${s}` : s;
}
