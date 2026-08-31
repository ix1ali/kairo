import { Icon, type IconName } from "@/components/icons/Ui";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/**
 * One line of industries under the hero.
 *
 * Previously two rows, the second of which was social platforms — those now
 * have their own section, because "who this is for" and "where it gets posted"
 * are two different questions and stacking them answered neither.
 *
 * The pills used eighteen different accent colours, which read as noise. They
 * now alternate between the two brand colours only.
 */

const INDUSTRIES: { label: string; icon: IconName }[] = [
  { label: "Restaurants", icon: "heart" },
  { label: "Coffee & roastery", icon: "store" },
  { label: "Ecommerce", icon: "grid" },
  { label: "Skincare & beauty", icon: "sparkle" },
  { label: "Gyms & studios", icon: "bolt" },
  { label: "Fashion", icon: "tag" },
  { label: "Jewellery & watches", icon: "star" },
  { label: "Perfume & oud", icon: "palette" },
  { label: "Salons & spas", icon: "users" },
  { label: "Clinics & dental", icon: "shield" },
  { label: "Real estate", icon: "globe" },
  { label: "Automotive", icon: "target" },
  { label: "Travel & hotels", icon: "send" },
  { label: "Courses & coaching", icon: "brain" },
  { label: "Pet brands", icon: "image" },
  { label: "Agencies", icon: "megaphone" },
];

const TONES = ["#7C5CFF", "#22D3EE"];

export default async function PlatformStrip() {
  const t = dict(await getLang()).hero;

  const pills = INDUSTRIES.map((b, i) => {
    const color = TONES[i % TONES.length];
    return (
      <span
        key={b.label}
        className="inline-flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13.5px] font-medium text-[#C4C4D4] transition-colors duration-300 hover:text-white"
        style={{
          borderColor: `${color}33`,
          background: `linear-gradient(180deg, ${color}18, ${color}08)`,
        }}
      >
        <span style={{ color }}>
          <Icon name={b.icon} size={16} />
        </span>
        {b.label}
      </span>
    );
  });

  return (
    <div className="space-y-5">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7E7E93]">
        {t.ticker}
      </p>
      <div className="marquee-mask marquee-hover overflow-hidden">
        <div className="marquee-track flex w-max gap-3 animate-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
              {pills}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
