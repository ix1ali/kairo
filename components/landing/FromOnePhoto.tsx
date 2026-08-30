import { Icon } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * The single clearest proof the product works: one flat pack shot on a white
 * background, and the four finished posts built from it.
 *
 * Everything here is a real asset — the source photo is exactly what a brand
 * would have on their product page, and the four outputs each do a different
 * job in the calendar rather than being four crops of the same idea.
 */

const OUTPUTS = ["c01.webp", "c02.webp", "c03.webp", "c04.webp"];

export default async function FromOnePhoto() {
  const t = dict(await getLang()).source;

  return (
    <div>
      <SectionHead eyebrow={t.eyebrow} title={t.h1} sub={t.sub} />

      <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,290px)_auto_1fr] lg:gap-9">
        {/* ---------- the input ---------- */}
        <div className="mx-auto w-full max-w-[240px] lg:max-w-none">
          <div className="relative overflow-hidden rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-3 shadow-[0_10px_30px_-20px_rgba(20,18,32,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/creatives/source-lipglaze.webp"
              alt={t.beforeAlt}
              className="aspect-[4/5] w-full rounded-lg object-contain"
            />
            <span className="absolute start-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-[#1E1E28] bg-[#0C0C13]/90 px-2.5 py-1 text-[10.5px] font-semibold text-[#7C7C90] backdrop-blur">
              <Icon name="image" size={11} />
              {t.beforeTag}
            </span>
          </div>
          <p className="mt-3 text-center text-[12.5px] leading-relaxed text-[#7C7C90] lg:text-start">
            {t.beforeNote}
          </p>
        </div>

        {/* ---------- the arrow ---------- */}
        <div className="flex justify-center lg:block">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#2A2438] bg-white/[0.02] text-[#7C5CFF] shadow-[0_6px_18px_-10px_rgba(109,77,246,0.6)]">
            <Icon name="arrowDown" size={18} className="lg:hidden" />
            <Icon name="arrowRight" size={18} className="hidden flip-rtl lg:block" />
          </span>
        </div>

        {/* ---------- the output ---------- */}
        <div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {OUTPUTS.map((file, i) => (
              <figure key={file} className="min-w-0">
                <div className="overflow-hidden rounded-xl border border-[#1E1E28] bg-white/10 sm:rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/creatives/${file}`}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-[10px] font-bold tabular-nums text-[#75758C]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11.5px] font-semibold leading-tight text-[#C4C4D4]">
                    {t.jobs[i]}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#7C7C90]">
            <span className="mt-0.5 shrink-0 text-[#C8F751]">
              <Icon name="checkCircle" size={14} />
            </span>
            {t.afterNote}
          </p>
        </div>
      </div>
    </div>
  );
}
