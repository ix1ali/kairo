import type { ReactNode } from "react";

/**
 * One layout primitive for every landing section.
 *
 * Before this, each section carried its own hand-written padding, max-width
 * and background, and they had drifted apart — two dark bands would sit next
 * to each other, three transparent ones in a row, and the vertical rhythm
 * changed section to section. Everything now goes through here, so the page
 * alternates properly and spacing is decided in exactly one place.
 *
 * Mobile is the default case: padding starts small and grows, rather than
 * starting at desktop values and being squeezed down.
 */

type Tone = "base" | "raised";

export function Section({
  id,
  tone = "base",
  bleed = false,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  /** Let the content run edge to edge (for horizontal rails). */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={[
        "py-14 sm:py-20 lg:py-24",
        tone === "raised" ? "border-y border-[#E7E7EF] bg-[#0B0B12]/[0.045]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {bleed ? children : <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>}
    </section>
  );
}

/** The bit of padding a bleeding section still needs for its heading. */
export const GUTTER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "start";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={[
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        "mb-9 sm:mb-12",
        className,
      ].join(" ")}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="display mt-3 text-[1.75rem] leading-[1.1] text-balance sm:mt-4 sm:text-[2.125rem] lg:text-[2.75rem]">
        {title}
      </h2>
      {sub && (
        <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#55556B] sm:text-[15px]">{sub}</p>
      )}
    </div>
  );
}
