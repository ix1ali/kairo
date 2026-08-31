import Link from "next/link";
import { CREDIT_COSTS, CREDIT_PACKS, PACKAGES } from "@/lib/plans";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

function Check({ dim = false }: { dim?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="8" fill={dim ? "rgba(255,255,255,0.07)" : "rgba(124,92,255,0.18)"} />
      <path
        d="M4.6 8.2l2.2 2.2 4.6-4.6"
        stroke={dim ? "#7E7E93" : "#7C5CFF"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function PricingCards({ ctaPrefix = "/signup" }: { ctaPrefix?: string }) {
  const t = dict(await getLang()).pricing;
  return (
    <div>
      {/* Three full cards do not fit a phone, and cutting them down to fit lost
          the detail people actually decide on. So on mobile the row scrolls:
          each card keeps everything, sits at 78% of the viewport so the next
          one peeks in as a swipe affordance, and snaps into place. From sm up
          it is an ordinary three-column grid. */}
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
        {PACKAGES.map((pkg) => {
          const featured = pkg.highlight;
          return (
            <div
              key={pkg.id}
              className={`relative flex w-[78vw] shrink-0 snap-center flex-col rounded-3xl p-5 transition-transform duration-300 sm:w-auto sm:shrink sm:p-6 lg:p-7 ${
                featured
                  ? "border border-[#7C5CFF]/45 bg-gradient-to-b from-[#171327] to-[#0D0D14] shadow-[0_30px_90px_-30px_rgba(124,92,255,0.45)] lg:-translate-y-3"
                  : "border border-[#1E1E28] bg-white/[0.02]"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {t.popular}
                </span>
              )}

              <h3 className="display text-2xl">{pkg.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#9B9BAE] sm:min-h-[42px]">
                {pkg.tagline}
              </p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="display text-[2.5rem] sm:text-[2.75rem] lg:text-5xl">${pkg.price}</span>
                <span className="text-sm text-[#7E7E93]">{t.month}</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-[#1E1E28] bg-white/[0.05] p-3 text-center">
                <div>
                  <p className="display text-lg">{pkg.totalPosts}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#7E7E93]">{t.posts}</p>
                </div>
                <div className="border-x border-[#16161F]">
                  <p className="display text-lg text-[#7DE7F7]">{pkg.videosPerMonth}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#7E7E93]">{t.videos}</p>
                </div>
                <div>
                  <p className="display text-lg">{pkg.credits}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#7E7E93]">{t.credits}</p>
                </div>
              </div>

              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-[#7E7E93]">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="text-[#7DE7F7]">
                  <path d="M3 1.6 10 6l-7 4.4V1.6Z" />
                </svg>
                {t.videoNote.replace("{n}", String(pkg.videoEveryNDays))}
              </p>

              <Link
                href={`${ctaPrefix}?plan=${pkg.id}`}
                className={`btn mt-5 w-full ${featured ? "btn-primary" : "btn-ghost"}`}
              >
                {t.startWith} {pkg.name}
              </Link>
              <p className="mt-2 text-center text-[11px] text-[#7E7E93]">{t.billed}</p>

              <ul className="mt-6 space-y-2.5 border-t border-[#16161F] pt-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed text-[#9B9BAE]">
                    <Check dim={f.endsWith("plus:")} />
                    <span className={f.endsWith("plus:") ? "font-semibold text-[#7E7E93]" : ""}>{f}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-[11px] leading-relaxed text-[#7E7E93]">
                <span className="font-semibold text-[#7E7E93]">{t.bestFor}</span> {pkg.bestFor}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#7E7E93] sm:hidden">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M10 4l4 4-4 4M6 4L2 8l4 4" />
        </svg>
        {t.swipe}
      </p>
    </div>
  );
}

export function CreditsExplainer() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="panel p-7">
        <h3 className="display text-2xl">Credits are for changing your mind</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#9B9BAE]">
          Every plan arrives complete. You never need credits to receive your 30 days. Credits are
          what you spend when you want a post rebuilt your way: a different angle, a sharper caption,
          a whole new visual. Describe the change in a prompt and Koala rebuilds that post.
        </p>

        <div className="mt-6 divide-y divide-[#16161F] overflow-hidden rounded-xl border border-[#1E1E28]">
          {[
            ["Rewrite caption", CREDIT_COSTS.rewriteCaption, "New copy, same visual"],
            ["New creative angle", CREDIT_COSTS.newAngle, "Different hook and concept"],
            ["Redesign visual", CREDIT_COSTS.redesignVisual, "Regenerate the artwork"],
            ["Regenerate whole day", CREDIT_COSTS.regenerateDay, "Copy and visual, end to end"],
            ["Regenerate a video", CREDIT_COSTS.regenerateVideo, "New script, storyboard, render"],
            ["Regenerate a week", CREDIT_COSTS.regenerateWeek, "Seven days on a new theme"],
          ].map(([label, cost, note]) => (
            <div key={String(label)} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-[11px] text-[#7E7E93]">{note}</p>
              </div>
              <span className="chip shrink-0">{String(cost)} cr</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-7">
        <h3 className="display text-2xl">Top up any time</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#9B9BAE]">
          Credits roll over while your plan is active. Buy more only if you actually use them.
        </p>
        <div className="mt-6 space-y-2.5">
          {CREDIT_PACKS.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${
                p.popular ? "border-[#7C5CFF]/45 bg-[#7C5CFF]/8" : "border-[#1E1E28] bg-white/[0.02]"
              }`}
            >
              <div>
                <p className="text-base font-semibold text-white">
                  {p.credits.toLocaleString()} credits
                </p>
                {p.save && <p className="text-[11px] font-medium text-[#C8F751]">{p.save}</p>}
              </div>
              <span className="display text-xl">${p.price}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-[#7E7E93]">
          Roughly: 100 credits redesigns 25 visuals, or rewrites 100 captions, or rebuilds 16 full days.
        </p>
      </div>
    </div>
  );
}
