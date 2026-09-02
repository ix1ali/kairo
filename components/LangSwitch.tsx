"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LANGS, type Lang } from "@/lib/i18n";
import { useLang } from "@/components/LangProvider";

export default function LangSwitch({ compact = false }: { compact?: boolean }) {
  const current = useLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<Lang | null>(null);

  async function choose(lang: Lang) {
    if (lang === current) return;
    setBusy(lang);
    await fetch("/api/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
    startTransition(() => {
      router.refresh();
      setBusy(null);
    });
  }

  return (
    <div
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-0.5 ${
        pending ? "opacity-70" : ""
      }`}
    >
      {LANGS.map((l) => {
        const on = l.code === current;
        return (
          <button
            key={l.code}
            onClick={() => choose(l.code)}
            aria-pressed={on}
            className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
              on ? "bg-[#0B0B12]/[0.07] text-[#0B0B12]" : "text-[#6E6E85] hover:text-[#0B0B12]"
            } ${busy === l.code ? "animate-pulse" : ""}`}
          >
            {compact ? l.short : l.label}
          </button>
        );
      })}
    </div>
  );
}
