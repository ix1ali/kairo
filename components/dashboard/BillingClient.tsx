"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PACKAGES } from "@/lib/plans";

export default function BillingClient({
  currentPackage,
  status,
  renewsAt,
  credits,
  projectCount,
}: {
  currentPackage: string | null;
  status: string;
  renewsAt: string | null;
  credits: number;
  projectCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const suggested = params.get("plan");
  const seedUrl = params.get("url");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function subscribe(packageId: string) {
    setBusy(packageId);
    setError("");
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "subscription", packageId }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setError(data.error || "Could not update your plan.");
      return;
    }
    const suffix = seedUrl ? `?url=${encodeURIComponent(seedUrl)}` : "";
    router.push(projectCount && !seedUrl ? "/dashboard" : `/dashboard/projects/new${suffix}`);
    router.refresh();
  }

  async function cancel() {
    setBusy("cancel");
    await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "cancel" }),
    });
    setBusy("");
    setConfirmCancel(false);
    router.refresh();
  }

  const active = status === "active" && !!currentPackage;

  return (
    <div className="space-y-6">
      {active && (
        <div className="panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Current plan</p>
              <h2 className="display mt-2 text-2xl">
                {PACKAGES.find((p) => p.id === currentPackage)?.name}
              </h2>
              <p className="mt-1.5 text-[13px] text-[#7C7C90]">
                {renewsAt ? `Renews ${new Date(renewsAt).toLocaleDateString()}` : "Active"} ·{" "}
                {credits.toLocaleString()} credits in balance
              </p>
            </div>
            {confirmCancel ? (
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] text-[#FF6B8A]">Cancel at period end?</span>
                <button className="btn btn-sm bg-[#FF6B8A] text-white" onClick={cancel} disabled={!!busy}>
                  Confirm
                </button>
                <button className="btn btn-quiet btn-sm" onClick={() => setConfirmCancel(false)}>
                  Keep plan
                </button>
              </div>
            ) : (
              <button className="btn btn-quiet btn-sm" onClick={() => setConfirmCancel(true)}>
                Cancel subscription
              </button>
            )}
          </div>
        </div>
      )}

      {status === "cancelled" && (
        <div className="rounded-2xl border border-[#FFB443]/30 bg-[#FFB443]/[0.07] p-5">
          <p className="text-[14px] font-semibold text-[#E0B77A]">Your subscription is cancelled</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#B99A6B]">
            Your projects and calendars are kept. Choose a plan below to reactivate.
          </p>
        </div>
      )}

      {suggested && !active && (
        <div className="rounded-2xl border border-[#7C5CFF]/30 bg-[#7C5CFF]/[0.07] p-5">
          <p className="text-[14px] text-[#C9BEFF]">
            You picked the{" "}
            <span className="font-semibold">{PACKAGES.find((p) => p.id === suggested)?.name}</span>{" "}
            plan. Confirm below to activate it and start your first campaign.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {PACKAGES.map((pkg) => {
          const isCurrent = active && currentPackage === pkg.id;
          const featured = pkg.id === suggested || (!suggested && pkg.highlight);
          return (
            <div
              key={pkg.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                isCurrent
                  ? "border-[#C8F751]/40 bg-[#C8F751]/[0.05]"
                  : featured
                  ? "border-[#7C5CFF]/45 bg-[#7C5CFF]/[0.06]"
                  : "border-[#1E1E28] bg-white/[0.02]"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="display text-xl">{pkg.name}</h3>
                {isCurrent && (
                  <span className="chip" style={{ color: "#C8F751", borderColor: "#C8F75155" }}>
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1.5 min-h-[38px] text-[13px] leading-relaxed text-[#7C7C90]">
                {pkg.tagline}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="display text-4xl">${pkg.price}</span>
                <span className="text-[13px] text-[#7E7E93]">/month</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-[#1E1E28] bg-white/[0.05] p-2.5 text-center">
                <div>
                  <p className="display text-base">{pkg.totalPosts}</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#7E7E93]">posts</p>
                </div>
                <div>
                  <p className="display text-base">{pkg.videosPerMonth || "—"}</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#7E7E93]">videos</p>
                </div>
                <div>
                  <p className="display text-base">{pkg.projects}</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#7E7E93]">projects</p>
                </div>
              </div>

              <button
                className={`btn mt-4 w-full ${isCurrent ? "btn-ghost" : "btn-primary"}`}
                disabled={!!busy || isCurrent}
                onClick={() => subscribe(pkg.id)}
              >
                {busy === pkg.id
                  ? "Activating…"
                  : isCurrent
                  ? "Your plan"
                  : active
                  ? `Switch to ${pkg.name}`
                  : `Choose ${pkg.name}`}
              </button>

              <p className="mt-2.5 text-center text-[11px] text-[#7E7E93]">
                Includes {pkg.credits} credits
              </p>

              <ul className="mt-5 space-y-2 border-t border-[#16161F] pt-4">
                {pkg.features.slice(0, 6).map((f) => (
                  <li key={f} className="text-[12.5px] leading-relaxed text-[#7C7C90]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="rounded-lg border border-[#FF6B8A]/30 bg-[#FF6B8A]/10 px-3 py-2.5 text-[13px] text-[#FF6B8A]">
          {error}
        </p>
      )}

      <p className="rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3 text-[12px] leading-relaxed text-[#7E7E93]">
        This build processes plan changes locally so you can use the whole product end to end. Wire{" "}
        <code className="text-[#9B9BAE]">/api/billing</code> to Stripe Checkout and fulfil on the
        webhook to take real payments — the app already reads plan and credits from the user record.
      </p>
    </div>
  );
}
