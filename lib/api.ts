import { NextResponse } from "next/server";
import { currentUser } from "./auth";
import type { User } from "./types";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser(): Promise<{ user: User } | { response: NextResponse }> {
  const user = await currentUser();
  if (!user) return { response: fail("Not signed in", 401) };
  return { user };
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}
