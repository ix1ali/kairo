import { Icon, type IconName } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

const META: { icon: IconName; accent: string; choices: string[] }[] = [
  { icon: "text", accent: "#0E7490", choices: ["Burned in", "Soft subs", "None"] },
  { icon: "megaphone", accent: "#7C5CFF", choices: ["AI voice", "Your voice", "Music only"] },
  { icon: "users", accent: "#4D7C0F", choices: ["Presenter", "Hands only", "Product only"] },
  { icon: "bolt", accent: "#B45309", choices: ["Trending", "Licensed", "Silent"] },
];

export default async function VideoOptions() {
  const t = dict(await getLang()).video;

  return (
    <div>
      <SectionHead eyebrow={t.eyebrow} title={t.h1} sub={t.sub} className="mb-6 sm:mb-7" />
      <div className="mb-9 text-center sm:mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#4D7C0F]/30 bg-[#4D7C0F]/[0.08] px-3.5 py-1.5 text-[12px] font-medium text-[#4D7C0F]">
          <Icon name="checkCircle" size={13} />
          {t.asked}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.options.map((o, i) => {
          const m = META[i];
          return (
            <div
              key={o.label}
              className="lift group rounded-2xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025] p-5 transition-colors hover:border-[#C9C9D8]"
            >
              <span
                className="mb-4 grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${m.accent}1F`, color: m.accent }}
              >
                <Icon name={m.icon} size={19} />
              </span>
              <p className="text-[15px] font-semibold text-[#0B0B12]">{o.label}</p>
              <p className="mt-1.5 min-h-[52px] text-[12.5px] leading-relaxed text-[#63637A]">{o.note}</p>

              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#E7E7EF] pt-3.5">
                {m.choices.map((c, ci) => (
                  <span
                    key={c}
                    className="rounded-lg border px-2 py-1 text-[10.5px] font-medium"
                    style={
                      ci === 0
                        ? { borderColor: `${m.accent}55`, background: `${m.accent}18`, color: m.accent }
                        : { borderColor: "#E7E7EF", color: "#6E6E85" }
                    }
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
