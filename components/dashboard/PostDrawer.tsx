"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { PILLAR_COLOR, PILLAR_LABEL, STATUS_STYLE } from "@/components/PillarStyles";
import { Icon } from "@/components/icons/Ui";
import { PlatformIcon } from "@/components/icons/Social";

const ACTIONS = [
  { key: "rewriteCaption", label: "Just the caption", cost: 1 },
  { key: "newAngle", label: "A different angle", cost: 3 },
  { key: "redesignVisual", label: "Redesign the image", cost: 4 },
  { key: "regenerateDay", label: "Rebuild everything", cost: 6 },
] as const;

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
  const [editing, setEditing] = useState(false);
  const [hook, setHook] = useState(post.hook);
  const [caption, setCaption] = useState(post.caption);
  const [tags, setTags] = useState(post.hashtags.join(" "));
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");
  const [bust, setBust] = useState(Date.now());

  const [changing, setChanging] = useState(false);
  const [action, setAction] = useState<string>("redesignVisual");
  const [prompt, setPrompt] = useState("");
  const [regenBusy, setRegenBusy] = useState(false);
  const [regenError, setRegenError] = useState("");

  const [rating, setRating] = useState(post.feedback?.rating || 0);
  const [note, setNote] = useState(post.feedback?.note || "");
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setHook(post.hook);
    setCaption(post.caption);
    setTags(post.hashtags.join(" "));
    setRating(post.feedback?.rating || 0);
    setNote(post.feedback?.note || "");
    setEditing(false);
    setBust(Date.now());
  }, [post.id, post.hook, post.caption, post.hashtags, post.feedback]);

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
    if (res.ok && data.post) onUpdated(data.post);
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
    setChanging(false);
    setBust(Date.now());
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  }

  const hashText = tags
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");
  const fullCaption = `${caption}\n\n${hashText}`;
  const selected = ACTIONS.find((a) => a.key === action)!;
  const affordable = credits >= selected.cost;
  const posted = post.status === "posted";
  const isVideo = post.format === "video";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <aside className="flex h-full w-full max-w-[30rem] flex-col border-l border-[#1A1A24] bg-[#0A0A11] shadow-2xl">
        {/* ---- header ---- */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#16161F] px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-white">Day {post.day}</p>
            <p className="flex items-center gap-1.5 text-[12px] text-[#5B5B70]">
              {post.timeOfDay}
              <PlatformIcon platform={post.platform} size={12} />
              {post.contentTypeName || post.format}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-quiet btn-sm shrink-0" aria-label="Close">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* ---- the post itself, immediately ---- */}
          <div className="bg-black p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.assetUrl || `/api/render/${post.id}?v=${bust}`}
              alt=""
              className="mx-auto max-h-[420px] w-auto rounded-xl"
            />
            {isVideo && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#6C6C80]">
                <Icon name="video" size={13} />
                Cover frame — the full script is at the bottom
              </p>
            )}
          </div>

          {/* ---- copy / download / edit ---- */}
          <div className="grid grid-cols-3 gap-2 border-b border-[#16161F] p-4">
            <button
              className="btn btn-ghost btn-sm flex-col gap-1 py-2.5"
              onClick={() => copy(fullCaption, "cap")}
            >
              <Icon name={copied === "cap" ? "check" : "copy"} size={16} />
              <span className="text-[11.5px]">{copied === "cap" ? "Copied" : "Copy caption"}</span>
            </button>
            <a
              className="btn btn-ghost btn-sm flex-col gap-1 py-2.5"
              href={`/api/render/${post.id}?download=1`}
              download
            >
              <Icon name="download" size={16} />
              <span className="text-[11.5px]">Download</span>
            </a>
            <button
              className="btn btn-ghost btn-sm flex-col gap-1 py-2.5"
              onClick={() => setEditing((v) => !v)}
            >
              <Icon name="edit" size={16} />
              <span className="text-[11.5px]">{editing ? "Done" : "Edit"}</span>
            </button>
          </div>

          {/* ---- caption ---- */}
          <div className="border-b border-[#16161F] p-5">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Hook</label>
                  <input className="input" value={hook} onChange={(e) => setHook(e.target.value)} />
                </div>
                <div>
                  <label className="label">Caption</label>
                  <textarea
                    className="input min-h-[190px]"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Hashtags</label>
                  <textarea
                    className="input min-h-[64px]"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary w-full"
                  disabled={saving}
                  onClick={async () => {
                    await patch({
                      hook,
                      caption,
                      hashtags: tags.split(/\s+/).filter(Boolean).map((t) => t.replace(/^#/, "")),
                    });
                    setEditing(false);
                  }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#D6D6E2]">{caption}</p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-[#5B5B70]">{hashText}</p>
              </>
            )}
          </div>

          {/* ---- posted ---- */}
          <div className="border-b border-[#16161F] p-5">
            <button
              onClick={() => patch({ status: posted ? "approved" : "posted" })}
              className={`btn w-full py-3 ${posted ? "btn-ghost" : "btn-primary"}`}
              disabled={saving}
            >
              <Icon name={posted ? "check" : "send"} size={16} strokeWidth={posted ? 3 : 1.8} />
              {posted ? "Posted — tap to undo" : "Mark as posted"}
            </button>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {(["draft", "approved", "scheduled", "skipped"] as const).map((s) => {
                const st = STATUS_STYLE[s];
                const on = post.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => patch({ status: s })}
                    className="chip"
                    style={on ? { color: st.color, background: st.bg, borderColor: `${st.color}55` } : undefined}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---- rate ---- */}
          <div className="border-b border-[#16161F] p-5">
            <p className="mb-2.5 text-[13px] font-semibold text-white">How is this one?</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setRating(n);
                    void patch({ feedback: { rating: n, note } });
                  }}
                  className={`h-10 flex-1 rounded-xl border text-lg transition-colors ${
                    n <= rating
                      ? "border-[#FFB443]/50 bg-[#FFB443]/15 text-[#FFB443]"
                      : "border-[#1E1E28] bg-white/[0.02] text-[#3E3E4E] hover:text-[#6C6C80]"
                  }`}
                  aria-label={`${n} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="input mt-2.5 min-h-[60px] text-[13px]"
              placeholder="What would make it better? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => rating && patch({ feedback: { rating, note } })}
            />
          </div>

          {/* ---- change it ---- */}
          <div className="border-b border-[#16161F] p-5">
            {!changing ? (
              <button className="btn btn-ghost w-full" onClick={() => setChanging(true)}>
                <Icon name="wand" size={15} />
                Change this post
                <span className="ml-1 text-[11px] text-[#5B5B70]">
                  {credits.toLocaleString()} credits
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-white">What should change?</p>
                  <button className="btn btn-quiet btn-sm" onClick={() => setChanging(false)}>
                    <Icon name="close" size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {ACTIONS.map((a) => (
                    <button
                      key={a.key}
                      onClick={() => setAction(a.key)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-[12.5px] transition-colors ${
                        action === a.key
                          ? "border-[#7C5CFF] bg-[#7C5CFF]/12 text-white"
                          : "border-[#1E1E28] bg-white/[0.02] text-[#9B9BAE] hover:border-[#33333F]"
                      }`}
                    >
                      {a.label}
                      <span className="mt-0.5 block text-[10.5px] text-[#5B5B70]">{a.cost} credits</span>
                    </button>
                  ))}
                </div>

                <textarea
                  className="input min-h-[72px] text-[13px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Tell Kai what is wrong. e.g. too salesy, make the product bigger, warmer colours."
                />

                {regenError && <p className="text-[12px] text-[#FFA7BB]">{regenError}</p>}

                <button
                  className="btn btn-primary w-full"
                  disabled={regenBusy || !affordable}
                  onClick={regenerate}
                >
                  {regenBusy
                    ? "Rebuilding…"
                    : affordable
                    ? `Apply · ${selected.cost} credits`
                    : "Not enough credits"}
                </button>
              </div>
            )}
          </div>

          {/* ---- the reasoning, tucked away ---- */}
          <div className="p-5">
            <button
              onClick={() => setShowDetail((v) => !v)}
              className="flex w-full items-center justify-between text-[13px] font-semibold text-[#7C7C90] hover:text-white"
            >
              {isVideo ? "Script and shot list" : "Why this post, and how to shoot it"}
              <Icon name="arrowDown" size={14} className={showDetail ? "rotate-180" : ""} />
            </button>

            {showDetail && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-1.5">
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
                  <span className="chip">{post.theme}</span>
                  {post.productName && <span className="chip">{post.productName}</span>}
                </div>

                {post.contentWhy && (
                  <p className="text-[13px] leading-relaxed text-[#8A8A9E]">{post.contentWhy}</p>
                )}

                <pre className="whitespace-pre-wrap rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3.5 font-sans text-[12.5px] leading-relaxed text-[#8A8A9E]">
                  {post.visualDirection}
                </pre>

                {post.revisions.length > 0 && (
                  <div className="space-y-1.5">
                    {post.revisions.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 text-[11.5px] text-[#5B5B70]"
                      >
                        <span className="truncate">{r.prompt}</span>
                        <span className="shrink-0">-{r.creditsSpent}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
