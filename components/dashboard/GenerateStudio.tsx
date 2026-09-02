"use client";

import { useRef, useState } from "react";
import { Icon, type IconName } from "@/components/icons/Ui";

/**
 * One-off generation, outside the monthly calendar.
 *
 * Two things people actually want between months: a single image or clip for
 * something that just came up, and "make it look like this" from a reference
 * they already have.
 *
 * The reference never leaves the browser. Its palette is sampled here on a
 * canvas and only the hex values are sent, which is both faster and means we
 * are not storing other people's artwork.
 */

const COST = { image: 4, video: 20 } as const;

const ASPECTS: { value: "4:5" | "1:1" | "9:16"; label: string; note: string }[] = [
  { value: "4:5", label: "Portrait", note: "Feed post" },
  { value: "1:1", label: "Square", note: "Grid" },
  { value: "9:16", label: "Vertical", note: "Story or reel" },
];

const IDEAS: { icon: IconName; label: string; prompt: string }[] = [
  { icon: "image", label: "Product on a surface", prompt: "My product on a warm stone surface, soft window light from the left, deep shadow, space at the top for a headline" },
  { icon: "sparkle", label: "Ingredient splash", prompt: "My product surrounded by its ingredients mid-air, water splash, bright and clean, studio lighting" },
  { icon: "users", label: "Held in hand", prompt: "A hand holding my product against a plain background, natural skin tone, shallow depth of field" },
  { icon: "tag", label: "Offer post", prompt: "My product with bold space for a discount headline, high contrast, brand colours, made to stop the scroll" },
];

/** Samples a small palette from an image without uploading it anywhere. */
async function samplePalette(file: File): Promise<string[]> {
  const bitmap = await createImageBitmap(file);
  const w = 48;
  const h = Math.max(1, Math.round((bitmap.height / bitmap.width) * w));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.drawImage(bitmap, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue;
    const key = [r >> 5, g >> 5, b >> 5].join(",");
    const cur = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    buckets.set(key, { n: cur.n + 1, r: cur.r + r, g: cur.g + g, b: cur.b + b });
  }

  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
    .map((c) =>
      "#" +
      [c.r / c.n, c.g / c.n, c.b / c.n]
        .map((v) => Math.round(v).toString(16).padStart(2, "0"))
        .join("")
    );
}

