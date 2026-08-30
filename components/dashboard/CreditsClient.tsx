"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CREDIT_ACTIONS, CREDIT_COSTS, CREDIT_PACKS } from "@/lib/plans";

export default function CreditsClient({ credits }: { credits: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(credits);

  async function buy(packId: string) {
    setBusy(packId);
    setError("");
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "credits", packId }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setError(data.error || "Could not add credits.");
      return;
    }
    setBalance(data.credits);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="panel p-7 text-center">
        <p className="eyebrow">Balance</p>
        <p className="display mt-3 text-6xl grad-text-soft">{balance.toLocaleString()}</p>
        <p className="mt-2 text-[13px] text-[#6B6678]">
          Roughly {Math.floor(balance / CREDIT_COSTS.redesignVisual)} visual redesigns, or{" "}
          {Math.floor(balance / CREDIT_COSTS.regenerateDay)} full days rebuilt.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6E697E]">
          Top up
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKS.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border p-5 ${
                p.popular ? "border-[#6D4DF6]/45 bg-[#6D4DF6]/[0.07]" : "border-[#E6E2DC] bg-white"
              }`}
            >
              <p className="display text-3xl">{p.credits.toLocaleString()}</p>
              <p className="text-[11px] uppercase tracking-wider text-[#6E697E]">credits</p>
              {p.save && <p className="mt-1.5 text-[11.5px] font-semibold text-[#357A38]">{p.save}</p>}
              <div className="mt-auto pt-5">
                <button
                  className={`btn w-full ${p.popular ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => buy(p.id)}
                  disabled={!!busy}
                >
                  {busy === p.id ? "Adding…" : `Buy for $${p.price}`}
                </button>
              </div>
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-3 rounded-lg border border-[#DB2777]/30 bg-[#DB2777]/10 px-3 py-2.5 text-[13px] text-[#DB2777]">
            {error}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6E697E]">
          What credits buy
        </h2>
        <div className="panel divide-y divide-[#EDEAE4]">
          {CREDIT_ACTIONS.map((a) => (
            <div key={a.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div>
                <p className="text-[14px] font-medium text-[#141220]">{a.label}</p>
                <p className="text-[12px] text-[#6E697E]">{a.description}</p>
              </div>
              <span className="chip shrink-0">{CREDIT_COSTS[a.key]} cr</span>
            </div>
          ))}
        </div>
      </div>

      <p className="rounded-xl border border-[#E6E2DC] bg-white px-4 py-3 text-[12px] leading-relaxed text-[#6E697E]">
        You never need credits to receive your monthly calendar — every plan delivers it in full.
        Credits only apply when you want something rebuilt differently.
      </p>
    </div>
  );
}
