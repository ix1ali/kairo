import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * Abstract marks, not trademark reproductions — each provider is identified by
 * its name. `wired` marks the ones this codebase actually talks to today; the
 * rest are reachable through the Higgsfield broker.
 */
type Mark = { name: string; color: string; glyph: React.ReactNode; wired?: boolean };

const g = (children: React.ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {children}
  </svg>
);

const MODELS: Mark[] = [
  {
    name: "OpenAI",
    color: "#10A37F",
    wired: true,
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
    wired: true,
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
    wired: true,
    glyph: g(
      <>
        <path d="M10 3v14M4 6.2l12 7.6M16 6.2 4 13.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Higgsfield",
    color: "#A78BFA",
    wired: true,
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
    glyph: g(<path d="M4 4.5 10 16l6-11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />),
  },
  {
    name: "Kling",
    color: "#34D399",
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
    glyph: g(
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 10a3.4 3.4 0 0 1 3.4-3.4A6.6 6.6 0 0 1 10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Wan",
    color: "#C084FC",
    glyph: g(<path d="M10 3 17 16H3L10 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />),
  },
  {
    name: "Grok",
    color: "#E5E7EB",
    glyph: g(
      <>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.6 14.4 14.4 5.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
];

export default async function Models() {
  const t = dict(await getLang()).models;

  return (
    <div className="text-center">
      <p className="eyebrow">{t.eyebrow}</p>
      <h2 className="display mx-auto mt-4 max-w-2xl text-3xl sm:text-[2.5rem]">{t.h1}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#8A8A9E]">{t.sub}</p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
        {MODELS.map((m) => (
          <span
            key={m.name}
            className="lift inline-flex items-center gap-2.5 rounded-2xl border border-[#1E1E28] bg-white/[0.025] px-4 py-3 text-[14px] font-medium text-[#C4C4D4]"
          >
            <span style={{ color: m.color }}>{m.glyph}</span>
            {m.name}
            {m.wired && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8F751]" title={t.connected} />
            )}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-xl text-[12.5px] leading-relaxed text-[#5B5B70]">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#C8F751] align-middle" />
        {t.legend}
      </p>
    </div>
  );
}
