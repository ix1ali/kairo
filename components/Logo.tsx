import Link from "next/link";
import { useId } from "react";

/**
 * The Koala mark: Kai's head, reduced to what still reads at 20px.
 *
 * The geometry and the materials are lifted straight from components/Koala.tsx
 * and rescaled, so the mark and the mascot are recognisably the same character.
 * That matters more than it sounds: an earlier version lightened the visor and
 * saturated the inner ears, and the result read as a four-eyed face.
 *
 * These colours are the character's own materials — a pearl shell, a dark
 * glossy visor, two lit eyes. They are deliberately not theme tokens and must
 * not be swapped when the site palette changes, exactly as the mascot's are not.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const raw = useId();
  const u = `lm${raw.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* pearl shell, lit from the upper left */}
        <radialGradient id={`${u}-shell`} cx="34%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="42%" stopColor="#EEF1F7" />
          <stop offset="74%" stopColor="#C8CFDF" />
          <stop offset="100%" stopColor="#98A0B6" />
        </radialGradient>
        <radialGradient id={`${u}-ear`} cx="32%" cy="26%" r="86%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E6EAF2" />
          <stop offset="100%" stopColor="#A6AEC4" />
        </radialGradient>
        {/* soft lavender inner ear — never a saturated disc, or it reads as an eye */}
        <radialGradient id={`${u}-inner`} cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#D9CEFF" />
          <stop offset="60%" stopColor="#B7A6F0" />
          <stop offset="100%" stopColor="#8574C9" />
        </radialGradient>

        <linearGradient id={`${u}-visor`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#23233A" />
          <stop offset="45%" stopColor="#0E0E18" />
          <stop offset="100%" stopColor="#05050B" />
        </linearGradient>
        <linearGradient id={`${u}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`${u}-eyeL`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#C9B6FF" />
          <stop offset="45%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#4B2FD0" />
        </radialGradient>
        <radialGradient id={`${u}-eyeR`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#B8F4FF" />
          <stop offset="45%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#1195AC" />
        </radialGradient>

        <radialGradient id={`${u}-nose`} cx="36%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#5C5C74" />
          <stop offset="55%" stopColor="#2E2E3E" />
          <stop offset="100%" stopColor="#15151F" />
        </radialGradient>

        <clipPath id={`${u}-clip`}>
          <rect x="9.1" y="14.16" width="21.8" height="11.21" rx="5.6" />
        </clipPath>
      </defs>

      {/* ---------- ears ---------- */}
      <circle cx="8.16" cy="12.91" r="7.16" fill={`url(#${u}-ear)`} />
      <ellipse cx="7.23" cy="13.54" rx="4.36" ry="4.2" fill={`url(#${u}-inner)`} />
      <circle cx="31.83" cy="12.91" r="7.16" fill={`url(#${u}-ear)`} />
      <ellipse cx="32.76" cy="13.54" rx="4.36" ry="4.2" fill={`url(#${u}-inner)`} />

      {/* ---------- head ---------- */}
      <ellipse cx="19" cy="21.63" rx="13.54" ry="12.61" fill={`url(#${u}-shell)`} />
      {/* key specular, so the head reads as a sphere and not a flat disc */}
      <ellipse
        cx="11.5"
        cy="12.6"
        rx="4"
        ry="2.6"
        fill="#FFFFFF"
        opacity="0.7"
        transform="rotate(-24 11.5 12.6)"
      />

      {/* ---------- nose ---------- */}
      <ellipse cx="19" cy="29.03" rx="4.36" ry="2.95" fill={`url(#${u}-nose)`} />
      <ellipse
        cx="17.6"
        cy="28.2"
        rx="1.1"
        ry="0.66"
        fill="#FFFFFF"
        opacity="0.3"
        transform="rotate(-18 17.6 28.2)"
      />

      {/* ---------- visor ---------- */}
      <rect x="9.1" y="14.16" width="21.8" height="11.21" rx="5.6" fill={`url(#${u}-visor)`} />
      <g clipPath={`url(#${u}-clip)`}>
        <ellipse cx="15.48" cy="19.76" rx="3.5" ry="3.7" fill={`url(#${u}-eyeL)`} />
        <ellipse cx="24.51" cy="19.76" rx="3.5" ry="3.7" fill={`url(#${u}-eyeR)`} />
        <path d="M9.1 14.16h21.8v5.3c-7.2 2.2-14.6 2.2-21.8 0v-5.3Z" fill={`url(#${u}-gloss)`} />
      </g>
      <rect
        x="9.1"
        y="14.16"
        width="21.8"
        height="11.21"
        rx="5.6"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.18"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function Logo({
  size = 30,
  href = "/",
  showWord = true,
  className = "",
}: {
  size?: number;
  href?: string | null;
  showWord?: boolean;
  className?: string;
}) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showWord && (
        <span
          className="display text-[1.35rem] font-bold tracking-[-0.04em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Koala
        </span>
      )}
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="transition-opacity hover:opacity-80">
      {inner}
    </Link>
  );
}
