import { PLATFORM_COLOR, PLATFORM_ICONS } from "@/components/icons/Social";

const ORDER = ["instagram", "tiktok", "facebook", "linkedin", "x", "youtube", "pinterest", "threads"];

export default function PlatformStrip({ label = "Sized and written for" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4E4E60]">{label}</p>
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {ORDER.map((p) => {
          const Cmp = PLATFORM_ICONS[p];
          return (
            <span
              key={p}
              title={p}
              className="group grid h-12 w-12 place-items-center rounded-2xl border border-[#1E1E28] bg-white/[0.025] text-[#6C6C80] transition-all duration-300 hover:-translate-y-1 hover:border-[#33333F] hover:bg-white/[0.06]"
              style={{ ["--pc" as string]: PLATFORM_COLOR[p] }}
            >
              <span className="transition-colors duration-300 group-hover:text-[var(--pc)]">
                <Cmp size={21} />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
