"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Product, Project } from "@/lib/types";
import type { WizardOptions } from "./ProjectWizard";

const LANGUAGES = [
  "English", "Arabic", "Spanish", "French", "German", "Portuguese", "Italian",
  "Dutch", "Turkish", "Polish", "Hindi", "Japanese", "Korean", "Chinese (Simplified)",
];

export default function ProjectEditor({
  project,
  options,
  postCount,
}: {
  project: Project;
  options: WizardOptions;
  postCount: number;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: project.name,
    tagline: project.tagline,
    category: project.category,
    description: project.description,
    website: project.website,
    logoUrl: project.logoUrl,
    brandTheme: project.brandTheme,
    colors: { ...project.colors },
    voice: project.voice,
    language: project.language,
    audience: project.audience,
    market: project.market,
    platforms: [...project.platforms],
    goals: [...project.goals],
    competitorsInput: project.competitorsInput,
    products: project.products.map((p) => ({ ...p })),
  });
  const [regenerate, setRegenerate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function toggle(list: string[], value: string, key: "platforms" | "goals") {
    set(key, list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function updateProduct(i: number, patch: Partial<Product>) {
    set("products", form.products.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  async function save() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, regenerate }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not save.");
      return;
    }
    setSaved(true);
    router.refresh();
    if (regenerate) router.push(`/dashboard/projects/${project.id}`);
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="mb-7">
        <p className="eyebrow">Edit project</p>
        <h1 className="display mt-2 text-3xl">{project.name}</h1>
      </div>

      <div className="space-y-5">
        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Brand</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Project name</label>
              <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {options.categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" value={form.website} onChange={(e) => set("website", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Look and voice</h2>

          <div className="mb-5 flex items-center gap-4">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#22222E]"
              style={{ background: `linear-gradient(135deg, ${form.colors.primary}, ${form.colors.secondary})` }}
            >
              {form.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
              ) : (
                <span className="text-xl font-bold text-white">{form.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <input
                ref={logoInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.append("file", f);
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  const data = await res.json().catch(() => ({}));
                  if (res.ok) set("logoUrl", data.url);
                  else setError(data.error || "Upload failed.");
                }}
              />
              <button className="btn btn-ghost btn-sm" onClick={() => logoInput.current?.click()}>
                {form.logoUrl ? "Replace logo" : "Upload logo"}
              </button>
              {form.logoUrl && (
                <button className="btn btn-quiet btn-sm ml-2" onClick={() => set("logoUrl", null)}>
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            {(["primary", "secondary", "background", "text"] as const).map((key) => (
              <div
                key={key}
                className="flex items-center gap-2.5 rounded-xl border border-[#1E1E28] bg-white/[0.02] p-2.5"
              >
                <input
                  type="color"
                  value={form.colors[key]}
                  onChange={(e) => set("colors", { ...form.colors, [key]: e.target.value })}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  aria-label={key}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] capitalize text-[#5B5B70]">{key}</p>
                  <input
                    className="w-full bg-transparent text-[13px] font-medium text-white outline-none"
                    value={form.colors[key]}
                    onChange={(e) => set("colors", { ...form.colors, [key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Theme</label>
              <select
                className="input"
                value={form.brandTheme}
                onChange={(e) => set("brandTheme", e.target.value)}
              >
                {options.themes.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Voice</label>
              <select className="input" value={form.voice} onChange={(e) => set("voice", e.target.value)}>
                {options.voices.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Language</label>
              <select className="input" value={form.language} onChange={(e) => set("language", e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Audience</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Target audience</label>
              <textarea
                className="input"
                value={form.audience}
                onChange={(e) => set("audience", e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Market</label>
                <input className="input" value={form.market} onChange={(e) => set("market", e.target.value)} />
              </div>
              <div>
                <label className="label">Competitors</label>
                <input
                  className="input"
                  value={form.competitorsInput}
                  onChange={(e) => set("competitorsInput", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {options.platforms.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => toggle(form.platforms, p.key, "platforms")}
                    className={`chip ${form.platforms.includes(p.key) ? "chip-on" : ""}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Goals</label>
              <div className="flex flex-wrap gap-2">
                {options.goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggle(form.goals, g, "goals")}
                    className={`chip ${form.goals.includes(g) ? "chip-on" : ""}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Products</h2>
          <div className="space-y-3">
            {form.products.map((p, i) => (
              <div key={p.id || i} className="rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-4">
                <div className="mb-3 flex gap-2">
                  <input
                    className="input"
                    value={p.name}
                    onChange={(e) => updateProduct(i, { name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    className="input w-24 shrink-0"
                    value={p.price || ""}
                    onChange={(e) => updateProduct(i, { price: e.target.value })}
                    placeholder="Price"
                  />
                  <button
                    className="btn btn-quiet btn-sm shrink-0"
                    onClick={() => set("products", form.products.filter((_, idx) => idx !== i))}
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-3 flex gap-2">
                  {(
                    [
                      ["hero", "#C8F751"],
                      ["core", "#9B9BAE"],
                      ["slow", "#FFB443"],
                    ] as const
                  ).map(([tier, color]) => (
                    <button
                      key={tier}
                      onClick={() => updateProduct(i, { tier })}
                      className="chip capitalize"
                      style={
                        p.tier === tier
                          ? { color, borderColor: `${color}66`, background: `${color}18` }
                          : undefined
                      }
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input
                    className="input"
                    value={p.description || ""}
                    onChange={(e) => updateProduct(i, { description: e.target.value })}
                    placeholder="Description"
                  />
                  <input
                    className="input"
                    value={p.benefits || ""}
                    onChange={(e) => updateProduct(i, { benefits: e.target.value })}
                    placeholder="Main benefit"
                  />
                  <input
                    className="input sm:col-span-2"
                    value={p.objection || ""}
                    onChange={(e) => updateProduct(i, { objection: e.target.value })}
                    placeholder="Objection"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn btn-ghost btn-sm mt-3"
            onClick={() =>
              set("products", [
                ...form.products,
                { id: "", name: "", tier: "core", price: "", description: "", benefits: "", objection: "", images: [] },
              ])
            }
          >
            + Add product
          </button>
        </section>

        <section className="panel p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={regenerate}
              onChange={(e) => setRegenerate(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#7C5CFF]"
            />
            <span>
              <span className="block text-[14px] font-semibold text-white">
                Rebuild the 30-day campaign with these changes
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-[#7C7C90]">
                Regenerates the strategy and all {postCount} posts. Statuses, ratings, logged metrics
                and edits are replaced. Export first if you want to keep this month.
              </span>
            </span>
          </label>
        </section>

        {error && (
          <p className="rounded-lg border border-[#FF6B8A]/30 bg-[#FF6B8A]/10 px-3 py-2.5 text-[13px] text-[#FFA7BB]">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-primary" onClick={save} disabled={busy}>
            {busy ? "Saving…" : regenerate ? "Save and rebuild" : "Save changes"}
          </button>
          {saved && <span className="text-[13px] text-[#C8F751]">Saved ✓</span>}
          <a className="btn btn-ghost" href={`/api/export/${project.id}`}>
            Export first
          </a>
          <div className="ml-auto">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] text-[#FFA7BB]">Delete permanently?</span>
                <button className="btn btn-sm bg-[#FF6B8A] text-white" onClick={remove} disabled={busy}>
                  Yes, delete
                </button>
                <button className="btn btn-quiet btn-sm" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn btn-quiet btn-sm" onClick={() => setConfirmDelete(true)}>
                Delete project
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
