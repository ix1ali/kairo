"use client";

import { useEffect, useRef } from "react";
import { VIDEO_ROW } from "@/lib/media";
import { useT } from "@/components/LangProvider";

/**
 * One row of UGC clips, drifting on its own. No arrows, no controls.
 *
 * The track is rendered twice; that second copy is only the loop seam, so a
 * clip is never on screen twice at once. Nothing is fetched until it is close
 * to the viewport, and the source is attached rather than declared so the
 * off-screen duplicate never costs anything on a phone.
 */

function Clip({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.getAttribute("src")) el.setAttribute("src", src);
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2, rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <figure className="relative aspect-[9/16] w-[150px] shrink-0 overflow-hidden rounded-2xl border border-[#E7E7EF] bg-[#FFFFFF] sm:w-[186px] lg:w-[212px]">
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="pointer-events-none absolute start-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-[#0B0B12] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
        {label}
      </span>
    </figure>
  );
}

export default function VideoWall() {
  const t = useT();

  return (
    <div>
      <div className="marquee-mask marquee-hover overflow-hidden">
        <div
          className="marquee-track flex w-max gap-3 sm:gap-4"
          style={{ animationDuration: "72s" }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-3 sm:gap-4" aria-hidden={copy === 1}>
              {VIDEO_ROW.map((v) => (
                <Clip
                  key={`${copy}-${v.src}`}
                  src={v.src}
                  poster={v.poster}
                  label={t.wall.videoTag}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[12px] leading-relaxed text-[#6E6E85] sm:text-[12.5px]">
          {t.wall.videoFooter}
        </p>
      </div>
    </div>
  );
}
