import { PLATFORM_COLOR, PLATFORM_ICONS } from "@/components/icons/Social";
import { Icon, type IconName } from "@/components/icons/Ui";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

const PLATFORMS: { key: string; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "youtube", label: "YouTube Shorts" },
  { key: "pinterest", label: "Pinterest" },
  { key: "threads", label: "Threads" },
];

const INDUSTRIES: { label: string; icon: IconName; color: string }[] = [
  { label: "Restaurants", icon: "heart", color: "#EA580C" },
  { label: "Coffee & roastery", icon: "store", color: "#E4A05B" },
  { label: "Products & ecommerce", icon: "grid", color: "#6D4DF6" },
  { label: "Skincare & beauty", icon: "sparkle", color: "#DB2777" },
  { label: "Gyms & studios", icon: "bolt", color: "#357A38" },
  { label: "Fashion & apparel", icon: "tag", color: "#0284C7" },
  { label: "Bakeries & cafés", icon: "flag", color: "#A65209" },
  { label: "Jewellery", icon: "star", color: "#F2C14E" },
  { label: "Salons & spas", icon: "palette", color: "#9333EA" },
  { label: "Clinics & dental", icon: "shield", color: "#0F766E" },
  { label: "SaaS & apps", icon: "layers", color: "#4F46E5" },
  { label: "Agencies", icon: "megaphone", color: "#6D4DF6" },
  { label: "Real estate", icon: "globe", color: "#0369A1" },
  { label: "Home & interior", icon: "image", color: "#B45309" },
  { label: "Pet brands", icon: "users", color: "#C2410C" },
  { label: "Travel & hotels", icon: "send", color: "#0E7490" },
  { label: "Courses & coaching", icon: "brain", color: "#5B3FE0" },
  { label: "Automotive", icon: "target", color: "#94A3B8" },
];

function Pill({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13.5px] font-medium text-[#3A3548] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#141220]"
      style={{
        ["--pc" as string]: color,
        borderColor: `${color}38`,
        background: `linear-gradient(180deg, ${color}1F, ${color}0A)`,
        boxShadow: `0 0 18px -8px ${color}80`,
      }}
    >
      {children}
    </span>
  );
}

/** One row, duplicated so the translate loops seamlessly. */
function Row({ items, reverse = false }: { items: React.ReactNode[]; reverse?: boolean }) {
  return (
    <div className="marquee-mask marquee-hover overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-3 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
            {items}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PlatformStrip() {
  const t = dict(await getLang()).hero;
  const platformPills = PLATFORMS.map((p) => {
    const Cmp = PLATFORM_ICONS[p.key];
    return (
      <Pill key={p.key} color={PLATFORM_COLOR[p.key]}>
        <span className="text-[var(--pc)]">
          <Cmp size={17} />
        </span>
        {p.label}
      </Pill>
    );
  });

  const industryPills = INDUSTRIES.map((b) => (
    <Pill key={b.label} color={b.color}>
      <span className="text-[var(--pc)]">
        <Icon name={b.icon} size={16} />
      </span>
      {b.label}
    </Pill>
  ));

  return (
    <div className="space-y-5">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E697E]">
        {t.ticker}
      </p>
      <div className="space-y-3">
        <Row items={platformPills} />
        <Row items={industryPills} reverse />
      </div>
    </div>
  );
}
