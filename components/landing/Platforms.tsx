import { PLATFORM_COLOR, PLATFORM_ICONS } from "@/components/icons/Social";
import { Icon, type IconName } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * Where the content goes.
 *
 * Uniform tiles rather than pills. The labels are different lengths, so pills
 * produced a ragged row that never lined up, and one of them wrapped onto two
 * lines and made its card taller than the rest. A fixed tile with the mark
 * stacked over a one-word label keeps every row even, and the wrap is centred
 * so an odd count never strands the last one on its own.
 *
 * Each tile carries its platform's own colour, but only as a tint behind the
 * mark, so eleven brand colours do not shout over each other.
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

const TILE =
  "group flex w-[92px] flex-col items-center gap-2.5 rounded-2xl border px-2 py-4 text-center transition-all duration-300 hover:-translate-y-1 sm:w-[112px] sm:py-5";

function Tile({
  color,
  label,
  featured,
  children,
}: {
  color: string;
  label: string;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${TILE} ${
        featured
          ? "border-[#2A2438] bg-[#7C5CFF]/[0.07] hover:bg-[#7C5CFF]/[0.12]"
          : "border-[#1E1E28] bg-white/[0.02] hover:bg-white/[0.045]"
      }`}
    >
      <span
        className="grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}1A`, color }}
      >
        {children}
      </span>
      <p className="text-[12px] font-semibold leading-none text-[#C4C4D4] transition-colors group-hover:text-white sm:text-[12.5px]">
        {label}
      </p>
    </div>
  );
}

export default async function Platforms() {
  const t = dict(await getLang()).platforms;

  return (
    <div>
      <SectionHead eyebrow={t.eyebrow} title={t.h1} />

      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {SOCIAL.map((key) => {
          const Cmp = PLATFORM_ICONS[key];
          return (
            <Tile
              key={key}
              color={PLATFORM_COLOR[key]}
              label={t.names[key as keyof typeof t.names]}
            >
              <Cmp size={20} />
            </Tile>
          );
        })}

        {OTHER.map((o) => (
          <Tile
            key={o.key}
            color={o.color}
            label={t.names[o.key as keyof typeof t.names]}
            featured
          >
            <Icon name={o.icon} size={20} />
          </Tile>
        ))}
      </div>
    </div>
  );
}
