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
        stroke={dim ? "#6E697E" : "#6D4DF6"}
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
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
      {PACKAGES.map((pkg) => {
        const featured = pkg.highlight;
        return (
          <div
            key={pkg.id}
            className={`relative flex flex-col rounded-3xl p-5 transition-transform duration-300 sm:p-7 ${
              featured
                ? "border border-[#6D4DF6]/45 bg-gradient-to-b from-[#F1EDFC] to-[#FFFFFF] shadow-[0_30px_90px_-30px_rgba(124,92,255,0.55)] lg:-translate-y-3"
                : "border border-[#E6E2DC] bg-white"
            }`}
          >
            {featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#6D4DF6] to-[#0284C7] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                {t.popular}
              </span>
            )}

            <h3 className="display text-2xl">{pkg.name}</h3>
            <p className="mt-1.5 min-h-[42px] text-sm leading-relaxed text-[#615D70]">{pkg.tagline}</p>

            <div className="mt-5 flex items-baseline gap-1 sm:mt-6">
              <span className="display text-[2.75rem] sm:text-5xl">${pkg.price}</span>
              <span className="text-sm text-[#6E697E]">{t.month}</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-[#E6E2DC] bg-[#F3F1EE] p-3 text-center">
              <div>
                <p className="display text-lg">{pkg.totalPosts}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#6E697E]">{t.posts}</p>
              </div>
              <div className="border-x border-[#EDEAE4]">
                <p className="display text-lg text-[#0369A1]">{pkg.videosPerMonth}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#6E697E]">{t.videos}</p>
              </div>
              <div>
                <p className="display text-lg">{pkg.credits}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#6E697E]">{t.credits}</p>
              </div>
            </div>

            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-[#6E697E]">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="text-[#0369A1]">
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
            <p className="mt-2 text-center text-[11px] text-[#6E697E]">
              {t.billed}
            </p>

            <ul className="mt-6 space-y-2.5 border-t border-[#EDEAE4] pt-6">
              {pkg.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed text-[#615D70]">
                  <Check dim={f.endsWith("plus:")} />
                  <span className={f.endsWith("plus:") ? "font-semibold text-[#6E697E]" : ""}>{f}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[11px] leading-relaxed text-[#6E697E]">
              <span className="font-semibold text-[#6E697E]">{t.bestFor}</span> {pkg.bestFor}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function CreditsExplainer() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="panel p-7">
        <h3 className="display text-2xl">Credits are for changing your mind</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#615D70]">
          Every plan arrives complete — you never need credits to receive your 30 days. Credits are
          what you spend when you want a post rebuilt your way: a different angle, a sharper caption,
          a whole new visual. Describe the change in a prompt and Koala rebuilds that post.
        </p>

        <div className="mt-6 divide-y divide-[#EDEAE4] overflow-hidden rounded-xl border border-[#E6E2DC]">
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
                <p className="text-sm font-medium text-[#141220]">{label}</p>
                <p className="text-[11px] text-[#6E697E]">{note}</p>
              </div>
              <span className="chip shrink-0">{String(cost)} cr</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-7">
        <h3 className="display text-2xl">Top up any time</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#615D70]">
          Credits roll over while your plan is active. Buy more only if you actually use them.
        </p>
        <div className="mt-6 space-y-2.5">
          {CREDIT_PACKS.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${
                p.popular ? "border-[#6D4DF6]/45 bg-[#6D4DF6]/8" : "border-[#E6E2DC] bg-white"
              }`}
            >
              <div>
                <p className="text-base font-semibold text-[#141220]">
                  {p.credits.toLocaleString()} credits
                </p>
                {p.save && <p className="text-[11px] font-medium text-[#357A38]">{p.save}</p>}
              </div>
              <span className="display text-xl">${p.price}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-[#6E697E]">
          Roughly: 100 credits redesigns 25 visuals, or rewrites 100 captions, or rebuilds 16 full days.
        </p>
      </div>
    </div>
  );
}
