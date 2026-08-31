import Koala from "@/components/Koala";
import { Icon } from "@/components/icons/Ui";
import { gradientCss, type MockTheme } from "@/lib/mockThemes";

/**
 * A miniature of the real site drawn entirely from one theme's tokens.
 *
 * Deliberately shows the awkward parts as well as the pretty ones — a nav, a
 * gradient headline, a filled button, a bordered input, cards on a raised
 * band, real creative thumbnails and a pricing card. A palette can look fine
 * as five swatches and fall apart the moment it has to carry small muted text
 * on a card border, so the swatch view alone would not be an honest test.
 */

const SHOTS = ["c01.webp", "c02.webp", "c03.webp", "c04.webp"];

export default function ThemePreview({ t }: { t: MockTheme }) {
  const grad = gradientCss(t);
  const isLight = t.mood === "light";

  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-2xl"
      style={{ background: t.bg, borderColor: t.border, color: t.text }}
    >
      {/* ---------- nav ---------- */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: t.border, background: t.bg }}
      >
        <div className="flex items-center gap-2">
          <span
            className="grid h-6 w-6 place-items-center rounded-lg text-[11px] font-black"
            style={{ background: grad, color: t.onGrad }}
          >
            K
          </span>
          <span className="text-[13px] font-bold tracking-tight">Koala</span>
        </div>
        <div className="hidden items-center gap-3 text-[11px] sm:flex" style={{ color: t.muted }}>
          <span>How it works</span>
          <span>Pricing</span>
          <span>FAQ</span>
        </div>
        <span
          className="rounded-lg px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: grad, color: t.onGrad }}
        >
          Get started
        </span>
      </div>

      {/* ---------- hero ---------- */}
      <div className="relative overflow-hidden px-5 pb-7 pt-7">
        <div
          className="pointer-events-none absolute left-1/2 top-[-8rem] h-64 w-[34rem] -translate-x-1/2 rounded-full blur-[80px]"
          style={{ background: t.glow }}
        />
        <div className="relative flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium"
              style={{
                borderColor: t.border,
                background: t.surface,
                color: t.accent,
              }}
            >
              <Icon name="sparkle" size={10} filled />
              Meet Kai, your content koala
            </span>

            <h3 className="mt-3 text-[26px] font-extrabold leading-[1.05] tracking-tight">
              A whole month
              <br />
              of content.{" "}
              <span
                style={{
                  background: grad,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Done in a minute.
              </span>
            </h3>

            <p className="mt-2.5 max-w-[38ch] text-[11.5px] leading-relaxed" style={{ color: t.muted }}>
              Paste your store link. Kai learns your brand, writes a real marketing plan, and hands
              you 30 days of posts.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex min-w-[150px] items-center gap-2 rounded-xl border px-3 py-2 text-[11px]"
                style={{ borderColor: t.border, background: t.surface, color: t.faint }}
              >
                <Icon name="link" size={11} />
                yourstore.com
              </span>
              <span
                className="rounded-xl px-3.5 py-2 text-[11.5px] font-bold"
                style={{ background: grad, color: t.onGrad }}
              >
                Build my content plan
              </span>
            </div>
          </div>

          <div className="relative hidden shrink-0 sm:block">
            <div
              className="pointer-events-none absolute inset-0 grid place-items-center"
              aria-hidden
            >
              <div className="h-24 w-24 rounded-full blur-2xl" style={{ background: t.glow }} />
            </div>
            <Koala sizeClass="h-[104px] w-[104px]" interactive={false} float={false} />
          </div>
        </div>
      </div>

      {/* ---------- raised band: creatives ---------- */}
      <div className="border-y px-5 py-6" style={{ borderColor: t.border, background: t.band }}>
        <p
          className="text-[9.5px] font-bold uppercase tracking-[0.18em]"
          style={{ color: t.accent }}
        >
          The output
        </p>
        <p className="mt-1.5 text-[17px] font-extrabold tracking-tight">Nobody was filmed.</p>

        <div className="mt-3.5 grid grid-cols-4 gap-2">
          {SHOTS.map((s) => (
            <div
              key={s}
              className="relative aspect-[4/5] overflow-hidden rounded-lg border"
              style={{ borderColor: t.border }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/creatives/${s}`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- cards + pricing ---------- */}
      <div className="grid gap-3 px-5 py-6 sm:grid-cols-[1fr_150px]">
        <div className="grid gap-2.5">
          {[
            { icon: "image" as const, title: "A finished image", body: "Sized for the platform, built from your palette." },
            { icon: "target" as const, title: "Why it exists", body: "Every day has a job: get seen, build trust, or sell." },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-2.5 rounded-xl border p-3"
              style={{ borderColor: t.border, background: t.surface }}
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                style={{ background: `${t.accent}1F`, color: t.accent }}
              >
                <Icon name={f.icon} size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold">{f.title}</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed" style={{ color: t.muted }}>
                  {f.body}
                </p>
              </div>
            </div>
          ))}

          {/* status chips — where a palette usually falls over */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: `${t.good}22`, color: t.good }}
            >
              <Icon name="check" size={9} strokeWidth={3} />
              Posted
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: `${t.warm}22`, color: t.warm }}
            >
              <Icon name="tag" size={9} />
              Offer day
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium"
              style={{ borderColor: t.border, color: t.faint }}
            >
              Day 12 · 18:30
            </span>
          </div>
        </div>

        <div
          className="rounded-xl border p-3.5"
          style={{
            borderColor: isLight ? t.border : `${t.accent}55`,
            background: isLight ? t.surface : `${t.accent}0D`,
          }}
        >
          <p className="text-[11.5px] font-bold">Growth</p>
          <p className="mt-1 text-[26px] font-extrabold leading-none tracking-tight">$129</p>
          <p className="mt-0.5 text-[10px]" style={{ color: t.faint }}>
            per month
          </p>
          <div className="mt-3 space-y-1.5">
            {["90 posts", "12 videos", "400 credits"].map((f) => (
              <p key={f} className="flex items-center gap-1.5 text-[10.5px]" style={{ color: t.muted }}>
                <span style={{ color: t.accent }}>
                  <Icon name="check" size={9} strokeWidth={3} />
                </span>
                {f}
              </p>
            ))}
          </div>
          <span
            className="mt-3 block rounded-lg py-1.5 text-center text-[10.5px] font-bold"
            style={{ background: grad, color: t.onGrad }}
          >
            Choose Growth
          </span>
        </div>
      </div>
    </div>
  );
}
