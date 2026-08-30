import type { Metadata } from "next";
import ThemePreview from "@/components/mockups/ThemePreview";
import { MOCK_THEMES, gradientCss, type MockTheme } from "@/lib/mockThemes";

/**
 * Internal showroom for picking a direction. Not linked from the site and not
 * indexed — it exists so the whole set can be judged in one scroll rather than
 * one at a time.
 */
export const metadata: Metadata = {
  title: { absolute: "Theme mockups · Koala" },
  robots: { index: false, follow: false },
};

/** The direction that actually shipped. */
const LIVE = "paper";

function Swatches({ t }: { t: MockTheme }) {
  const chips = [
    { c: t.bg, label: "bg" },
    { c: t.surface, label: "surface" },
    { c: t.text, label: "text" },
    { c: t.accent, label: "accent" },
    { c: t.good, label: "good" },
    { c: t.warm, label: "warm" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="h-5 w-12 rounded-md ring-1 ring-white/15"
        style={{ background: gradientCss(t) }}
        title={t.grad.join(" → ")}
      />
      {chips.map((c) => (
        <span
          key={c.label}
          className="h-5 w-5 rounded-md ring-1 ring-white/15"
          style={{ background: c.c }}
          title={`${c.label} ${c.c}`}
        />
      ))}
    </div>
  );
}

function Group({ title, blurb, themes }: { title: string; blurb: string; themes: MockTheme[] }) {
  return (
    <section className="mt-14 first:mt-0">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
        <p className="text-[13px] text-[#8A8A9E]">{blurb}</p>
      </div>

      <div className="grid gap-7 xl:grid-cols-2">
        {themes.map((t) => (
          <div key={t.id} id={t.id} className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-white">
                  {t.name}
                  <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8A8A9E]">
                    {t.id}
                  </span>
                  {t.id === LIVE && (
                    <span className="rounded-md bg-[#C8F751]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C8F751]">
                      In use
                    </span>
                  )}
                </h3>
                <p className="mt-0.5 max-w-[52ch] text-[12.5px] leading-relaxed text-[#8A8A9E]">
                  {t.note}
                </p>
              </div>
              <Swatches t={t} />
            </div>
            <ThemePreview t={t} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MockupsPage() {
  const dark = MOCK_THEMES.filter((t) => t.mood === "dark");
  const light = MOCK_THEMES.filter((t) => t.mood === "light");

  return (
    <main className="min-h-screen bg-[#141419] px-4 py-10 sm:px-8 lg:px-12">
      <header className="mb-10 border-b border-white/10 pb-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8A8A9E]">
          Internal · pick one
        </p>
        <h1 className="mt-2.5 text-[2rem] font-extrabold tracking-tight text-white sm:text-[2.5rem]">
          Eight directions.
        </h1>
        <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-[#9B9BAE]">
          Each is the same slice of the real site — nav, hero, gradient headline, filled button,
          creative thumbnails, status chips and a pricing card — drawn entirely from that theme.
          The chips matter: a palette can look fine as swatches and fall apart the moment it has to
          carry small muted text and a &ldquo;Posted&rdquo; tick.
        </p>

        <nav className="mt-5 flex flex-wrap gap-2">
          {MOCK_THEMES.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-[#C4C4D4] transition-colors hover:border-white/25 hover:text-white"
            >
              <span
                className="h-3 w-3 rounded-full ring-1 ring-white/20"
                style={{ background: gradientCss(t) }}
              />
              {t.name}
              <span className="text-[10px] uppercase tracking-wider text-[#6C6C80]">{t.mood}</span>
            </a>
          ))}
        </nav>
      </header>

      <Group
        title="Dark"
        blurb="Four takes on the current direction."
        themes={dark}
      />
      <Group
        title="Light"
        blurb="Same product, inverted. Reads calmer and more premium in print-like layouts."
        themes={light}
      />

      <footer className="mt-16 border-t border-white/10 pt-6 text-[12.5px] text-[#6C6C80]">
        Paper is the one that shipped — its tokens now drive the whole site and dashboard. The
        rest are kept here so the decision can be revisited without rebuilding them.
      </footer>
    </main>
  );
}
