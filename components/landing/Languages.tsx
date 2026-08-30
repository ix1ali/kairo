import { Flag } from "@/components/icons/Flag";
import { SectionHead } from "./Section";
import { LOCALES } from "@/lib/languages";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/** A spread across regions rather than the first N alphabetically. */
const FEATURED = [
  "ar-KW", "ar-SA", "ar-AE", "ar-EG", "ar-MA", "ar-LB",
  "en-GB", "en-US", "en-AU", "fr-FR", "es-ES", "es-MX",
  "de-DE", "it-IT", "pt-BR", "nl-NL", "tr-TR", "pl-PL",
  "sv-SE", "el-GR", "ru-RU", "ar-PS", "fa-IR", "hi-IN",
  "id-ID", "th-TH", "ja-JP", "ko-KR", "zh-CN", "vi-VN",
];

export default async function Languages() {
  const t = dict(await getLang()).langs;
  const shown = FEATURED.map((code) => LOCALES.find((l) => l.code === code)).filter(
    (l): l is (typeof LOCALES)[number] => !!l
  );
  const languages = new Set(LOCALES.map((l) => l.language)).size;

  return (
    <div>
      <SectionHead
        eyebrow={t.eyebrow}
        title={
          <>
            {languages} {t.languages}{" "}
            <span className="grad-text-soft">
              {LOCALES.length} {t.dialects}
            </span>
          </>
        }
        sub={t.sub}
      />

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {shown.map((l) => (
          <div
            key={l.code}
            className="flex items-center gap-2.5 rounded-xl border border-[#E6E2DC] bg-white px-3 py-2.5 transition-colors hover:border-[#C9C4BC] hover:bg-[#F3F1EE]"
          >
            <Flag cc={l.cc} size={22} />
            <span className="min-w-0">
              <span className="block truncate text-[12.5px] font-medium text-[#3A3548]">
                {l.country}
              </span>
              <span className="block truncate text-[10.5px] text-[#6E697E]">
                {l.dialect === "Standard" ? l.language : `${l.language} · ${l.dialect}`}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[13px] text-[#6E697E]">
        + {LOCALES.length - shown.length} {t.more}
      </p>
    </div>
  );
}
