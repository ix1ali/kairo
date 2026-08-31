import { useId } from "react";

/**
 * Simplified SVG flags.
 *
 * Emoji flags do not render on Windows, so these are drawn. They are reduced to
 * their band structure and dominant emblem — recognisable at 20px, not
 * heraldically exact. Fine detail (coats of arms, scripts, star counts) is
 * deliberately omitted.
 */

const H: Record<string, string[]> = {
  EG: ["#CE1126", "#FFFFFF", "#000000"],
  IQ: ["#CE1126", "#FFFFFF", "#000000"],
  DE: ["#000000", "#DD0000", "#FFCE00"],
  AT: ["#ED2939", "#FFFFFF", "#ED2939"],
  NL: ["#AE1C28", "#FFFFFF", "#21468B"],
  RU: ["#FFFFFF", "#0039A6", "#D52B1E"],
  IR: ["#239F40", "#FFFFFF", "#DA0000"],
  IN: ["#FF9933", "#FFFFFF", "#138808"],
  KW: ["#007A3D", "#FFFFFF", "#CE1126"],
  OM: ["#FFFFFF", "#DB161B", "#008000"],
  AE: ["#00732F", "#FFFFFF", "#000000"],
  SD: ["#CE1126", "#FFFFFF", "#000000"],
  PL: ["#FFFFFF", "#DC143C"],
  UA: ["#0057B7", "#FFD700"],
  ID: ["#CE1126", "#FFFFFF"],
  AR: ["#000000", "#FFFFFF", "#007A3D", "#CE1126"],
  JO: ["#000000", "#FFFFFF", "#007A3D"],
  ES: ["#AA151B", "#F1BF00", "#AA151B"],
  CO: ["#FCD116", "#003893", "#CE1126"],
  AR2: ["#74ACDF", "#FFFFFF", "#74ACDF"],
  LB: ["#EE161F", "#FFFFFF", "#EE161F"],
  TH: ["#A51931", "#F4F5F8", "#2D2A4A", "#F4F5F8", "#A51931"],
  ZA: ["#DE3831", "#FFFFFF", "#002395"],
  BH: ["#FFFFFF", "#CE1126"],
  PS: ["#000000", "#FFFFFF", "#007A3D"],
};

const V: Record<string, string[]> = {
  FR: ["#002654", "#FFFFFF", "#ED2939"],
  IT: ["#008C45", "#F4F5F0", "#CD212A"],
  IE: ["#169B62", "#FFFFFF", "#FF883E"],
  RO: ["#002B7F", "#FCD116", "#CE1126"],
  MX: ["#006847", "#FFFFFF", "#CE1126"],
  CA: ["#D80621", "#FFFFFF", "#D80621"],
  PE: ["#D91023", "#FFFFFF", "#D91023"],
  DZ: ["#006233", "#FFFFFF"],
  PT: ["#046A38", "#DA291C"],
  NG: ["#008751", "#FFFFFF", "#008751"],
};

/** Flags that are a plain field plus one emblem. */
const FIELD: Record<string, string> = {
  SA: "#165D31",
  QA: "#8A1538",
  MA: "#C1272D",
  TN: "#E70013",
  TR: "#E30A17",
  CH: "#D52B1E",
  JP: "#FFFFFF",
  KR: "#FFFFFF",
  CN: "#DE2910",
  VN: "#DA251D",
  PK: "#01411C",
  BR: "#009739",
  SE: "#006AA7",
  GR: "#0D5EAF",
  GB: "#012169",
  US: "#B22234",
  AU: "#00247D",
  TW: "#FE0000",
  MY: "#CC0001",
  CAQ: "#095797",
  DK: "#C60C30",
  NO: "#BA0C2F",
  FI: "#FFFFFF",
};

function bands(colors: string[], vertical: boolean) {
  const n = colors.length;
  return colors.map((c, i) =>
    vertical ? (
      <rect key={i} x={(24 / n) * i} y="0" width={24 / n} height="16" fill={c} />
    ) : (
      <rect key={i} x="0" y={(16 / n) * i} width="24" height={16 / n} fill={c} />
    )
  );
}

function nordicCross(cross: string) {
  return (
    <>
      <rect x="0" y="6.4" width="24" height="3.2" fill={cross} />
      <rect x="7" y="0" width="3.2" height="16" fill={cross} />
    </>
  );
}

