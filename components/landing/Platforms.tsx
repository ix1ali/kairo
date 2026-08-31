import { PLATFORM_COLOR, PLATFORM_ICONS } from "@/components/icons/Social";
import { Icon, type IconName } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * What we make content for.
 *
 * Sizes used to sit under each name, which answered a question nobody was
 * asking at this point on the page. The list is the message: these are the
 * places your month lands.
 */

const SOCIAL = [
  "instagram",
  "tiktok",
  "snapchat",
  "whatsapp",
  "youtube",
  "facebook",
  "x",
  "linkedin",
  "google",
];

/** Destinations that are not a social feed and have no brand mark of their own. */
const OTHER: { key: string; icon: IconName; color: string }[] = [
  { key: "email", icon: "send", color: "#A78BFA" },
  { key: "banners", icon: "grid", color: "#22D3EE" },
];

export default async function Platforms() {
  const t = dict(await getLang()).platforms;

  return (
    <div>
      <SectionHead eyebrow={t.eyebrow} title={t.h1} />

      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {SOCIAL.map((key) => {
          const Cmp = PLATFORM_ICONS[key];
          const color = PLATFORM_COLOR[key];
          return (
            <div
              key={key}
              className="flex w-[calc(50%-5px)] items-center gap-3 rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-3.5 transition-colors duration-300 hover:border-[#3A3355] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]"
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                style={{ background: `${color}1A`, color }}
              >
                <Cmp size={18} />
              </span>
              <p className="text-[13.5px] font-semibold leading-tight text-white">
                {t.names[key as keyof typeof t.names]}
              </p>
            </div>
          );
        })}

        {OTHER.map((o) => (
          <div
            key={o.key}
            className="flex w-[calc(50%-5px)] items-center gap-3 rounded-2xl border border-[#2A2438] bg-[#7C5CFF]/[0.06] p-3.5 transition-colors duration-300 hover:border-[#3A3355] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
              style={{ background: `${o.color}1A`, color: o.color }}
            >
              <Icon name={o.icon} size={18} />
            </span>
            <p className="text-[13.5px] font-semibold leading-tight text-white">
              {t.names[o.key as keyof typeof t.names]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
