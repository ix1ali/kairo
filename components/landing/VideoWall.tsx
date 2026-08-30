"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEO_ROWS } from "@/lib/media";
import { useT } from "@/components/LangProvider";

/**
 * The UGC video wall — two rows that drift past on their own, no controls.
 *
 * Row one is people-led, row two is product-only, and they travel in opposite
 * directions so the band never reads as one flat conveyor. Each track is
 * rendered twice; that second copy is only the loop seam, so nothing is ever
 * on screen twice at once.
 *
 * Nothing downloads until a clip is nearly in view: twenty-two clips eagerly
 * loaded would be a punishing amount of data on a phone, and the duplicated
 * tracks would double it again.
 */

function Clip({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // Attach the source only once it is actually worth fetching.
          if (!el.getAttribute("src")) el.setAttribute("src", src);
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2, rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <figure className="relative aspect-[9/16] w-[136px] shrink-0 overflow-hidden rounded-2xl border border-[#E6E2DC] bg-[#EDEAE4] shadow-[0_10px_30px_-18px_rgba(20,18,32,0.4)] sm:w-[172px] lg:w-[196px]">
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
      <span className="pointer-events-none absolute start-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3FC]" />
        {label}
      </span>
    </figure>
  );
}

function Row({
  items,
  reverse,
  label,
  seconds,
}: {
  items: { src: string; poster: string }[];
  reverse?: boolean;
  label: string;
  seconds: number;
}) {
  return (
    <div className="marquee-mask marquee-hover overflow-hidden">
      <div
        className={`marquee-track flex w-max gap-3 sm:gap-4 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationDuration: `${seconds}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-3 sm:gap-4" aria-hidden={copy === 1}>
            {items.map((v) => (
              <Clip key={`${copy}-${v.src}`} src={v.src} poster={v.poster} label={label} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VideoWall() {
  const t = useT();
  const [ready, setReady] = useState(false);

  // The tracks are duplicated, so hold the animation until after hydration to
  // avoid a visible jump as the second copy lays out.
  useEffect(() => setReady(true), []);

  return (
    <div className={ready ? "" : "opacity-0"}>
      <div className="flex flex-col gap-3 sm:gap-4">
        <Row items={VIDEO_ROWS[0]} label={t.wall.videoTag} seconds={64} />
        <Row items={VIDEO_ROWS[1]} label={t.wall.videoTag} seconds={86} reverse />
      </div>

      <div className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[12px] leading-relaxed text-[#6E697E] sm:text-[12.5px]">
          {t.wall.videoFooter}
        </p>
      </div>
    </div>
  );
}
