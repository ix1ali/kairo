"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { FUNNEL_LABEL, PILLAR_COLOR, PILLAR_LABEL, STATUS_STYLE } from "@/components/PillarStyles";
import { Icon } from "@/components/icons/Ui";
import { PlatformIcon } from "@/components/icons/Social";

const ACTIONS = [
  { key: "rewriteCaption", label: "Rewrite caption", cost: 1, hint: "New copy, same visual and angle." },
  { key: "newAngle", label: "New creative angle", cost: 3, hint: "Different hook and concept." },
  { key: "redesignVisual", label: "Redesign visual", cost: 4, hint: "Regenerate the artwork." },
  { key: "regenerateDay", label: "Regenerate whole day", cost: 6, hint: "Copy and visual, end to end." },
  { key: "regenerateVideo", label: "Regenerate video", cost: 20, hint: "New script and storyboard." },
] as const;

const STATUSES: Post["status"][] = ["draft", "approved", "scheduled", "posted", "skipped"];

function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PostDrawer({
  post,
  credits,
  onClose,
  onUpdated,
  onCredits,
}: {
  post: Post;
  credits: number;
  onClose: () => void;
  onUpdated: (p: Post) => void;
  onCredits: (c: number) => void;
}) {
  const [tab, setTab] = useState<"content" | "design" | "results">("content");
  const [hook, setHook] = useState(post.hook);
  const [caption, setCaption] = useState(post.caption);
  const [tags, setTags] = useState(post.hashtags.join(" "));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");
  const [bust, setBust] = useState(Date.now());

  const [action, setAction] = useState<string>("redesignVisual");
  const [prompt, setPrompt] = useState("");
  const [regenBusy, setRegenBusy] = useState(false);
  const [regenError, setRegenError] = useState("");

  const [rating, setRating] = useState(post.feedback?.rating || 0);
  const [note, setNote] = useState(post.feedback?.note || "");
  const [metrics, setMetrics] = useState(
    post.metrics || { reach: 0, likes: 0, comments: 0, saves: 0 }
  );

  useEffect(() => {
    setHook(post.hook);
    setCaption(post.caption);
    setTags(post.hashtags.join(" "));
    setRating(post.feedback?.rating || 0);
    setNote(post.feedback?.note || "");
    setMetrics(post.metrics || { reach: 0, likes: 0, comments: 0, saves: 0 });
    setDirty(false);
    setBust(Date.now());
  }, [post.id, post.hook, post.caption, post.hashtags, post.feedback, post.metrics]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok && data.post) {
      onUpdated(data.post);
      setDirty(false);
    }
  }

  async function regenerate() {
    setRegenBusy(true);
    setRegenError("");
    const res = await fetch(`/api/posts/${post.id}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, prompt }),
    });
    const data = await res.json().catch(() => ({}));
    setRegenBusy(false);
    if (!res.ok) {
      setRegenError(data.error || "Could not regenerate.");
      return;
    }
    onUpdated(data.post);
    onCredits(data.credits);
    setPrompt("");
    setBust(Date.now());
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  }

  const selectedAction = ACTIONS.find((a) => a.key === action)!;
  const affordable = credits >= selectedAction.cost;
  const status = STATUS_STYLE[post.status];
  const isVideo = post.format === "video";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <aside className="flex h-full w-full max-w-[42rem] flex-col border-l border-[#1A1A24] bg-[#0A0A11] shadow-2xl">
        {/* header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#16161F] px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="chip"
                style={{
                  color: PILLAR_COLOR[post.pillar],
                  borderColor: `${PILLAR_COLOR[post.pillar]}55`,
                  background: `${PILLAR_COLOR[post.pillar]}14`,
                }}
              >
                {PILLAR_LABEL[post.pillar]}
              </span>
              <span className="chip">{FUNNEL_LABEL[post.funnel] || post.funnel}</span>
              <span className="chip">{post.format}</span>
              <span className="chip capitalize">
                <PlatformIcon platform={post.platform} size={12} />
                {post.platform}
              </span>
            </div>
            <h2 className="display mt-2.5 text-xl">
              Day {post.day} · {post.timeOfDay}
            </h2>
            <p className="mt-0.5 text-[12px] text-[#5B5B70]">
              {new Date(post.date).toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              · {post.theme}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-quiet btn-sm shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* status row */}
        <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-[#16161F] px-6 py-3">
          {STATUSES.map((s) => {
            const st = STATUS_STYLE[s];
            const on = post.status === s;
            return (
              <button
                key={s}
                onClick={() => patch({ status: s })}
                className="chip transition-transform active:scale-95"
                style={on ? { color: st.color, background: st.bg, borderColor: `${st.color}55` } : undefined}
              >
                <Icon name={st.icon} size={11} strokeWidth={2.6} />
                {st.label}
              </button>
            );
          })}
          <span className="ml-auto self-center text-[11px] text-[#4E4E60]">
            {saving ? "Saving…" : post.postedAt ? `Posted ${new Date(post.postedAt).toLocaleDateString()}` : status.label}
          </span>
        </div>

        {/* tabs */}
        <div className="flex shrink-0 gap-1 border-b border-[#16161F] px-6 py-2.5">
          {(
            [
              ["content", "Content"],
              ["design", isVideo ? "Script" : "Design"],
              ["results", "Results"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                tab === k ? "bg-white/10 text-white" : "text-[#6C6C80] hover:text-[#ECECF3]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "content" && (
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-[124px] shrink-0 overflow-hidden rounded-xl border border-[#1E1E28] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.assetUrl || `/api/render/${post.id}?v=${bust}`}
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <a
                    className="btn btn-ghost btn-sm w-full"
                    href={`/api/render/${post.id}?download=1`}
                    download
                  >
                    <Icon name="download" size={14} />
                    Download visual
                  </a>
                  <button
                    className="btn btn-ghost btn-sm w-full"
                    onClick={() =>
                      download(
                        `day-${post.day}-caption.txt`,
                        `${caption}\n\n${tags
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((t) => (t.startsWith("#") ? t : `#${t}`))
                          .join(" ")}`
                      )
                    }
                  >
                    <Icon name="text" size={14} />
                    Download caption
                  </button>
                  <button
                    className="btn btn-ghost btn-sm w-full"
                    onClick={() => copy(caption, "caption")}
                  >
                    <Icon name={copied === "caption" ? "check" : "copy"} size={14} />
                    {copied === "caption" ? "Copied" : "Copy caption"}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm w-full"
                    onClick={() =>
                      copy(
                        tags
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((t) => (t.startsWith("#") ? t : `#${t}`))
                          .join(" "),
                        "tags"
                      )
                    }
                  >
                    <Icon name={copied === "tags" ? "check" : "hash"} size={14} />
                    {copied === "tags" ? "Copied" : "Copy hashtags"}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Hook</label>
                <input
                  className="input"
                  value={hook}
                  onChange={(e) => {
                    setHook(e.target.value);
                    setDirty(true);
                  }}
                />
              </div>

              <div>
                <label className="label">Caption</label>
                <textarea
                  className="input min-h-[220px]"
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    setDirty(true);
                  }}
                />
                <p className="mt-1.5 text-[11px] text-[#4E4E60]">{caption.length} characters</p>
              </div>

              <div>
                <label className="label">Hashtags</label>
                <textarea
                  className="input min-h-[70px]"
                  value={tags}
                  onChange={(e) => {
                    setTags(e.target.value);
                    setDirty(true);
                  }}
                />
              </div>

              <div>
                <label className="label">Call to action</label>
                <p className="rounded-xl border border-[#1E1E28] bg-white/[0.02] px-3.5 py-2.5 text-[13px] text-[#9B9BAE]">
                  {post.cta}
                </p>
              </div>

              {dirty && (
                <button
                  className="btn btn-primary w-full"
                  disabled={saving}
                  onClick={() =>
                    patch({
                      hook,
                      caption,
                      hashtags: tags.split(/\s+/).filter(Boolean).map((t) => t.replace(/^#/, "")),
                    })
                  }
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              )}
            </div>
          )}

          {tab === "design" && (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-xl border border-[#1E1E28] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.assetUrl || `/api/render/${post.id}?v=${bust}`}
                  alt=""
                  className="mx-auto max-h-[420px] w-auto"
                />
              </div>

              <div>
                <label className="label">{isVideo ? "Script and shot list" : "Art direction"}</label>
                <pre className="whitespace-pre-wrap rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3.5 font-sans text-[13px] leading-relaxed text-[#9B9BAE]">
                  {post.visualDirection}
                </pre>
              </div>

              <div>
                <label className="label">Generation prompt</label>
                <p className="rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3 text-[12px] leading-relaxed text-[#6C6C80]">
                  {post.visualPrompt}
                </p>
              </div>

              {/* regenerate */}
              <div className="rounded-2xl border border-[#7C5CFF]/25 bg-[#7C5CFF]/[0.06] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-white">Change it with a prompt</p>
                  <span className="chip">{credits.toLocaleString()} credits</span>
                </div>

                <div className="mb-3 grid gap-1.5">
                  {ACTIONS.filter((a) => (isVideo ? true : a.key !== "regenerateVideo")).map((a) => (
                    <button
                      key={a.key}
                      onClick={() => setAction(a.key)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        action === a.key
                          ? "border-[#7C5CFF] bg-[#7C5CFF]/12"
                          : "border-[#1E1E28] bg-white/[0.02] hover:border-[#33333F]"
                      }`}
                    >
                      <span>
                        <span className="block text-[13px] font-medium text-white">{a.label}</span>
                        <span className="block text-[11px] text-[#6C6C80]">{a.hint}</span>
                      </span>
                      <span className="chip shrink-0">{a.cost} cr</span>
                    </button>
                  ))}
                </div>

                <textarea
                  className="input min-h-[80px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the change. e.g. Make it feel warmer, put the product bigger, lead with the price, drop the question."
                />

                {regenError && <p className="mt-2 text-[12px] text-[#FFA7BB]">{regenError}</p>}

                <button
                  className="btn btn-primary mt-3 w-full"
                  disabled={regenBusy || !affordable}
                  onClick={regenerate}
                >
                  {regenBusy
                    ? "Rebuilding…"
                    : affordable
                    ? `Apply for ${selectedAction.cost} credits`
                    : "Not enough credits"}
                </button>
                {!affordable && (
                  <a href="/dashboard/credits" className="mt-2 block text-center text-[12px] text-[#A78BFA]">
                    Top up credits →
                  </a>
                )}
              </div>

              {post.revisions.length > 0 && (
                <div>
                  <label className="label">Revision history</label>
                  <div className="space-y-1.5">
                    {post.revisions.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 rounded-xl border border-[#1E1E28] bg-white/[0.02] px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] text-[#9B9BAE]">{r.prompt}</p>
                          <p className="text-[11px] text-[#4E4E60]">
                            {new Date(r.at).toLocaleString()}
                          </p>
                        </div>
                        <span className="chip shrink-0">-{r.creditsSpent}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "results" && (
            <div className="space-y-5">
              <div>
                <label className="label">How did this one land?</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className={`h-10 w-10 rounded-xl border text-lg transition-colors ${
                        n <= rating
                          ? "border-[#FFB443]/50 bg-[#FFB443]/15 text-[#FFB443]"
                          : "border-[#1E1E28] bg-white/[0.02] text-[#3E3E4E] hover:text-[#6C6C80]"
                      }`}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Notes for next month</label>
                <textarea
                  className="input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What worked, what fell flat, what the comments said."
                />
              </div>

              <div>
                <label className="label">Performance</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {(["reach", "likes", "comments", "saves"] as const).map((k) => (
                    <div key={k} className="rounded-xl border border-[#1E1E28] bg-white/[0.02] p-3">
                      <p className="text-[11px] uppercase tracking-wider text-[#4E4E60]">{k}</p>
                      <input
                        type="number"
                        min={0}
                        className="mt-1 w-full bg-transparent text-lg font-semibold text-white outline-none"
                        value={metrics[k]}
                        onChange={(e) => setMetrics((m) => ({ ...m, [k]: Number(e.target.value) }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary w-full"
                disabled={saving}
                onClick={() => patch({ feedback: { rating, note }, metrics })}
              >
                {saving ? "Saving…" : "Save results"}
              </button>

              <p className="text-[11.5px] leading-relaxed text-[#4E4E60]">
                Ratings and notes shape how Kairo rebuilds posts and what it leans into next cycle.
                Metrics are yours to log — nothing is pulled from your accounts automatically.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
