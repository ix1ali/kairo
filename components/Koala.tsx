"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Kai — the Koala mascot.
 *
 * He used to be drawn in SVG: offset radial gradients standing in for form,
 * a hand-placed specular, a painted contact shadow. It was a good vector
 * approximation and it read as exactly that — flat next to the 3D renders the
 * brand uses everywhere else.
 *
 * So the artwork is now a real render per mood, cut out to transparent and
 * shipped as WebP at 560px (2x the largest place he appears, ~27KB each).
 * Everything a raster cannot do — blinking, eyes tracking the pointer — is
 * gone; what is left is the parallax tilt and the float, which work just as
 * well on an image and carry most of the life.
 *
 * The props are unchanged, so the seven call sites did not have to move.
 */

export type KoalaMood = "happy" | "thinking" | "sleepy" | "wow";

const ART: Record<KoalaMood, string> = {
  happy: "/kai/happy.webp",
  thinking: "/kai/thinking.webp",
  sleepy: "/kai/sleepy.webp",
  wow: "/kai/wow.webp",
};

export default function Koala({
  size = 260,
  sizeClass,
  mood = "happy",
  interactive = true,
  float = true,
  className = "",
}: {
  size?: number;
  /** Tailwind width/height classes; overrides `size` so the koala can be responsive. */
  sizeClass?: string;
  mood?: KoalaMood;
  interactive?: boolean;
  float?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Leans toward the pointer. Bounded hard, because a mascot that swings
  // wildly reads as a toy rather than a product.
  useEffect(() => {
    if (!interactive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.42);
        setTilt({
          x: Math.max(-7, Math.min(7, dx / 70)),
          y: Math.max(-5, Math.min(5, dy / 90)),
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [interactive]);

  // A glance in the scroll direction, then back to rest.
  useEffect(() => {
    if (!interactive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let last = window.scrollY;
    const onScroll = () => {
      const dir = window.scrollY > last ? 1 : -1;
      last = window.scrollY;
      setTilt((t) => ({ x: t.x * 0.4, y: dir * 4 }));
      clearTimeout(timer);
      timer = setTimeout(() => setTilt({ x: 0, y: 0 }), 600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [interactive]);

  const src = ART[mood] ?? ART.happy;

  return (
    <div
      ref={ref}
      className={`${float ? "animate-floaty" : ""} ${sizeClass ?? ""} ${className}`}
      style={sizeClass ? { perspective: 600 } : { width: size, height: size, perspective: 600 }}
    >
      <Image
        src={src}
        alt="Kai, the Koala mascot"
        width={560}
        height={560}
        // He is above the fold on the landing page, so he must not wait for
        // the lazy-load observer.
        priority={mood === "happy" || mood === "wow"}
        sizes={sizeClass ? "(max-width: 640px) 150px, 260px" : `${size}px`}
        className="h-full w-full select-none object-contain"
        draggable={false}
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}
