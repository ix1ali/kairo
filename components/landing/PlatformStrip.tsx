import { PLATFORM_COLOR, PLATFORM_ICONS } from "@/components/icons/Social";
import { Icon, type IconName } from "@/components/icons/Ui";

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
  { label: "Restaurants", icon: "heart", color: "#FF8A5B" },
  { label: "Coffee & roastery", icon: "store", color: "#E4A05B" },
  { label: "Products & ecommerce", icon: "grid", color: "#7C5CFF" },
  { label: "Skincare & beauty", icon: "sparkle", color: "#FF6B8A" },
  { label: "Gyms & studios", icon: "bolt", color: "#C8F751" },
  { label: "Fashion & apparel", icon: "tag", color: "#22D3EE" },
  { label: "Bakeries & cafés", icon: "flag", color: "#FFB443" },
  { label: "Jewellery", icon: "star", color: "#F2C14E" },
  { label: "Salons & spas", icon: "palette", color: "#D9A7FF" },
  { label: "Clinics & dental", icon: "shield", color: "#5EEAD4" },
  { label: "SaaS & apps", icon: "layers", color: "#8B9DFF" },
  { label: "Agencies", icon: "megaphone", color: "#A78BFA" },
  { label: "Real estate", icon: "globe", color: "#7DD3FC" },
  { label: "Home & interior", icon: "image", color: "#E8B98A" },
  { label: "Pet brands", icon: "users", color: "#FDBA74" },
  { label: "Travel & hotels", icon: "send", color: "#67E8F9" },
  { label: "Courses & coaching", icon: "brain", color: "#C4B5FD" },
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
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13.5px] font-medium text-[#C4C4D4] transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
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

export default function PlatformStrip() {
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
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4E4E60]">
        Every platform. Every kind of business.
      </p>
      <div className="space-y-3">
        <Row items={platformPills} />
        <Row items={industryPills} reverse />
      </div>
    </div>
  );
}
