"use client";

import { useState } from "react";
import { FORMAT_ICON, PILLAR_COLOR, PILLAR_LABEL } from "@/components/PillarStyles";
import { useT } from "@/components/LangProvider";

export interface DemoPost {
  id: string;
  day: number;
  pillar: string;
  funnel: string;
  format: string;
  platform: string;
  timeOfDay: string;
  theme: string;
  hook: string;
  caption: string;
  hashtags: string[];
  visualDirection: string;
  productName: string | null;
}

const WEEKS = [
  { week: 1, name: "Plant the flag", note: "Positioning and reach" },
  { week: 2, name: "Earn the trust", note: "Proof and education" },
  { week: 3, name: "Make the offer", note: "Conversion push" },
  { week: 4, name: "Deepen the loop", note: "Retention and community" },
  { week: 5, name: "Momentum bridge", note: "Relaunch winners" },
];

export default function CalendarDemo({
  posts,
  previews,
}: {
  posts: DemoPost[];
  previews: Record<string, string>;
}) {
  const tr = useT();
  const [selected, setSelected] = useState(posts[2]?.id || posts[0]?.id);
  const [tab, setTab] = useState<"caption" | "art" | "why">("caption");
  const post = posts.find((p) => p.id === selected) || posts[0];
  if (!post) return null;
  const activeWeek = Math.ceil(post.day / 7);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      {/* calendar */}
      <div className="panel p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {WEEKS.map((w) => (
            <span
              key={w.week}
              className={`chip ${activeWeek === w.week ? "chip-on" : ""}`}
              title={w.note}
            >
              W{w.week} · {w.name}
            </span>
          ))}
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1.5 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="text-[10px] font-semibold tracking-widest text-[#4E4E60]">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {posts.map((p) => {
            const on = p.id === selected;
            const color = PILLAR_COLOR[p.pillar] || "#7C5CFF";
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`group relative aspect-square rounded-xl border p-1.5 text-left transition-all ${
                  on
                    ? "border-[#7C5CFF] bg-[#7C5CFF]/12 shadow-[0_0_0_3px_rgba(124,92,255,0.16)]"
                    : "border-[#1E1E28] bg-white/[0.02] hover:border-[#33333F] hover:bg-white/[0.05]"
                }`}
                aria-label={`Day ${p.day}: ${p.hook}`}
              >
                <span className="block text-[11px] font-bold leading-none text-[#9B9BAE]">{p.day}</span>
                <span
                  className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <span className="absolute bottom-1 right-1.5 text-[9px] text-[#4E4E60]">
                  {FORMAT_ICON[p.format] || "▣"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#16161F] pt-4">
          {Object.entries(PILLAR_LABEL).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-[#6C6C80]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: PILLAR_COLOR[key] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* preview */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#16161F] px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4E4E60]">
              Day {post.day} · {post.timeOfDay} · {post.platform}
            </p>
            <p className="truncate text-sm font-semibold text-white">{post.theme}</p>
          </div>
          <span
            className="chip shrink-0"
            style={{
              color: PILLAR_COLOR[post.pillar],
              borderColor: `${PILLAR_COLOR[post.pillar]}55`,
              background: `${PILLAR_COLOR[post.pillar]}14`,
            }}
          >
            {PILLAR_LABEL[post.pillar]}
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[150px_1fr]">
          <div
            className="overflow-hidden rounded-xl border border-[#1E1E28] bg-black [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: previews[post.id] || "" }}
          />

          <div className="min-w-0">
            <div className="mb-3 flex gap-1">
              {(
                [
                  ["caption", tr.demo.tabCaption],
                  ["art", tr.demo.tabArt],
                  ["why", tr.demo.tabWhy],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    tab === k ? "bg-white/10 text-white" : "text-[#6C6C80] hover:text-[#ECECF3]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[220px] overflow-y-auto pr-1 text-[13px] leading-relaxed text-[#9B9BAE] scrollbar-none">
              {tab === "caption" && (
                <>
                  <p className="mb-2 font-semibold text-white">{post.hook}</p>
                  <p className="whitespace-pre-line">{post.caption.split("\n").slice(1).join("\n").trim()}</p>
                  <p className="mt-3 text-[12px] text-[#5B5B70]">
                    {post.hashtags.map((h) => `#${h}`).join(" ")}
                  </p>
                </>
              )}
              {tab === "art" && <p className="whitespace-pre-line">{post.visualDirection}</p>}
              {tab === "why" && (
                <ul className="space-y-2.5">
                  <li>
                    <span className="font-semibold text-white">{tr.demo.whyFunnel}:</span> {post.funnel}.{" "}
                    {tr.demo.whyFunnelBody}
                  </li>
                  <li>
                    <span className="font-semibold text-white">{tr.demo.whyPlacement}:</span> {post.theme} —{" "}
                    {tr.demo.whyPlacementBody}
                  </li>
                  <li>
                    <span className="font-semibold text-white">{tr.demo.whyFormat}:</span> {post.format} ·{" "}
                    {post.platform} — {tr.demo.whyFormatBody}
                  </li>
                  {post.productName && (
                    <li>
                      <span className="font-semibold text-white">{tr.demo.whyProduct}:</span>{" "}
                      {post.productName}.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