export default function GenerateStudio({
  projects,
  credits,
}: {
  projects: { id: string; name: string }[];
  credits: number;
}) {
  const [kind, setKind] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<"4:5" | "1:1" | "9:16">("4:5");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [palette, setPalette] = useState<string[]>([]);
  const [refName, setRefName] = useState("");
  const [refNote, setRefNote] = useState("");
  const [balance, setBalance] = useState(credits);
  const [result, setResult] = useState<{ url: string; kind: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const cost = COST[kind];
  const affordable = balance >= cost;

  async function onReference(file: File | undefined) {
    if (!file) return;
    setRefName(file.name);
    try {
      setPalette(await samplePalette(file));
    } catch {
      setPalette([]);
    }
  }

  async function run() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          prompt,
          aspect,
          projectId: projectId || undefined,
          palette,
          referenceNote: refNote || undefined,
        }),
      });
      const raw = await res.text();
      let data: { url?: string; kind?: string; credits?: number; error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError(`The server returned an unexpected reply (${res.status}).`);
        return;
      }
      if (!res.ok) {
        setError(data.error || `Could not generate (${res.status}).`);
        return;
      }
      setResult({ url: data.url!, kind: data.kind! });
      if (typeof data.credits === "number") setBalance(data.credits);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <div className="panel p-6">
        {/* what to make */}
        <div className="mb-5 grid grid-cols-2 gap-2">
          {(["image", "video"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-xl border p-3.5 text-start transition-colors ${
                kind === k
                  ? "border-[#7C5CFF] bg-[#7C5CFF]/12"
                  : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9C9D8]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name={k === "image" ? "image" : "video"} size={15} />
                <span className="text-[14px] font-semibold text-[#0B0B12]">
                  {k === "image" ? "An image" : "A video"}
                </span>
              </span>
              <span className="mt-1 block text-[12px] text-[#63637A]">{COST[k]} credits</span>
            </button>
          ))}
        </div>

        <label className="label">What do you want?</label>
        <textarea
          className="input"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="My lip glaze on a marble surface with berries, soft morning light, space at the top for a headline"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {IDEAS.map((i) => (
            <button
              key={i.label}
              onClick={() => setPrompt(i.prompt)}
              className="chip"
            >
              <Icon name={i.icon} size={12} />
              {i.label}
            </button>
          ))}
        </div>

        {kind === "image" && (
          <div className="mt-5">
            <label className="label">Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECTS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAspect(a.value)}
                  className={`rounded-xl border p-2.5 text-center transition-colors ${
                    aspect === a.value
                      ? "border-[#7C5CFF] bg-[#7C5CFF]/12"
                      : "border-[#E7E7EF] bg-[#0B0B12]/[0.025] hover:border-[#C9C9D8]"
                  }`}
                >
                  <p className="text-[13px] font-semibold text-[#0B0B12]">{a.label}</p>
                  <p className="text-[11px] text-[#63637A]">{a.note}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* reference */}
        <div className="mt-5 rounded-xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-4">
          <p className="text-[13.5px] font-semibold text-[#0B0B12]">Copy a look you like</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#63637A]">
            Add a picture or a frame from a video and we match its colours and mood. The file
            stays on your device: only the colours are sent.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button onClick={() => fileRef.current?.click()} className="btn btn-ghost btn-sm">
              <Icon name="upload" size={13} />
              {refName ? "Change reference" : "Choose a reference"}
            </button>
            {palette.length > 0 && (
              <span className="flex items-center gap-1">
                {palette.map((c) => (
                  <span
                    key={c}
                    className="h-6 w-6 rounded-md border border-[#0B0B12]/10"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </span>
            )}
            {refName && (
              <button
                onClick={() => {
                  setRefName("");
                  setPalette([]);
                }}
                className="btn btn-quiet btn-sm"
              >
                Clear
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onReference(e.target.files?.[0])}
          />

          <input
            className="input mt-3"
            value={refNote}
            onChange={(e) => setRefNote(e.target.value)}
            placeholder="What to copy from it — lighting, angle, mood…"
          />
        </div>

        {projects.length > 0 && (
          <div className="mt-5">
            <label className="label">Use a brand</label>
            <select
              className="input"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">No brand, just this prompt</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-[#C2255C]/30 bg-[#C2255C]/10 px-3 py-2.5 text-[13px] text-[#C2255C]">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={run}
            disabled={busy || prompt.trim().length < 8 || !affordable}
            className="btn btn-primary"
          >
            {busy ? "Making it…" : `Generate for ${cost} credits`}
          </button>
          <span className="text-[12.5px] text-[#6E6E85]">
            {affordable ? `${balance} credits left` : "Not enough credits"}
          </span>
        </div>
      </div>

      {/* result */}
      <div className="panel flex min-h-[380px] flex-col items-center justify-center p-6">
        {busy ? (
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#E7E7EF] border-t-[#7C5CFF]" />
            <p className="text-[14px] text-[#55556B]">
              {kind === "video" ? "Videos take a minute or so." : "Usually about ten seconds."}
            </p>
          </div>
        ) : result ? (
          <div className="w-full">
            <div className="overflow-hidden rounded-xl border border-[#E7E7EF] bg-black">
              {result.kind === "video" ? (
                <video src={result.url} controls loop className="w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="" className="w-full" />
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={result.url} download className="btn btn-primary btn-sm">
                <Icon name="download" size={13} />
                Download
              </a>
              <button onClick={run} className="btn btn-ghost btn-sm">
                <Icon name="shuffle" size={13} />
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#7C5CFF]/12 text-[#6D4DF6]">
              <Icon name="wand" size={22} />
            </span>
            <p className="text-[14px] font-medium text-[#0B0B12]">Nothing made yet</p>
            <p className="mx-auto mt-1.5 max-w-[30ch] text-[12.5px] leading-relaxed text-[#63637A]">
              Describe what you want, or drop in a picture whose look you want to copy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
