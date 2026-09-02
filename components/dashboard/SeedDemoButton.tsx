"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SeedDemoButton({ className = "btn btn-ghost" }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function seed() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/demo", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not create the example.");
      return;
    }
    router.push(`/dashboard/projects/${data.project.id}`);
    router.refresh();
  }

  return (
    <div>
      <button onClick={seed} className={className} disabled={busy}>
        {busy ? "Building 30 days…" : "Load an example project"}
      </button>
      {error && <p className="mt-2 text-[12px] text-[#C2255C]">{error}</p>}
    </div>
  );
}
