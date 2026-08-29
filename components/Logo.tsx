import Link from "next/link";
import { useId } from "react";

/**
 * The Kairo mark: Kai's face, reduced to what still reads at 20px —
 * two ears, a rounded head, and the glowing visor.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const raw = useId();
  const u = `lm${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}-s`} cx="34%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E9EDF5" />
          <stop offset="100%" stopColor="#AEB6C9" />
        </radialGradient>
        <radialGradient id={`${u}-e`} cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#D6CBFF" />
          <stop offset="100%" stopColor="#9182D6" />
        </radialGradient>
        <linearGradient id={`${u}-v`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E1E30" />
          <stop offset="100%" stopColor="#06060C" />
        </linearGradient>
      </defs>

      {/* ears */}
      <circle cx="8.5" cy="12" r="7.5" fill={`url(#${u}-s)`} />
      <circle cx="7.6" cy="12" r="4.3" fill={`url(#${u}-e)`} />
      <circle cx="31.5" cy="12" r="7.5" fill={`url(#${u}-s)`} />
      <circle cx="32.4" cy="12" r="4.3" fill={`url(#${u}-e)`} />

      {/* head */}
      <ellipse cx="20" cy="22" rx="13.5" ry="12.6" fill={`url(#${u}-s)`} />

      {/* visor */}
      <rect x="8.6" y="15.4" width="22.8" height="11.4" rx="5.7" fill={`url(#${u}-v)`} />
      <circle cx="15.4" cy="21.1" r="3.5" fill="#7C5CFF" />
      <circle cx="24.6" cy="21.1" r="3.5" fill="#22D3EE" />
      <path d="M8.6 15.4h22.8v4.6c-7.4 2.3-15.4 2.3-22.8 0v-4.6Z" fill="#FFFFFF" fillOpacity="0.16" />

      {/* nose */}
      <ellipse cx="20" cy="30.4" rx="4.1" ry="3.2" fill="#25252F" />
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
          Kairo
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
