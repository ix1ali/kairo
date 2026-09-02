import { Icon, type IconName } from "@/components/icons/Ui";
import { InstagramIcon, TikTokIcon } from "@/components/icons/Social";
import { dict, type Dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/* ---------------- step visuals ---------------- */

function BrowserMock({ t }: { t: Dict["how"] }) {
  return (
    <div className="rounded-2xl border border-[#E7E7EF] bg-[#FFFFFF] p-3 shadow-2xl">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#C2255C]/60" />
        <span className="h-2 w-2 rounded-full bg-[#B45309]/60" />
        <span className="h-2 w-2 rounded-full bg-[#4D7C0F]/60" />
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-[#7C5CFF]/40 bg-[#7C5CFF]/[0.08] px-3 py-2.5">
        <Icon name="link" size={15} className="text-[#5B3FE0]" />
        <span className="text-[13px] text-[#5B3FE0]">yourstore.com</span>
        <span className="ml-auto h-4 w-px animate-pulse bg-[#7C5CFF]" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-square rounded-lg bg-[#0B0B12]/[0.045]" />
        ))}
      </div>
    </div>
  );
}

function BrandDnaMock({ t }: { t: Dict["how"] }) {
  return (
    <div className="rounded-2xl border border-[#E7E7EF] bg-[#FFFFFF] p-4 shadow-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#6E6E85]">{t.mockBrandRead}</p>
      <div className="mb-3 flex gap-1.5">
        {["#E4732B", "#F2C14E", "#E7E7EF", "#FFF8F0"].map((c) => (
          <span key={c} className="h-8 w-8 rounded-lg border border-[#E7E7EF]" style={{ background: c }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[
          ["palette", "Warm & organic"],
          ["megaphone", "Confident"],
          ["users", "Home baristas"],
        ].map(([icon, label]) => (
          <span key={label} className="chip">
            <Icon name={icon as IconName} size={11} />
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 space-y-1.5 border-t border-[#E7E7EF] pt-3">
        {[
          ["Midnight Oak", "#4D7C0F", "hero"],
          ["Sunrise Filter", "#55556B", "core"],
          ["Decaf Ember", "#B45309", "slow"],
        ].map(([n, c, tier]) => (
          <div key={n} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
            <span className="text-[12px] text-[#55556B]">{n}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider" style={{ color: c }}>
              {tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarMock({ t }: { t: Dict["how"] }) {
  const weeks = [0.32, 0.5, 0.85, 0.45];
  return (
    <div className="rounded-2xl border border-[#E7E7EF] bg-[#FFFFFF] p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6E6E85]">{t.mockYourDays}</p>
        <span className="chip">{t.mockPosts}</span>
      </div>
      <div className="space-y-1.5">
        {weeks.map((tint, wi) => (
          <div key={wi} className="flex items-center gap-2">
            <span className="w-5 text-[9px] font-bold text-[#6E6E85]">W{wi + 1}</span>
            <div className="grid flex-1 grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, d) => (
                <span
                  key={d}
                  className="aspect-square rounded"
                  style={{
                    background: `linear-gradient(150deg, rgba(124,92,255,${tint * 0.55}), rgba(34,211,238,${tint * 0.2}))`,
                    border: `1px solid rgba(124,92,255,${0.15 + tint * 0.25})`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApprovedMock({ t }: { t: Dict["how"] }) {
  return (
    <div className="rounded-2xl border border-[#E7E7EF] bg-[#FFFFFF] p-4 shadow-2xl">
      <div className="flex gap-3">
        <div className="relative h-[92px] w-[74px] shrink-0 overflow-hidden rounded-xl border border-[#E7E7EF] bg-gradient-to-br from-[#7C5CFF]/40 to-[#22D3EE]/20">
          <div className="absolute inset-x-2.5 bottom-3 space-y-1">
            <span className="block h-1 w-full rounded-full bg-[#0B0B12]/[0.07]" />
            <span className="block h-1 w-2/3 rounded-full bg-[#E7E7EF]" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5">
            <InstagramIcon size={12} className="text-[#E1306C]" />
            <TikTokIcon size={12} className="text-[#0B0B12]" />
            <span className="text-[10px] text-[#6E6E85]">Day 12 · 18:30</span>
          </div>
          <p className="text-[12px] leading-snug text-[#33334A]">
            Your coffee is not bad. Your grind size is.
          </p>
          <div className="mt-2.5 flex gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#4D7C0F]/15 px-2 py-1 text-[10px] font-semibold text-[#4D7C0F]">
              <Icon name="check" size={10} strokeWidth={3} />
              {t.mockPosted}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#0B0B12]/[0.045] px-2 py-1 text-[10px] text-[#6E6E85]">
              <Icon name="download" size={10} />
              {t.mockSaved}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEP_META: { n: string; icon: IconName }[] = [
  { n: "01", icon: "link" },
  { n: "02", icon: "brain" },
  { n: "03", icon: "calendar" },
  { n: "04", icon: "checkCircle" },
];

export default async function HowItWorks() {
  const t = dict(await getLang()).how;
  const visuals = [<BrowserMock key="a" t={t} />, <BrandDnaMock key="b" t={t} />, <CalendarMock key="c" t={t} />, <ApprovedMock key="d" t={t} />];
  const STEPS = STEP_META.map((m, i) => ({ ...m, title: t.steps[i].title, body: t.steps[i].body, visual: visuals[i] }));

  return (
    <div className="relative">
      {/* connecting line */}
      {/* start-* follows the writing direction, so the line stays with the icons in RTL */}
      <div className="absolute start-[27px] top-4 bottom-16 hidden w-px bg-gradient-to-b from-[#7C5CFF] via-[#7C5CFF]/40 to-[#22D3EE]/50 md:block" />

      <div className="space-y-9 md:space-y-11">
        {STEPS.map((s) => (
          <div key={s.n} className="grid items-center gap-6 md:grid-cols-[56px_1fr_1fr] md:gap-10">
            <div className="hidden md:block">
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-[#DCDCE8] bg-[#FFFFFF] text-[#5B3FE0]">
                <Icon name={s.icon} size={22} />
              </span>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#DCDCE8] bg-[#FFFFFF] text-[#5B3FE0] md:hidden">
                  <Icon name={s.icon} size={18} />
                </span>
                <span className="display text-sm text-[#6E6E85]">{s.n}</span>
              </div>
              <h3 className="display text-2xl sm:text-[1.75rem]">{s.title}</h3>
              <p className="mt-2.5 max-w-sm text-[14.5px] leading-relaxed text-[#55556B]">{s.body}</p>
            </div>

            <div className="max-w-[340px]">{s.visual}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
