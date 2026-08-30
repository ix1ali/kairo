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
              <p className="mt-1.5 text-[13px] text-[#6B6678]">
                {renewsAt ? `Renews ${new Date(renewsAt).toLocaleDateString()}` : "Active"} ·{" "}
                {credits.toLocaleString()} credits in balance
              </p>
            </div>
            {confirmCancel ? (
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] text-[#DB2777]">Cancel at period end?</span>
                <button className="btn btn-sm bg-[#DB2777] text-white" onClick={cancel} disabled={!!busy}>
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
        <div className="rounded-2xl border border-[#A65209]/30 bg-[#A65209]/[0.07] p-5">
          <p className="text-[14px] font-semibold text-[#B45309]">Your subscription is cancelled</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#8A6B3A]">
            Your projects and calendars are kept. Choose a plan below to reactivate.
          </p>
        </div>
      )}

      {suggested && !active && (
        <div className="rounded-2xl border border-[#6D4DF6]/30 bg-[#6D4DF6]/[0.07] p-5">
          <p className="text-[14px] text-[#5B3FE0]">
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
                  ? "border-[#357A38]/40 bg-[#357A38]/[0.05]"
                  : featured
                  ? "border-[#6D4DF6]/45 bg-[#6D4DF6]/[0.06]"
                  : "border-[#E6E2DC] bg-white"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="display text-xl">{pkg.name}</h3>
                {isCurrent && (
                  <span className="chip" style={{ color: "#357A38", borderColor: "#357A3855" }}>
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1.5 min-h-[38px] text-[13px] leading-relaxed text-[#6B6678]">
                {pkg.tagline}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="display text-4xl">${pkg.price}</span>
                <span className="text-[13px] text-[#6E697E]">/month</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-[#E6E2DC] bg-[#F3F1EE] p-2.5 text-center">
                <div>
                  <p className="display text-base">{pkg.totalPosts}</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#6E697E]">posts</p>
                </div>
                <div>
                  <p className="display text-base">{pkg.videosPerMonth || "—"}</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#6E697E]">videos</p>
                </div>
                <div>
                  <p className="display text-base">{pkg.projects}</p>
                  <p className="text-[9.5px] uppercase tracking-wider text-[#6E697E]">projects</p>
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

              <p className="mt-2.5 text-center text-[11px] text-[#6E697E]">
                Includes {pkg.credits} credits
              </p>

              <ul className="mt-5 space-y-2 border-t border-[#EDEAE4] pt-4">
                {pkg.features.slice(0, 6).map((f) => (
                  <li key={f} className="text-[12.5px] leading-relaxed text-[#6B6678]">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="rounded-lg border border-[#DB2777]/30 bg-[#DB2777]/10 px-3 py-2.5 text-[13px] text-[#DB2777]">
          {error}
        </p>
      )}

      <p className="rounded-xl border border-[#E6E2DC] bg-white px-4 py-3 text-[12px] leading-relaxed text-[#6E697E]">
        This build processes plan changes locally so you can use the whole product end to end. Wire{" "}
        <code className="text-[#615D70]">/api/billing</code> to Stripe Checkout and fulfil on the
        webhook to take real payments — the app already reads plan and credits from the user record.
      </p>
    </div>
  );
}
