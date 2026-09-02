"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Ui";
import Koala from "@/components/Koala";
import { PlatformIcon } from "@/components/icons/Social";
import {
  AGE_STOPS,
  BUYING_FOR,
  DEFAULT_AUDIENCE,
  GENDERS,
  PRIORITIES,
  SPEND_LEVELS,
  describeAudience,
  type AudienceProfile,
} from "@/lib/strategy/audience";
import LocalePicker from "./LocalePicker";
import { DEFAULT_LOCALE, getLocale } from "@/lib/languages";
import {
  CONTENT_KINDS,
  DEFAULT_GOAL,
  DEFAULT_MIX,
  DEFAULT_VIDEO_STYLE,
  GOALS,
  VIDEO_PREFS,
  getGoal,
  type ContentMix,
  type VideoStyle,
} from "@/lib/strategy/goals";

export interface WizardOptions {
  categories: { key: string; label: string }[];
  themes: { key: string; label: string; note: string }[];
  voices: string[];
  platforms: { key: string; label: string }[];
  goals: string[];
  defaultColors: { primary: string; secondary: string; background: string; text: string };
  packageName: string;
  totalPosts: number;
  videos: number;
  hasTextProvider: boolean;
}

interface ProductDraft {
  name: string;
  tier: "hero" | "core" | "slow";
  price: string;
  description: string;
  benefits: string;
  objection: string;
  images: string[];
}

const STEPS = ["Brand", "Look & voice", "Goal", "Content", "Audience", "Rivals", "Products", "Review"];

interface Adjustment {
  label: string;
  icon: "bolt" | "heart" | "star" | "grid" | "brain" | "tag";
  voice?: string;
  theme?: string;
  goal?: string;
}

const ADJUSTMENTS: Adjustment[] = [
  { label: "Bolder", icon: "bolt", voice: "Bold and provocative", theme: "bold-loud" },
  { label: "Softer", icon: "heart", voice: "Warm and friendly", theme: "warm-organic" },
  { label: "More premium", icon: "star", voice: "Understated and premium", theme: "luxury-refined" },
  { label: "Simpler design", icon: "grid", theme: "minimal-editorial" },
  { label: "Teach more", icon: "brain", goal: "authority" },
  { label: "Sell harder", icon: "tag", goal: "sales" },
];

function emptyProduct(): ProductDraft {
  return { name: "", tier: "core", price: "", description: "", benefits: "", objection: "", images: [] };
}

