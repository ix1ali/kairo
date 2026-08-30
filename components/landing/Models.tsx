import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * Abstract marks, not trademark reproductions — each model is identified by
 * its name.
 *
 * Every one of these is connected on our side. The customer never sees a key
 * field, never opens an account with a provider, and never picks a model:
 * the engine routes each job to whichever one is right for it.
 */
type Mark = { name: string; color: string; job: "image" | "video" | "copy"; glyph: React.ReactNode };

const g = (children: React.ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {children}
  </svg>
);

const MODELS: Mark[] = [
  {
    name: "ChatGPT",
    color: "#10A37F",
    job: "copy",
    glyph: g(
      <path
        d="M10 2.6 16.4 6.3v7.4L10 17.4 3.6 13.7V6.3L10 2.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Gemini",
    color: "#8AB4F8",
    job: "image",
    glyph: g(
      <path
        d="M10 2c0 4.4 3.6 8 8 8-4.4 0-8 3.6-8 8 0-4.4-3.6-8-8-8 4.4 0 8-3.6 8-8Z"
        fill="currentColor"
      />
    ),
  },
  {
    name: "Claude",
    color: "#D97757",
    job: "copy",
    glyph: g(
      <path
        d="M10 3v14M4 6.2l12 7.6M16 6.2 4 13.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    ),
  },
  {
    name: "Higgsfield",
    color: "#6D4DF6",
    job: "video",
    glyph: g(
      <>
        <rect x="3" y="3" width="5.5" height="5.5" rx="1.4" fill="currentColor" />
        <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.4" fill="currentColor" opacity="0.5" />
        <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.4" fill="currentColor" opacity="0.5" />
        <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.4" fill="currentColor" />
      </>
    ),
  },
  {
    name: "Veo",
    color: "#60A5FA",
    job: "video",
    glyph: g(
      <path
        d="M4 4.5 10 16l6-11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Kling",
    color: "#34D399",
    job: "video",
    glyph: g(
      <>
        <circle cx="7.5" cy="10" r="4.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="13" cy="10" r="4.6" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      </>
    ),
  },
  {
    name: "Seedance",
    color: "#38BDF8",
    job: "video",
    glyph: g(
      <>
        <rect x="3.4" y="10" width="2.6" height="7" rx="1.3" fill="currentColor" />
        <rect x="8.7" y="5" width="2.6" height="12" rx="1.3" fill="currentColor" />
        <rect x="14" y="8" width="2.6" height="9" rx="1.3" fill="currentColor" opacity="0.6" />
      </>
    ),
  },
  {
    name: "Hailuo",
    color: "#F472B6",
    job: "video",
    glyph: g(
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 10a3.4 3.4 0 0 1 3.4-3.4A6.6 6.6 0 0 1 10 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    name: "Midjourney",
    color: "#E5E7EB",
    job: "image",
    glyph: g(
      <path
        d="M3 14c2.4-6 5-9 7-9s2.6 2 2.6 4.4c0 2-1 3.4-2.2 3.4-1 0-1.6-.8-1.6-1.7 0-1.4 1.3-2.3 3.2-2.3 2.4 0 4 1.6 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    name: "Flux",
    color: "#C084FC",
    job: "image",
    glyph: g(
      <path d="M10 3 17 16H3L10 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    name: "ElevenLabs",
    color: "#FBBF24",
    job: "video",
    glyph: g(
      <>
        <rect x="5" y="4" width="2.4" height="12" rx="1.2" fill="currentColor" />
        <rect x="12.6" y="4" width="2.4" height="12" rx="1.2" fill="currentColor" opacity="0.6" />
      </>
    ),
  },
  {
    name: "Grok",
    color: "#94A3B8",
    job: "copy",
    glyph: g(
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.6 14.4 14.4 5.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
];

const JOB_COLOR: Record<Mark["job"], string> = {
  image: "#6D4DF6",
  video: "#0284C7",
  copy: "#357A38",
};

export default async function Models() {
  const t = dict(await getLang()).models;
  return (
    <div>
      <SectionHead eyebrow={t.eyebrow} title={t.h1} sub={t.sub} />

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {MODELS.map((m) => (
          <span
            key={m.name}
            className="lift inline-flex items-center gap-2 rounded-xl border border-[#E6E2DC] bg-white px-3 py-2.5 text-[13px] font-medium text-[#3A3548] sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-[14px]"
          >
            <span style={{ color: m.color }}>{m.glyph}</span>
            {m.name}
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: JOB_COLOR[m.job] }}
              title={t.jobs[m.job]}
            />
          </span>
        ))}
      </div>

      {/* what each dot means */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {(["image", "video", "copy"] as const).map((k) => (
          <span key={k} className="inline-flex items-center gap-2 text-[12px] text-[#6E697E]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: JOB_COLOR[k] }}
            />
            {t.jobs[k]}
          </span>
        ))}
      </div>

    </div>
  );
}
