import { Icon, type IconName } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * The competitor argument, which is the actual reason the output is worth
 * anything: the plan is built against what your rivals are already doing badly.
 *
 * Three steps, short lines, no adjectives doing work that a noun should do.
 */

const ICONS: IconName[] = ["eye", "target", "chart"];

export default async function Rivals() {
  const t = dict(await getLang()).rivals;

  return (
    <div>
      <SectionHead title={t.h1} sub={t.sub} />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        {t.steps.map((s, i) => (
          <div
            key={s.title}
            className="relative overflow-hidden rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-5 sm:p-6"
          >
            <span className="absolute -right-4 -top-3 text-[64px] font-black leading-none text-white/[0.03]">
              {i + 1}
            </span>
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#7C5CFF]/25 to-[#22D3EE]/12 text-[#A78BFA]">
              <Icon name={ICONS[i]} size={19} />
            </span>
            <p className="display text-[17px] sm:text-lg">{s.title}</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#9B9BAE]">{s.body}</p>
          </div>
        ))}
      </div>

      {/* the payoff, stated plainly */}
      <div className="mt-4 rounded-2xl border border-[#2A2438] bg-gradient-to-r from-[#7C5CFF]/10 to-[#22D3EE]/[0.06] p-5 sm:mt-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="display text-[17px] sm:text-xl">{t.payoffTitle}</p>
            <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-[#9B9BAE]">
              {t.payoffBody}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {t.payoffTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#3A3355] bg-[#7C5CFF]/10 px-3 py-1.5 text-[12px] font-medium text-[#C9BEFF]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