export default function ProjectWizard({ options }: { options: WizardOptions }) {
  const router = useRouter();
  const params = useSearchParams();
  const seedUrl = params.get("url") || "";
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // step 1
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importNote, setImportNote] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("general");
  // Free text when the list does not cover them. resolveCategory() matches it
  // against every playbook's aka list before falling back to general.
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  // step 2
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [colors, setColors] = useState({ ...options.defaultColors });
  const [palette, setPalette] = useState<string[]>([]);
  const [brandTheme, setBrandTheme] = useState(options.themes[3]?.key || options.themes[0].key);
  const [voice, setVoice] = useState(options.voices[0]);
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [images, setImages] = useState<string[]>([]);

  // step 3
  const [aud, setAud] = useState<AudienceProfile>(DEFAULT_AUDIENCE);
  const [market, setMarket] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["instagram"]);
  const [socials, setSocials] = useState<{ platform: string; url: string }[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [competitorsInput, setCompetitorsInput] = useState("");
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [contentMix, setContentMix] = useState<ContentMix>({ ...DEFAULT_MIX });
  const [videoStyle, setVideoStyle] = useState<VideoStyle>({ ...DEFAULT_VIDEO_STYLE });
  const [rivals, setRivals] = useState<{ name: string; website: string; instagram: string; tiktok: string; note?: string }[]>([]);
  const [rivalUrl, setRivalUrl] = useState("");
  const [rivalBusy, setRivalBusy] = useState(false);
  const [rivalError, setRivalError] = useState("");
  const [samples, setSamples] = useState<{ id: string; day: number; contentTypeName: string; svg: string }[]>([]);
  const [sampleBusy, setSampleBusy] = useState(false);
  const [sampleError, setSampleError] = useState("");
  const [sampleVotes, setSampleVotes] = useState<Record<string, number>>({});
  const [seed, setSeed] = useState("a");

  // step 4
  const [products, setProducts] = useState<ProductDraft[]>([emptyProduct()]);
  const [productUrl, setProductUrl] = useState("");
  const [productBusy, setProductBusy] = useState(false);
  const [productNote, setProductNote] = useState("");

  const sampled = useRef(false);
  useEffect(() => {
    if (step !== 7 || sampled.current) return;
    sampled.current = true;
    void loadSamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const started = useRef(false);
  useEffect(() => {
    if (!seedUrl || started.current) return;
    started.current = true;
    setImportUrl(seedUrl);
    void runImport(seedUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedUrl]);

  const logoInput = useRef<HTMLInputElement>(null);
  const imagesInput = useRef<HTMLInputElement>(null);

  async function upload(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return null;
    }
    return data.url;
  }

  async function runImport(explicit?: string) {
    const target = (explicit ?? importUrl).trim();
    if (!target) return;
    setImporting(true);
    setImportNote("");
    setError("");
    const res = await fetch("/api/import-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: target }),
    });
    const data = await res.json().catch(() => ({}));
    setImporting(false);
    if (!res.ok) {
      setImportNote(data.error || "Could not read that site.");
      return;
    }
    const im = data.imported;
    if (im.name) setName(im.name);
    if (im.tagline) setTagline(im.tagline.slice(0, 110));
    if (im.description) setDescription(im.description);
    if (im.website) setWebsite(im.website);
    if (im.category) setCategory(im.category);
    if (im.logoUrl) setLogoUrl(im.logoUrl);
    if (im.colors?.primary) {
      setColors((c) => ({ ...c, primary: im.colors.primary, secondary: im.colors.secondary || c.secondary }));
    }
    if (Array.isArray(im.palette)) setPalette(im.palette);
    if (Array.isArray(im.socials) && im.socials.length) setSocials(im.socials);
    if (Array.isArray(im.products) && im.products.length) {
      setProducts(im.products.slice(0, 6).map((p: { name: string }) => ({ ...emptyProduct(), name: p.name })));
    }
    setImportNote(`Imported from ${new URL(im.website).hostname}. Everything below is editable.`);
    void importProductLink(target, true);
  }

  /** Pulls a real catalogue from a store or a single product page. */
  async function importProductLink(link: string, quiet = false) {
    const target = (link || "").trim();
    if (!target) return;
    setProductBusy(true);
    if (!quiet) setProductNote("");
    const res = await fetch("/api/import-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: target }),
    });
    const data = await res.json().catch(() => ({}));
    setProductBusy(false);
    if (!res.ok) {
      if (!quiet) setProductNote(data.error || "Could not read that link.");
      return;
    }
    const found: { name: string; price: string; description: string; image: string | null }[] = data.products || [];
    if (!found.length) {
      if (!quiet) setProductNote("No products found there.");
      return;
    }
    setProducts((prev) => {
      const kept = prev.filter((p) => p.name.trim());
      const existing = new Set(kept.map((p) => p.name.toLowerCase()));
      const added = found
        .filter((f) => !existing.has(f.name.toLowerCase()))
        .map((f, i) => ({
          ...emptyProduct(),
          name: f.name,
          price: f.price || "",
          description: f.description || "",
          tier: (i === 0 ? "hero" : "core") as ProductDraft["tier"],
          images: f.image ? [f.image] : [],
        }));
      const merged = [...kept, ...added];
      return merged.length ? merged : [emptyProduct()];
    });
    setProductNote(`Found ${found.length} product${found.length === 1 ? "" : "s"} via ${data.source}. Tag your heroes and slow movers below.`);
    setProductUrl("");
  }

  async function analyseRival(link: string) {
    const target = link.trim();
    if (!target) return;
    setRivalBusy(true);
    setRivalError("");
    const res = await fetch("/api/analyse-competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: target }),
    });
    const data = await res.json().catch(() => ({}));
    setRivalBusy(false);
    if (!res.ok) {
      setRivalError(data.error || "Could not read that link.");
      return;
    }
    const isSocial = /instagram|tiktok|facebook|linkedin|x.com|youtube/i.test(target);
    setRivals((prev) => [
      ...prev,
      {
        name: data.name || target,
        website: isSocial ? "" : target,
        instagram: /instagram/i.test(target) ? target : "",
        tiktok: /tiktok/i.test(target) ? target : "",
        note: data.note,
      },
    ]);
    setRivalUrl("");
  }

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function updateProduct(i: number, patch: Partial<ProductDraft>) {
    setProducts((ps) => ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  const canNext =
    step === 0 ? name.trim().length > 1 : step === 6 ? products.some((p) => p.name.trim()) : true;

  function payload() {
    return {
      name, tagline, description, website, logoUrl, images,
      category: category === "other" ? customCategory.trim() || "general" : category,
      brandTheme, colors, voice, locale, market, platforms,
      audience: describeAudience(aud, market),
      audienceProfile: aud,
      socials: socials.filter((s) => s.url.trim()),
      goals, goal, contentMix, videoStyle, competitorsInput,
      competitorProfiles: rivals.filter((r) => r.name.trim()),
      products: products.filter((p) => p.name.trim()),
    };
  }

  async function loadSamples(nextSeed?: string) {
    setSampleBusy(true);
    setSampleError("");
    const s = nextSeed ?? Math.random().toString(36).slice(2, 6);
    setSeed(s);
    const res = await fetch("/api/projects/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload(), seed: s }),
    });
    const data = await res.json().catch(() => ({}));
    setSampleBusy(false);
    if (!res.ok) {
      setSampleError(data.error || "Could not build samples.");
      return;
    }
    setSamples(data.samples || []);
    setSampleVotes({});
  }

  function applyAdjustment(a: Adjustment) {
    if (a.voice) setVoice(a.voice);
    if (a.theme) setBrandTheme(a.theme);
    if (a.goal) setGoal(a.goal);
    setTimeout(() => void loadSamples(seed), 0);
  }

  async function submit() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload()),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Could not create the project.");
      setBusy(false);
      return;
    }
    router.push(`/dashboard/projects/${data.project.id}`);
    router.refresh();
  }

  if (busy) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <Koala size={235} mood="thinking" />
        <h2 className="display mt-4 text-2xl">Kai is building your month</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#55556B]">
          Reading your brand, mapping your competitors, then writing and designing all{" "}
          {options.totalPosts} posts.
        </p>
        <div className="mt-7 w-full max-w-xs space-y-2.5 text-left">
          {[
            "Working out your positioning",
            "Mapping competitor gaps",
            "Weighting your content pillars",
            "Writing thirty days of copy",
            "Designing every asset",
          ].map((t, i) => (
            <div
              key={t}
              className="animate-rise flex items-center gap-2.5 text-[13px] text-[#55556B]"
              style={{ animationDelay: `${i * 220}ms` }}
            >
              <Icon name="check" size={13} className="text-[#4D7C0F]" strokeWidth={2.8} />
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">New project</p>
          <p className="text-[12px] text-[#6E6E85]">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className="flex-1 text-left"
            >
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= step ? "bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]" : "bg-[#0B0B12]/[0.07]"
                }`}
              />
              <span
                className={`mt-2 block text-[11px] font-medium ${
                  i === step ? "text-[#0B0B12]" : i < step ? "text-[#6E6E85]" : "text-[#3E3E4E]"
                }`}
              >
                {s}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel p-6 sm:p-7">
        {/* ---------- STEP 0 : BRAND ---------- */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="display text-2xl">Tell us about the brand</h2>
              <p className="mt-1.5 text-[14px] text-[#63637A]">
                Have a website? Paste it and Koala will read your brand for you.
              </p>
            </div>

            <div className="rounded-2xl border border-[#7C5CFF]/25 bg-[#7C5CFF]/[0.06] p-4">
              <label className="label">Import from your website</label>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="yourbrand.com"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), runImport())}
                />
                <button
                  onClick={() => void runImport()}
                  className="btn btn-primary shrink-0"
                  disabled={importing || !importUrl.trim()}
                >
                  {importing ? "Reading…" : "Import"}
                </button>
              </div>
              {importNote && (
                <p className="mt-2 text-[12px] leading-relaxed text-[#5B3FE0]">{importNote}</p>
              )}
              <p className="mt-2 text-[11px] text-[#6E6E85]">
                Pulls your name, description, colours, logo, socials and products. Optional — you can
                fill everything in manually.
              </p>
            </div>

            <div>
              <label className="label">Project name *</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ember & Oak"
              />
            </div>

            <div>
              <label className="label">Tagline</label>
              <input
                className="input"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Specialty coffee without the gatekeeping."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {options.categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                  <option value="other">Other — I will describe it</option>
                </select>
                {category === "other" ? (
                  <>
                    <input
                      className="input mt-2"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Pet grooming, dental clinic, print shop…"
                    />
                    <p className="mt-1.5 text-[11px] text-[#6E6E85]">
                      We match what you type to the closest playbook we have, and fall back to the
                      general one if nothing fits.
                    </p>
                  </>
                ) : (
                  <p className="mt-1.5 text-[11px] text-[#6E6E85]">
                    Drives the competitor map, hooks and pillar weighting.
                  </p>
                )}
              </div>
              <div>
                <label className="label">Website</label>
                <input
                  className="input"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourbrand.com"
                />
              </div>
            </div>

            <div>
              <label className="label">What does the business actually do?</label>
              <textarea
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A small-batch roastery. We print the roast date on every bag, name the farm, and include a dial-in guide so the first cup is never wasted."
              />
              <p className="mt-1.5 text-[11px] text-[#6E6E85]">
                Be specific about what makes you different — it becomes your positioning line.
              </p>
            </div>
          </div>
        )}

        {/* ---------- STEP 1 : LOOK & VOICE ---------- */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="display text-2xl">Look and voice</h2>
              <p className="mt-1.5 text-[14px] text-[#63637A]">
                Every asset gets built inside this system.
              </p>
            </div>

            <div>
              <label className="label">Logo</label>
              <div className="flex items-center gap-4">
                <div
                  className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#E7E7EF]"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                >
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="text-2xl font-bold text-[#0B0B12]">
                      {(name || "K").charAt(0).toUpperCase()}
                    </span>
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
                      if (f) {
                        const url = await upload(f);
                        if (url) setLogoUrl(url);
                      }
                    }}
                  />
                  <button className="btn btn-ghost btn-sm" onClick={() => logoInput.current?.click()}>
                    {logoUrl ? "Replace logo" : "Upload logo"}
                  </button>
                  {logoUrl && (
                    <button className="btn btn-quiet btn-sm ml-2" onClick={() => setLogoUrl(null)}>
                      Remove
                    </button>
                  )}
                  <p className="mt-2 text-[11px] text-[#6E6E85]">PNG, SVG or JPG. Max 8MB.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Brand colours</label>
              {palette.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#6E6E85]">From your site:</span>
                  {palette.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColors((v) => ({ ...v, primary: c }))}
                      className="h-6 w-6 rounded-md border border-[#E7E7EF] transition-transform hover:scale-110"
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["primary", "Primary / accent"],
                    ["secondary", "Secondary"],
                    ["background", "Background"],
                    ["text", "Text"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2.5 rounded-xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-2.5">
                    <input
                      type="color"
                      value={colors[key]}
                      onChange={(e) => setColors((v) => ({ ...v, [key]: e.target.value }))}
                      className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      aria-label={label}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-[#6E6E85]">{label}</p>
                      <input
                        className="w-full bg-transparent text-[13px] font-medium text-[#0B0B12] outline-none"
                        value={colors[key]}
                        onChange={(e) => setColors((v) => ({ ...v, [key]: e.target.value }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Brand theme</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {options.themes.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setBrandTheme(t.key)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      brandTheme === t.key
                        ? "border-[#7C5CFF] bg-[#7C5CFF]/10"
                        : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9C9D8]"
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-[#0B0B12]">{t.label}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[#6E6E85]">{t.note}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Tone of voice</label>
                <select className="input" value={voice} onChange={(e) => setVoice(e.target.value)}>
                  {options.voices.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Caption language and dialect</label>
                <LocalePicker value={locale} onChange={setLocale} />
                {getLocale(locale).language !== "English" && !options.hasTextProvider ? (
                  <p className="mt-1.5 flex gap-1.5 text-[11px] leading-relaxed text-[#B45309]">
                    <Icon name="lock" size={12} className="mt-0.5 shrink-0" />
                    Writing in {getLocale(locale).language} is not switched on yet. Your copy will
                    arrive in English for now — nothing for you to set up, we are enabling it.
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] text-[#6E6E85]">
                    Copy is written the way people actually speak there.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Brand images (optional)</label>
              <input
                ref={imagesInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  const urls: string[] = [];
                  for (const f of files.slice(0, 8)) {
                    const url = await upload(f);
                    if (url) urls.push(url);
                  }
                  setImages((v) => [...v, ...urls]);
                }}
              />
              <div className="flex flex-wrap gap-2">
                {images.map((u) => (
                  <div key={u} className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#E7E7EF]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => setImages((v) => v.filter((x) => x !== u))}
                      className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded bg-black/70 text-[10px] text-[#0B0B12]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => imagesInput.current?.click()}
                  className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-[#DCDCE8] text-[#6E6E85] transition-colors hover:border-[#7C5CFF]/50"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#6E6E85]">
                Product shots, lifestyle photos, textures — used as reference for art direction.
              </p>
            </div>
          </div>
        )}

        {/* ---------- STEP 2 : AUDIENCE ---------- */}
        {/* ---------- STEP 2 : GOAL ---------- */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="display text-2xl">What is this month for?</h2>
              <p className="mt-1.5 text-[14px] text-[#63637A]">
                This changes the whole calendar. Chasing sales and chasing reach are different
                months.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const on = goal === g.key;
                return (
                  <button
                    key={g.key}
                    onClick={() => setGoal(g.key)}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      on ? "" : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9C9D8]"
                    }`}
                    style={
                      on
                        ? {
                            borderColor: `${g.accent}66`,
                            background: `linear-gradient(160deg, ${g.accent}1F, ${g.accent}08)`,
                            boxShadow: `0 0 26px -12px ${g.accent}`,
                          }
                        : undefined
                    }
                  >
                    <span className="mb-3 flex items-center justify-between">
                      <span
                        className="grid h-11 w-11 place-items-center rounded-xl"
                        style={{ background: `${g.accent}1F`, color: g.accent }}
                      >
                        <Icon name={g.icon} size={20} />
                      </span>
                      {on && (
                        <span style={{ color: g.accent }}>
                          <Icon name="checkCircle" size={18} />
                        </span>
                      )}
                    </span>
                    <p className="text-[15px] font-semibold text-[#0B0B12]">{g.label}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[#63637A]">{g.description}</p>
                    <p className="mt-3 border-t border-[#E7E7EF] pt-2.5 text-[11px] text-[#6E6E85]">
                      Measured by {g.kpi.toLowerCase()}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- STEP 3 : CONTENT MIX ---------- */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="display text-2xl">What can you actually make?</h2>
              <p className="mt-1.5 text-[14px] text-[#63637A]">
                Pick the formats you are willing to produce. Koala only plans what you will
                actually publish.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {CONTENT_KINDS.map((k) => {
                const on = contentMix[k.key];
                return (
                  <button
                    key={k.key}
                    onClick={() => setContentMix((m) => ({ ...m, [k.key]: !m[k.key] }))}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                      on ? "" : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9C9D8]"
                    }`}
                    style={
                      on
                        ? {
                            borderColor: `${k.accent}66`,
                            background: `linear-gradient(160deg, ${k.accent}1A, ${k.accent}06)`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                      style={{ background: `${k.accent}1F`, color: k.accent }}
                    >
                      <Icon name={k.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[14.5px] font-semibold text-[#0B0B12]">{k.label}</span>
                        {on && (
                          <span style={{ color: k.accent }}>
                            <Icon name="check" size={13} strokeWidth={3} />
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-relaxed text-[#63637A]">
                        {k.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {!Object.values(contentMix).some(Boolean) && (
              <p className="rounded-xl border border-[#B45309]/25 bg-[#B45309]/[0.07] px-4 py-3 text-[12.5px] text-[#B45309]">
                Pick at least one format, otherwise there is nothing to plan.
              </p>
            )}

            {contentMix.video && (
              <div className="rounded-2xl border border-[#C2255C]/25 bg-[#C2255C]/[0.05] p-4">
                <p className="mb-1 flex items-center gap-2 text-[14px] font-semibold text-[#0B0B12]">
                  <Icon name="video" size={15} className="text-[#C2255C]" />
                  How should the videos be made?
                </p>
                <p className="mb-4 text-[12.5px] text-[#63637A]">
                  Pick as many as you like and the month mixes between them. Choose none and we pick per video.
                </p>

                <div className="space-y-3.5">
                  {VIDEO_PREFS.map((pref) => (
                    <div key={pref.key}>
                      <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-[#55556B]">
                        <span style={{ color: pref.accent }}>
                          <Icon name={pref.icon} size={12} />
                        </span>
                        {pref.label}
                        {videoStyle[pref.key].length === 0 && (
                          <span className="ms-2 rounded-md bg-[#7C5CFF]/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5B3FE0]">
                            We choose
                          </span>
                        )}
                        {videoStyle[pref.key].length > 1 && (
                          <span className="ms-2 rounded-md bg-[#22D3EE]/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0E7490]">
                            Mixed
                          </span>
                        )}
                      </p>
                      <div className="grid gap-1.5 sm:grid-cols-3">
                        {pref.choices.map((c) => {
                          const on = videoStyle[pref.key].includes(c.value);
                          return (
                            <button
                              key={c.value}
                              onClick={() =>
                                setVideoStyle((v) => {
                                  const current = v[pref.key];
                                  return {
                                    ...v,
                                    [pref.key]: current.includes(c.value)
                                      ? current.filter((x) => x !== c.value)
                                      : [...current, c.value],
                                  };
                                })
                              }
                              className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                                on ? "" : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9C9D8]"
                              }`}
                              style={
                                on
                                  ? { borderColor: `${pref.accent}66`, background: `${pref.accent}16` }
                                  : undefined
                              }
                            >
                              <span className="block text-[12.5px] font-medium text-[#0B0B12]">{c.label}</span>
                              <span className="block text-[10.5px] leading-snug text-[#6E6E85]">{c.note}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label">Where are you most active?</label>
              <p className="mb-2.5 text-[12px] text-[#6E6E85]">
                Only used to size the artwork and set caption length.
              </p>
              <div className="flex flex-wrap gap-2">
                {options.platforms.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => toggle(platforms, p.key, setPlatforms)}
                    className={`chip ${platforms.includes(p.key) ? "chip-on" : ""}`}
                  >
                    <PlatformIcon platform={p.key} size={13} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="display text-2xl">Who are we talking to?</h2>
              <p className="mt-1.5 text-[14px] text-[#63637A]">
                The sharper this is, the sharper every hook gets.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Age range</label>
                <div className="flex items-center gap-2">
                  <select
                    className="input"
                    value={aud.ageMin}
                    onChange={(e) =>
                      setAud((v) => {
                        const n = Number(e.target.value);
                        return { ...v, ageMin: n, ageMax: Math.max(n, v.ageMax) };
                      })
                    }
                  >
                    {AGE_STOPS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="shrink-0 text-[13px] text-[#63637A]">to</span>
                  <select
                    className="input"
                    value={aud.ageMax}
                    onChange={(e) =>
                      setAud((v) => {
                        const n = Number(e.target.value);
                        return { ...v, ageMax: n, ageMin: Math.min(n, v.ageMin) };
                      })
                    }
                  >
                    {AGE_STOPS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Market / location</label>
                <input
                  className="input"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="Kuwait"
                />
              </div>
            </div>

            <div>
              <label className="label">Mostly</label>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setAud((v) => ({ ...v, gender: g.value }))}
                    className={`rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      aud.gender === g.value
                        ? "border-[#7C5CFF] bg-[#7C5CFF]/10 text-[#5B3FE0]"
                        : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] text-[#55556B] hover:border-[#C9BEEB]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">They are buying for</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {BUYING_FOR.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setAud((v) => ({ ...v, buyingFor: b.value }))}
                    className={`rounded-xl border p-3 text-start transition-colors ${
                      aud.buyingFor === b.value
                        ? "border-[#7C5CFF] bg-[#7C5CFF]/10"
                        : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9BEEB]"
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-[#0B0B12]">{b.label}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[#63637A]">{b.note}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">How they think about price</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SPEND_LEVELS.map((sp) => (
                  <button
                    key={sp.value}
                    onClick={() => setAud((v) => ({ ...v, spend: sp.value }))}
                    className={`rounded-xl border p-3 text-start transition-colors ${
                      aud.spend === sp.value
                        ? "border-[#7C5CFF] bg-[#7C5CFF]/10"
                        : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9BEEB]"
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-[#0B0B12]">{sp.label}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[#63637A]">{sp.note}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">
                What matters most to them{" "}
                <span className="font-normal text-[#6E6E85]">pick up to three</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((pr) => {
                  const on = aud.priorities.includes(pr.key);
                  return (
                    <button
                      key={pr.key}
                      onClick={() =>
                        setAud((v) => ({
                          ...v,
                          priorities: on
                            ? v.priorities.filter((k) => k !== pr.key)
                            : v.priorities.length >= 3
                              ? v.priorities
                              : [...v.priorities, pr.key],
                        }))
                      }
                      disabled={!on && aud.priorities.length >= 3}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12.5px] font-medium transition-colors disabled:opacity-40 ${
                        on
                          ? "border-[#7C5CFF] bg-[#7C5CFF]/10 text-[#5B3FE0]"
                          : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] text-[#55556B] hover:border-[#C9BEEB]"
                      }`}
                    >
                      <Icon name={pr.icon} size={13} />
                      {pr.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label">
                Anything else{" "}
                <span className="font-normal text-[#6E6E85]">optional</span>
              </label>
              <textarea
                className="input"
                rows={2}
                value={aud.note}
                onChange={(e) => setAud((v) => ({ ...v, note: e.target.value }))}
                placeholder="They just bought a grinder and keep wasting beans dialling it in."
              />
            </div>

            <div className="rounded-xl border border-[#DCDCE8] bg-[#F7F7FB] p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5B3FE0]">
                Every hook gets written for
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#33334A]">
                {describeAudience(aud, market)}
              </p>
            </div>


            <div>
              <label className="label">Social links</label>
              <div className="space-y-2">
                {socials.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="input w-32 shrink-0"
                      value={s.platform}
                      onChange={(e) =>
                        setSocials((v) => v.map((x, idx) => (idx === i ? { ...x, platform: e.target.value } : x)))
                      }
                      placeholder="Instagram"
                    />
                    <input
                      className="input"
                      value={s.url}
                      onChange={(e) =>
                        setSocials((v) => v.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))
                      }
                      placeholder="https://instagram.com/yourbrand"
                    />
                    <button
                      className="btn btn-quiet btn-sm shrink-0"
                      onClick={() => setSocials((v) => v.filter((_, idx) => idx !== i))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSocials((v) => [...v, { platform: "", url: "" }])}
                >
                  + Add a link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- STEP 3 : PRODUCTS ---------- */}
        {/* ---------- STEP 5 : RIVALS ---------- */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="display text-2xl">Who are you up against?</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#63637A]">
                Koala reads their public pages, works out where they are weak, and points your
                month at that gap. Add their site or their social profiles.
              </p>
            </div>

            <div className="rounded-2xl border border-[#7C5CFF]/25 bg-[#7C5CFF]/[0.06] p-4">
              <label className="label flex items-center gap-1.5">
                <Icon name="target" size={14} className="text-[#5B3FE0]" />
                Add a competitor
              </label>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="rival.com  or  instagram.com/theirhandle"
                  value={rivalUrl}
                  onChange={(e) => setRivalUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void analyseRival(rivalUrl);
                    }
                  }}
                />
                <button
                  onClick={() => void analyseRival(rivalUrl)}
                  className="btn btn-primary shrink-0"
                  disabled={rivalBusy || !rivalUrl.trim()}
                >
                  {rivalBusy ? "Reading…" : "Analyse"}
                </button>
              </div>
              {rivalError && <p className="mt-2 text-[12px] text-[#C2255C]">{rivalError}</p>}
              <p className="mt-2 text-[11px] leading-relaxed text-[#6E6E85]">
                Websites are read for positioning, catalogue size and where they post. Social
                platforms block server-side reading, so handles are stored for reference.
              </p>
            </div>

            {rivals.length > 0 && (
              <div className="space-y-2.5">
                {rivals.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <input
                          className="w-full bg-transparent text-[14.5px] font-semibold text-[#0B0B12] outline-none"
                          value={r.name}
                          onChange={(e) =>
                            setRivals((v) =>
                              v.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x))
                            )
                          }
                        />
                        <p className="truncate text-[11.5px] text-[#6E6E85]">
                          {r.website || r.instagram || r.tiktok}
                        </p>
                      </div>
                      <button
                        className="btn btn-quiet btn-sm shrink-0"
                        onClick={() => setRivals((v) => v.filter((_, idx) => idx !== i))}
                        aria-label="Remove competitor"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                    {r.note && (
                      <p className="mt-2.5 flex gap-2 border-t border-[#E7E7EF] pt-2.5 text-[12.5px] leading-relaxed text-[#55556B]">
                        <Icon name="eye" size={13} className="mt-0.5 shrink-0 text-[#0E7490]" />
                        {r.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#0B0B12]">
                <Icon name="shield" size={14} className="text-[#4D7C0F]" />
                What Koala does with this
              </p>
              <ul className="space-y-1.5">
                {[
                  "Maps each rival onto the archetype they actually behave like",
                  "Names the gap in how they sell — price, service, trust, or silence",
                  "Turns that gap into the angle your posts attack all month",
                ].map((t) => (
                  <li key={t} className="flex gap-2 text-[12.5px] leading-relaxed text-[#63637A]">
                    <Icon name="check" size={12} className="mt-0.5 shrink-0 text-[#4D7C0F]" strokeWidth={2.6} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="label">Anyone else? Names only.</label>
              <input
                className="input"
                value={competitorsInput}
                onChange={(e) => setCompetitorsInput(e.target.value)}
                placeholder="Comma separated"
              />
            </div>
          </div>
        )}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="display text-2xl">What are you selling?</h2>
              <p className="mt-1.5 text-[14px] text-[#63637A]">
                Tag heroes to push them harder, and slow movers so Koala builds rescue campaigns for
                them in week three.
              </p>
            </div>

            <div className="rounded-2xl border border-[#7C5CFF]/25 bg-[#7C5CFF]/[0.06] p-4">
              <label className="label flex items-center gap-1.5">
                <Icon name="store" size={14} className="text-[#5B3FE0]" />
                Import from a store or product link
              </label>
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="yourstore.com  or  yourstore.com/products/the-thing"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void importProductLink(productUrl);
                    }
                  }}
                />
                <button
                  onClick={() => void importProductLink(productUrl)}
                  className="btn btn-primary shrink-0"
                  disabled={productBusy || !productUrl.trim()}
                >
                  {productBusy ? "Reading…" : "Import"}
                </button>
              </div>
              {productNote && (
                <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-[#5B3FE0]">
                  <Icon name="sparkle" size={12} className="mt-0.5 shrink-0" filled />
                  {productNote}
                </p>
              )}
              <p className="mt-2 text-[11px] text-[#6E6E85]">
                Works with Shopify and WooCommerce stores, and any product page with structured data.
                Paste the whole shop to pull the catalogue, or one product to add just that.
              </p>
            </div>

            <div className="space-y-3">
              {products.map((p, i) => (
                <div key={i} className="rounded-2xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg border border-[#E7E7EF] object-cover"
                      />
                    )}
                    <input
                      className="input"
                      value={p.name}
                      onChange={(e) => updateProduct(i, { name: e.target.value })}
                      placeholder="Product or service name"
                    />
                    <input
                      className="input w-24 shrink-0"
                      value={p.price}
                      onChange={(e) => updateProduct(i, { price: e.target.value })}
                      placeholder="£16"
                    />
                    {products.length > 1 && (
                      <button
                        className="btn btn-quiet btn-sm shrink-0"
                        onClick={() => setProducts((v) => v.filter((_, idx) => idx !== i))}
                        aria-label="Remove product"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="mb-3 flex gap-2">
                    {(
                      [
                        ["hero", "Hero — push hardest", "#4D7C0F"],
                        ["core", "Core line", "#55556B"],
                        ["slow", "Slow mover — rescue", "#B45309"],
                      ] as const
                    ).map(([tier, label, color]) => (
                      <button
                        key={tier}
                        onClick={() => updateProduct(i, { tier })}
                        className="chip"
                        style={
                          p.tier === tier
                            ? { color, borderColor: `${color}66`, background: `${color}18` }
                            : undefined
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <input
                      className="input"
                      value={p.description}
                      onChange={(e) => updateProduct(i, { description: e.target.value })}
                      placeholder="One line describing it"
                    />
                    <input
                      className="input"
                      value={p.benefits}
                      onChange={(e) => updateProduct(i, { benefits: e.target.value })}
                      placeholder="Main benefit, e.g. flat whites that taste like the good cafe"
                    />
                    <input
                      className="input sm:col-span-2"
                      value={p.objection}
                      onChange={(e) => updateProduct(i, { objection: e.target.value })}
                      placeholder="The doubt people have before buying it"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-ghost btn-sm" onClick={() => setProducts((v) => [...v, emptyProduct()])}>
              + Add another product
            </button>
          </div>
        )}

        {/* ---------- STEP 4 : REVIEW ---------- */}
        {step === 7 && (
          <div className="space-y-5">
            <div>
              <h2 className="display text-2xl">Check three days first</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#63637A]">
                Before Koala builds all {options.totalPosts}, here is what your month will look and
                sound like. Adjust until it feels right.
              </p>
            </div>

            {sampleBusy && (
              <div className="flex flex-col items-center gap-3 py-10">
                <Koala size={140} mood="thinking" />
                <p className="text-[13px] text-[#63637A]">Making three samples…</p>
              </div>
            )}

            {sampleError && (
              <p className="rounded-xl border border-[#C2255C]/30 bg-[#C2255C]/10 px-4 py-3 text-[13px] text-[#C2255C]">
                {sampleError}
              </p>
            )}

            {!sampleBusy && samples.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {samples.map((s) => {
                    const vote = sampleVotes[s.id];
                    return (
                      <div key={s.id} className="min-w-0">
                        <div
                          className="overflow-hidden rounded-xl border border-[#E7E7EF] bg-[#0B0B12]/[0.045] [&>svg]:h-auto [&>svg]:w-full"
                          dangerouslySetInnerHTML={{ __html: s.svg }}
                        />
                        <p className="mt-2 truncate text-[11px] text-[#6E6E85]">
                          Day {s.day} · {s.contentTypeName}
                        </p>
                        <div className="mt-1.5 flex gap-1.5">
                          <button
                            onClick={() => setSampleVotes((v) => ({ ...v, [s.id]: v[s.id] === 1 ? 0 : 1 }))}
                            className={`flex flex-1 items-center justify-center rounded-lg border py-1.5 transition-colors ${
                              vote === 1
                                ? "border-[#4D7C0F]/60 bg-[#4D7C0F]/15 text-[#4D7C0F]"
                                : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] text-[#6E6E85] hover:text-[#55556B]"
                            }`}
                            aria-label="Like this sample"
                          >
                            <Icon name="heart" size={13} filled={vote === 1} />
                          </button>
                          <button
                            onClick={() => setSampleVotes((v) => ({ ...v, [s.id]: v[s.id] === -1 ? 0 : -1 }))}
                            className={`flex flex-1 items-center justify-center rounded-lg border py-1.5 transition-colors ${
                              vote === -1
                                ? "border-[#C2255C]/60 bg-[#C2255C]/15 text-[#C2255C]"
                                : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] text-[#6E6E85] hover:text-[#55556B]"
                            }`}
                            aria-label="Dislike this sample"
                          >
                            <Icon name="close" size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-4">
                  <p className="mb-1 text-[13px] font-semibold text-[#0B0B12]">Not quite right?</p>
                  <p className="mb-3 text-[12px] text-[#6E6E85]">
                    Tap an adjustment and the samples rebuild.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ADJUSTMENTS.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => applyAdjustment(a)}
                        className="chip transition-transform active:scale-95"
                      >
                        <Icon name={a.icon} size={12} />
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => void loadSamples()}
                    className="btn btn-ghost btn-sm mt-3 w-full"
                  >
                    <Icon name="shuffle" size={13} />
                    Show me three different days
                  </button>
                </div>
              </>
            )}
            <div>
              <h2 className="display mt-2 text-lg">Everything Koala will use</h2>
              <p className="mt-1.5 text-[13px] text-[#63637A]">
                Then it writes the strategy and produces{" "}
                {options.totalPosts} posts
                {options.videos > 0 ? ` and ${options.videos} video scripts` : ""} across the next 30
                days.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Goal", getGoal(goal).label],
                ["Content", CONTENT_KINDS.filter((k) => contentMix[k.key]).map((k) => k.short).join(", ") || "none"],
                ["Competitors", rivals.length ? `${rivals.length} analysed` : "none added"],
                ...(contentMix.video
                  ? [["Video style", `${videoStyle.talent}, ${videoStyle.voice} voice, ${videoStyle.captions} captions`] as [string, string]]
                  : []),
                ["Brand", name || "—"],
                [
                  "Category",
                  category === "other"
                    ? customCategory.trim() || "General Business"
                    : options.categories.find((c) => c.key === category)?.label || category,
                ],
                ["Voice", voice],
                ["Language", `${getLocale(locale).language} — ${getLocale(locale).dialect}`],
                ["Platforms", platforms.join(", ") || "—"],
                ["Products", `${products.filter((p) => p.name.trim()).length} added`],
                ["Heroes", products.filter((p) => p.tier === "hero" && p.name.trim()).length || "none tagged"],
                ["Slow movers", products.filter((p) => p.tier === "slow" && p.name.trim()).length || "none tagged"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-[#6E6E85]">{k}</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium text-[#0B0B12]">{String(v)}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl border border-[#E7E7EF] p-5"
              style={{ background: colors.background }}
            >
              <p className="text-[11px] uppercase tracking-wider" style={{ color: colors.primary }}>
                Preview
              </p>
              <p className="display mt-2 text-2xl" style={{ color: colors.text }}>
                {tagline || name || "Your brand"}
              </p>
              <div className="mt-4 flex gap-2">
                {[colors.primary, colors.secondary, colors.text].map((c, i) => (
                  <span key={i} className="h-7 w-7 rounded-lg" style={{ background: c }} />
                ))}
              </div>
            </div>

            {products.filter((p) => p.tier === "slow" && p.name.trim()).length === 0 && (
              <p className="rounded-xl border border-[#B45309]/25 bg-[#B45309]/[0.07] px-4 py-3 text-[12.5px] leading-relaxed text-[#B45309]">
                No slow movers tagged. That is fine — but tagging them is how Koala builds the week
                three rescue campaigns that shift stubborn stock.
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="mt-5 rounded-lg border border-[#C2255C]/30 bg-[#C2255C]/10 px-3 py-2.5 text-[13px] text-[#C2255C]">
            {error}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-[#E7E7EF] pt-5">
          <button
            className="btn btn-quiet"
            onClick={() => (step === 0 ? router.push("/dashboard") : setStep(step - 1))}
            disabled={busy}
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>

          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext}>
              Continue
            </button>
          ) : (
            <button className="btn btn-primary px-6" onClick={submit} disabled={busy}>
              {busy ? "Building your 30 days…" : `Generate all ${options.totalPosts} posts`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
