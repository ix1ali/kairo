import fs from "fs";
import path from "path";
import type { DBShape } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const EMPTY: DBShape = { users: [], projects: [], posts: [], transactions: [] };

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY, null, 2));
}

let cache: DBShape | null = null;
let cacheStamp = "";

/** Identity of the file on disk, so we can tell when someone else has written. */
function stamp(): string {
  try {
    const s = fs.statSync(DB_FILE);
    return `${s.mtimeMs}:${s.size}`;
  } catch {
    return "";
  }
}

/**
 * Reads the store, reloading whenever the file has changed underneath us.
 * Without the freshness check a second module instance (dev HMR, or a second
 * server process) would keep serving a snapshot taken at its first read.
 */
export function read(): DBShape {
  ensure();
  const current = stamp();
  if (cache && current === cacheStamp) return cache;
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DBShape>;
    cache = { ...EMPTY, ...parsed };
  } catch {
    cache = { ...EMPTY };
  }
  cacheStamp = current;
  return cache!;
}

export function write(next: DBShape) {
  ensure();
  cache = next;
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(next, null, 2));
  fs.renameSync(tmp, DB_FILE);
  cacheStamp = stamp();
}

export function mutate<T>(fn: (db: DBShape) => T): T {
  const db = read();
  const result = fn(db);
  write(db);
  return result;
}

export function uid(prefix = "") {
  const s = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  return prefix ? `${prefix}_${s}` : s;
}
