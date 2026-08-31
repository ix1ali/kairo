import { PLATFORM_COLOR, PLATFORM_ICONS } from "@/components/icons/Social";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * Where the content goes. Split out of the hero ticker, because "who this is
 * for" and "where it gets posted" are different questions.
 *
 * Each platform keeps its own brand colour — those are real marks, not our
 * palette — and carries the size it gets exported at, which is the actual
 * answer to "will this fit my feed".
 */

const PLATFORMS: { key: string; label: string; size: string }[] = [
  { key: "instagram", label: "Instagram", size: "1080 × 1350" },
  { key: "tiktok", label: "TikTok", size: "1080 × 1920" },
  { key: "youtube", label: "YouTube Shorts", size: "1080 × 1920" },
  { key: "facebook", label: "Facebook", size: "1080 × 1350" },
  { key: "linkedin", label: "LinkedIn", size: "1200 × 1200" },
  { key: "x", label: "X", size: "1600 × 900" },
  { key: "pinterest", label: "Pinterest", size: "1000 × 1500" },
  { key: "threads", label: "Threads", size: "1080 × 1350" },
];

export default async function Platforms() {
  const t = dict(await getLang()).platforms;

  return (
    <div>
      <SectionHead eyebrow={t.eyebrow} title={t.h1} sub={t.sub} />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {PLATFORMS.map((p) => {
          const Cmp = PLATFORM_ICONS[p.key];
          const color = PLATFORM_COLOR[p.key];
          return (
            <div
              key={p.key}
              className="group flex items-center gap-3 rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-3.5 transition-colors duration-300 hover:border-[#3A3355]"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ background: `${color}1A`, color }}
              >
                <Cmp size={19} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-white">{p.label}</p>
                <p className="text-[11.5px] tabular-nums text-[#7E7E93]">{p.size}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
