import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import type { DBShape } from "./types";

/**
 * The store, behind two drivers.
 *
 * Postgres (Neon) whenever DATABASE_URL is set, which is the case on Vercel
 * and locally once the env has been pulled; otherwise a JSON file on disk, so
 * the app still runs with nothing provisioned.
 *
 * Every collection is one table of `id` plus a JSONB `data` column. That is
 * deliberate: the domain objects are documents — a project carries its
 * products, socials and strategy inline — and shredding them into relational
 * columns would be a large migration that buys nothing at this size. The key
 * columns that exist (email, user_id, project_id) are the ones actually
 * queried or constrained.
 *
 * read/write/mutate are async now. They could not stay synchronous once the
 * data lives across a network, and every caller is already in an async server
 * context.
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

/* ------------------------------------------------------------------ */
/* schema                                                              */
/* ------------------------------------------------------------------ */

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const q = sql();
      await q`create table if not exists users (
        id text primary key,
        email text unique not null,
        data jsonb not null
      )`;
      await q`create table if not exists projects (
        id text primary key,
        user_id text not null,
        data jsonb not null
      )`;
      await q`create index if not exists projects_user_id_idx on projects (user_id)`;
      await q`create table if not exists posts (
        id text primary key,
        project_id text not null,
        data jsonb not null
      )`;
      await q`create index if not exists posts_project_id_idx on posts (project_id)`;
      await q`create table if not exists transactions (
        id text primary key,
        user_id text not null,
        data jsonb not null
      )`;
      await q`create table if not exists support_messages (
        id text primary key,
        user_id text not null,
        data jsonb not null
      )`;
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
/* public API                                                          */
/* ------------------------------------------------------------------ */

type Row = { data: unknown };
const rows = <T>(r: Row[]): T[] => r.map((x) => x.data as T);

export async function read(): Promise<DBShape> {
  if (!usingPostgres()) return readFile();

  await ensureSchema();
  const q = sql();
  const [users, projects, posts, transactions, supportMessages] = await Promise.all([
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
    supportMessages: rows(supportMessages as Row[]),
  } as DBShape;
}

export async function write(next: DBShape) {
  if (!usingPostgres()) return writeFileStore(next);

  await ensureSchema();
  const q = sql();

  // Upsert everything present, then drop anything no longer in the snapshot.
  // Written as explicit statements rather than a generic loop so each table
  // keeps its own indexed key column.
  const ids = {
    users: next.users.map((u) => u.id),
    projects: next.projects.map((p) => p.id),
    posts: next.posts.map((p) => p.id),
    transactions: next.transactions.map((t) => t.id),
    support: (next.supportMessages || []).map((m) => m.id),
  };

  await Promise.all([
    ...next.users.map(
      (u) =>
        q`insert into users (id, email, data) values (${u.id}, ${u.email}, ${JSON.stringify(u)}::jsonb)
          on conflict (id) do update set email = excluded.email, data = excluded.data`
    ),
    ...next.projects.map(
      (p) =>
        q`insert into projects (id, user_id, data) values (${p.id}, ${p.userId}, ${JSON.stringify(p)}::jsonb)
          on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`
    ),
    ...next.posts.map(
      (p) =>
        q`insert into posts (id, project_id, data) values (${p.id}, ${p.projectId}, ${JSON.stringify(p)}::jsonb)
          on conflict (id) do update set project_id = excluded.project_id, data = excluded.data`
    ),
    ...next.transactions.map(
      (t) =>
        q`insert into transactions (id, user_id, data) values (${t.id}, ${t.userId}, ${JSON.stringify(t)}::jsonb)
          on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`
    ),
    ...(next.supportMessages || []).map(
      (m) =>
        q`insert into support_messages (id, user_id, data) values (${m.id}, ${m.userId}, ${JSON.stringify(m)}::jsonb)
          on conflict (id) do update set user_id = excluded.user_id, data = excluded.data`
    ),
  ]);

  await Promise.all([
    q`delete from users where not (id = any(${ids.users}::text[]))`,
    q`delete from projects where not (id = any(${ids.projects}::text[]))`,
    q`delete from posts where not (id = any(${ids.posts}::text[]))`,
    q`delete from transactions where not (id = any(${ids.transactions}::text[]))`,
    q`delete from support_messages where not (id = any(${ids.support}::text[]))`,
  ]);
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