function emblem(cc: string) {
  switch (cc) {
    case "SA":
      return (
        <>
          {/* the shahada, suggested rather than spelled: at 20px anything
              more literal turns to mud, so this is a calligraphic rhythm */}
          <path
            d="M4.6 7.2c.6-1.1 1.3-1.1 1.9 0M7 7.2c.5-1.5 1.2-1.5 1.7 0M9.4 7.2c.6-1 1.3-1 1.9 0M11.9 7.2c.5-1.6 1.2-1.6 1.7 0M14.3 7.2c.6-1.1 1.3-1.1 1.9 0M16.8 7.2c.5-1.3 1.2-1.3 1.7 0"
            stroke="#FFFFFF"
            strokeWidth="0.95"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M5.4 8.8h13.2" stroke="#FFFFFF" strokeWidth="0.75" strokeLinecap="round" />
          {/* the sword, point toward the hoist, hilt at the fly */}
          <path d="M4.4 11.5l2.2-.75v1.5z" fill="#FFFFFF" />
          <path d="M6.4 11.5h10.4" stroke="#FFFFFF" strokeWidth="1.15" strokeLinecap="butt" />
          <path d="M16.9 10.1v2.8" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
          <path d="M17.4 11.5h1.6" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
          <circle cx="19.4" cy="11.5" r="0.75" fill="#FFFFFF" />
        </>
      );
    case "QA":
      return <rect x="0" y="0" width="7" height="16" fill="#FFFFFF" />;
    case "BH":
      return <rect x="0" y="0" width="7" height="16" fill="#FFFFFF" />;
    case "KW":
      // Trapezoid: full height at the hoist, meeting the middle third at x=6.
      return <path d="M0 0L6 5.33V10.67L0 16Z" fill="#000000" />;
    case "AE":
      return <rect x="0" y="0" width="6.5" height="16" fill="#FF0000" />;
    case "OM":
      return <rect x="0" y="0" width="6.5" height="16" fill="#DB161B" />;
    case "JO":
      return <path d="M0 0l10 8-10 8z" fill="#CE1126" />;
    case "LB":
      return (
        <>
          <rect x="0" y="4" width="24" height="8" fill="#FFFFFF" />
          <path d="M12 5.4l2.6 4.6h-5.2z" fill="#007A3D" />
        </>
      );
    case "MA":
      // Proper interlaced pentagram, drawn as one closed path.
      return (
        <path
          d="M12 4.2l1.76 5.42-4.61-3.35h5.7l-4.61 3.35z"
          fill="none"
          stroke="#006233"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      );
    case "TN":
      return (
        <>
          <circle cx="12" cy="8" r="4.4" fill="#FFFFFF" />
          <circle cx="12.7" cy="8" r="2.7" fill="#E70013" />
          <circle cx="13.9" cy="8" r="2.1" fill="#FFFFFF" />
        </>
      );
    case "DZ":
      return (
        <>
          <circle cx="12.4" cy="8" r="3.4" fill="#D21034" />
          <circle cx="13.5" cy="8" r="2.7" fill="#006233" />
        </>
      );
    case "TR":
      return (
        <>
          <circle cx="9.5" cy="8" r="3.5" fill="#FFFFFF" />
          <circle cx="10.9" cy="8" r="2.8" fill="#E30A17" />
          <circle cx="14.4" cy="8" r="1.5" fill="#FFFFFF" />
        </>
      );
    case "PK":
      return (
        <>
          <rect x="0" y="0" width="6" height="16" fill="#FFFFFF" />
          <circle cx="15" cy="8" r="3.4" fill="#FFFFFF" />
          <circle cx="16.3" cy="8" r="2.8" fill="#01411C" />
        </>
      );
    case "MY":
      return (
        <>
          {[0, 2, 4, 6].map((i) => (
            <rect key={i} x="0" y={i * 2 + 1} width="24" height="1" fill="#FFFFFF" />
          ))}
          <rect x="0" y="0" width="12" height="9" fill="#010066" />
          <circle cx="5" cy="4.5" r="2.6" fill="#FFCC00" />
          <circle cx="6.2" cy="4.5" r="2.1" fill="#010066" />
        </>
      );
    case "CH":
      return (
        <>
          <rect x="10.2" y="4" width="3.6" height="8" fill="#FFFFFF" />
          <rect x="8" y="6.2" width="8" height="3.6" fill="#FFFFFF" />
        </>
      );
    case "JP":
      return <circle cx="12" cy="8" r="4.6" fill="#BC002D" />;
    case "KR":
      return (
        <>
          <path d="M7.4 8a4.6 4.6 0 0 1 9.2 0z" fill="#CD2E3A" />
          <path d="M7.4 8a4.6 4.6 0 0 0 9.2 0z" fill="#0047A0" />
        </>
      );
    case "CN":
      return (
        <>
          <path d="M5 3.2l.9 2.7-2.3-1.7h2.8L4.1 5.9z" fill="#FFDE00" />
          <circle cx="9" cy="2.6" r="0.7" fill="#FFDE00" />
          <circle cx="10.4" cy="4.4" r="0.7" fill="#FFDE00" />
          <circle cx="10.2" cy="6.6" r="0.7" fill="#FFDE00" />
          <circle cx="8.6" cy="8" r="0.7" fill="#FFDE00" />
        </>
      );
    case "VN":
      return <path d="M12 4.2l1.5 4.5-3.9-2.8h4.8l-3.9 2.8z" fill="#FFFF00" />;
    case "TW":
      return (
        <>
          <rect x="0" y="0" width="12" height="8" fill="#000095" />
          <circle cx="6" cy="4" r="2.4" fill="#FFFFFF" />
        </>
      );
    case "BR":
      return (
        <>
          <path d="M12 2.2L21.5 8 12 13.8 2.5 8z" fill="#FEDD00" />
          <circle cx="12" cy="8" r="3.1" fill="#012169" />
        </>
      );
    case "PS":
      return <path d="M0 0l10 8-10 8z" fill="#CE1126" />;
    case "SE":
      return nordicCross("#FECC00");
    case "DK":
    case "NO":
      return nordicCross("#FFFFFF");
    case "FI":
      return nordicCross("#003580");
    case "GR":
      return (
        <>
          {[1, 3, 5, 7].map((i) => (
            <rect key={i} x="0" y={i * 1.78} width="24" height="1.78" fill="#FFFFFF" />
          ))}
          <rect x="0" y="0" width="9" height="9" fill="#0D5EAF" />
          <rect x="3.6" y="0" width="1.8" height="9" fill="#FFFFFF" />
          <rect x="0" y="3.6" width="9" height="1.8" fill="#FFFFFF" />
        </>
      );
    case "GB":
      return (
        <>
          <path d="M0 0l24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
          <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.6" />
          <path d="M12 0v16M0 8h24" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.8" />
        </>
      );
    case "US":
      return (
        <>
          {[1, 3, 5, 7, 9].map((i) => (
            <rect key={i} x="0" y={i * 1.23} width="24" height="1.23" fill="#FFFFFF" />
          ))}
          <rect x="0" y="0" width="10" height="6.2" fill="#3C3B6E" />
        </>
      );
    case "AU":
      return (
        <>
          <rect x="0" y="0" width="11" height="7.5" fill="#012169" />
          <path d="M0 0l11 7.5M11 0L0 7.5M5.5 0v7.5M0 3.75h11" stroke="#FFFFFF" strokeWidth="1.1" />
          <path d="M17 9.5l.9 2.7-2.3-1.7h2.8l-2.3 1.7z" fill="#FFFFFF" />
        </>
      );
    case "CAQ":
      return (
        <>
          <rect x="10.4" y="0" width="3.2" height="16" fill="#FFFFFF" />
          <rect x="0" y="6.4" width="24" height="3.2" fill="#FFFFFF" />
        </>
      );
    case "CA":
      return <path d="M12 4.4l1.4 3.2 1.6-.7-1 3.1h-4l-1-3.1 1.6.7z" fill="#D80621" />;
    case "PT":
      return (
        <>
          <circle cx="9" cy="8" r="3.4" fill="#FFE900" />
          <circle cx="9" cy="8" r="2" fill="#DA291C" />
        </>
      );
    case "IN":
      return <circle cx="12" cy="8" r="2.1" fill="none" stroke="#000080" strokeWidth="0.8" />;
    case "AR2":
      return <circle cx="12" cy="8" r="1.9" fill="#F6B40E" />;
    case "ZA":
      return (
        <>
          <path d="M0 0l9 8-9 8z" fill="#007A4D" />
          <path d="M0 2.4L6.2 8 0 13.6z" fill="#000000" />
        </>
      );
    case "MX":
      return <circle cx="12" cy="8" r="1.8" fill="#8C9157" />;
    default:
      return null;
  }
}

export function Flag({ cc, size = 20, className = "" }: { cc: string; size?: number; className?: string }) {
  const raw = useId();
  const clip = `fl${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const h = H[cc];
  const v = V[cc];
  const field = FIELD[cc];

  return (
    <svg
      width={size}
      height={size * (2 / 3)}
      viewBox="0 0 24 16"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width="24" height="16" rx="2.4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {field && <rect x="0" y="0" width="24" height="16" fill={field} />}
        {h && bands(h, false)}
        {v && bands(v, true)}
        {emblem(cc)}
        <rect x="0" y="0" width="24" height="16" rx="2.4" fill="none" stroke="#FFFFFF" strokeOpacity="0.16" />
      </g>
    </svg>
  );
}
