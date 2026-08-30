import crypto from "crypto";
import { cookies } from "next/headers";
import { read, mutate, uid } from "./db";
import type { User } from "./types";

const COOKIE = "koala_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return process.env.AUTH_SECRET || "koala-dev-secret-change-me-in-production";
}

export function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 64).toString("hex");
  return { salt: s, passwordHash: hash };
}

export function verifyPassword(password: string, salt: string, expected: string) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createToken(userId: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  if (sign(`${userId}.${exp}`) !== sig) return null;
  if (Number(exp) < Date.now()) return null;
  return userId;
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  const db = read();
  return db.users.find((u) => u.id === userId) || null;
}

export function publicUser(u: User) {
  const { passwordHash, salt, ...rest } = u;
  void passwordHash;
  void salt;
  return rest;
}

export function createUser(email: string, name: string, password: string): User {
  const { salt, passwordHash } = hashPassword(password);
  const user: User = {
    id: uid("usr"),
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    packageId: null,
    subscriptionStatus: "none",
    renewsAt: null,
    credits: 0,
    onboarded: false,
  };
  mutate((db) => db.users.push(user));
  return user;
}
