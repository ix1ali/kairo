"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import type { User } from "@/lib/types";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan");
  const seedUrl = params.get("url");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      });

      // Read as text first. A server that fell over answers with an HTML error
      // page, and calling res.json() on that throws — which used to surface as
      // "Network error" and sent people hunting for a connection problem that
      // was not there.
      const raw = await res.text();
      let data: { error?: string; user?: User } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError(
          res.ok
            ? "The server sent something unexpected. Reload the page and try again."
            : `The server returned an error (${res.status}). Try again in a moment.`
        );
        setBusy(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || `Something went wrong (${res.status}).`);
        setBusy(false);
        return;
      }
      const user = data.user;
      if (!user) {
        setError("The server did not return an account. Try again.");
        setBusy(false);
        return;
      }
      const qs = new URLSearchParams();
      if (plan) qs.set("plan", plan);
      if (seedUrl) qs.set("url", seedUrl);
      const suffix = qs.toString() ? `?${qs}` : "";
      if (!user.packageId || user.subscriptionStatus !== "active") {
        router.push(`/dashboard/billing${suffix}`);
      } else {
        router.push(seedUrl ? `/dashboard/projects/new${suffix}` : "/dashboard");
      }
      router.refresh();
    } catch {
      // Only a genuine transport failure reaches here now.
      setError("Could not reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#6D4DF6]/16 blur-[120px]" />

      <div className="relative w-full max-w-[26rem]">
        <div className="mb-8 flex justify-center">
          <Logo size={34} />
        </div>

        <div className="panel p-7">
          <h1 className="display text-2xl">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-1.5 text-sm text-[#6B6678]">
            {isSignup
              ? "Set up your brand and get thirty days of content."
              : "Log in to your calendar and projects."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {isSignup && (
              <div>
                <label className="label" htmlFor="name">
                  Your name
                </label>
                <input
                  id="name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbrand.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "At least 8 characters" : "••••••••"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                minLength={isSignup ? 8 : undefined}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-[#DB2777]/30 bg-[#DB2777]/10 px-3 py-2.5 text-[13px] text-[#DB2777]">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary w-full py-3" disabled={busy}>
              {busy ? "One moment…" : isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-[#6E697E]">
            {isSignup ? "Already have an account? " : "New to Koala? "}
            <Link
              href={isSignup ? "/login" : `/signup${plan ? `?plan=${plan}` : ""}`}
              className="font-semibold text-[#6D4DF6] hover:text-[#5B3FE0]"
            >
              {isSignup ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[#6E697E]">
          {isSignup
            ? "You will choose a plan next. There is no free trial — every plan delivers a full 30-day campaign immediately."
            : "Trouble signing in? Check the email address you registered with."}
        </p>

        <p className="mt-4 text-center">
          <Link href="/" className="text-[12px] text-[#6E697E] hover:text-[#615D70]">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
