"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons/Ui";

const TOPICS: { key: string; label: string; icon: IconName }[] = [
  { key: "content", label: "Something in my month is wrong", icon: "calendar" },
  { key: "billing", label: "Billing or my plan", icon: "tag" },
  { key: "bug", label: "Something is broken", icon: "bolt" },
  { key: "feature", label: "I want something added", icon: "sparkle" },
  { key: "other", label: "Something else", icon: "megaphone" },
];

export default function ContactForm({ name, email }: { name: string; email: string }) {
  const [topic, setTopic] = useState("content");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function send() {
    if (message.trim().length < 10) {
      setError("Tell us a little more so we can actually help.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, message }),
      });
      const raw = await res.text();
      let data: { error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError(`The server returned an unexpected reply (${res.status}).`);
        setState("error");
        return;
      }
      if (!res.ok) {
        setError(data.error || `Could not send (${res.status}).`);
        setState("error");
        return;
      }
      setState("sent");
      setMessage("");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="panel p-7 text-center">
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#C8F751]/15 text-[#C8F751]">
          <Icon name="checkCircle" size={22} />
        </span>
        <h2 className="display text-xl">Message received.</h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[#9B9BAE]">
          We reply to {email} within one working day. If it is urgent and about a post going out
          today, say so in a follow-up and we will jump the queue.
        </p>
        <button onClick={() => setState("idle")} className="btn btn-ghost btn-sm mt-5">
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="panel p-6 sm:p-7">
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-[#7E7E93]">From</p>
          <p className="mt-0.5 truncate text-[14px] text-white">{name}</p>
        </div>
        <div className="rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-[#7E7E93]">We reply to</p>
          <p className="mt-0.5 truncate text-[14px] text-white">{email}</p>
        </div>
      </div>

      <label className="label">What is this about?</label>
      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTopic(t.key)}
            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-start text-[13.5px] transition-colors ${
              topic === t.key
                ? "border-[#7C5CFF] bg-[#7C5CFF]/12 text-white"
                : "border-[#1E1E28] bg-white/[0.02] text-[#9B9BAE] hover:border-[#3A3355]"
            }`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <label className="label" htmlFor="message">
        Your message
      </label>
      <textarea
        id="message"
        className="input"
        rows={6}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (state === "error") setState("idle");
        }}
        placeholder="Day 14 has the wrong product in the image, and the caption is in English when the rest of the month is Kuwaiti Arabic."
      />

      {state === "error" && (
        <p className="mt-3 rounded-lg border border-[#FF6B8A]/30 bg-[#FF6B8A]/10 px-3 py-2.5 text-[13px] text-[#FF6B8A]">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={send} className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[12px] text-[#7E7E93]">Replies within one working day.</p>
      </div>
    </div>
  );
}
