"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Ui";
import { useT } from "@/components/LangProvider";

/**
 * The UGC video wall.
 *
 * Every clip is 9:16 and plays on its own the moment it enters view, so the
 * row is always moving without the visitor touching anything. Nothing
 * preloads until it is close to the viewport — twenty-two clips would
 * otherwise be a punishing amount of data on a phone.
 */

const COUNT = 22;

const VIDEOS = Array.from({ length: COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `/assets/video/v${n}.mp4`, poster: `/assets/video/v${n}.jpg` };
});

function Clip({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // Only attach the source once it is actually worth downloading.
          if (!el.src) el.src = src;
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35, rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <figure className="lift glow-hover group relative aspect-[9/16] w-[148px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#1E1E28] bg-[#0C0C13] sm:w-[186px] lg:w-[212px]">
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setReady(true)}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
      <span className="pointer-events-none absolute start-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
        <span
          className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-[#C8F751]" : "bg-[#6C6C80]"}`}
        />
        {label}
      </span>
    </figure>
  );
}

export default function VideoWall() {
  const t = useT();
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function update() {
    const el = rail.current;
    if (!el) return;
    // RTL reports a negative scrollLeft in Chrome, so compare on magnitude.
    const pos = Math.abs(el.scrollLeft);
    setAtStart(pos < 8);
    setAtEnd(pos + el.clientWidth >= el.scrollWidth - 8);
  }

  useEffect(update, []);

  function nudge(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({
      left: dir * (rtl ? -1 : 1) * Math.min(el.clientWidth * 0.8, 680),
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div
        ref={rail}
        onScroll={update}
        className="scrollbar-none flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:gap-4 sm:px-6 lg:px-8"
      >
        {VIDEOS.map((v) => (
          <Clip key={v.src} src={v.src} poster={v.poster} label={t.wall.videoTag} />
        ))}
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="text-[12px] leading-relaxed text-[#4E4E60] sm:text-[12.5px]">
          {t.wall.videoFooter}
        </p>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label={t.showcase.prev}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#22222E] bg-white/[0.03] text-[#9B9BAE] transition-all hover:border-[#3A3355] hover:bg-white/[0.07] hover:text-white disabled:opacity-30"
          >
            <Icon name="arrowRight" size={17} className="rotate-180 flip-rtl" />
          </button>
          <button
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label={t.showcase.next}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#22222E] bg-white/[0.03] text-[#9B9BAE] transition-all hover:border-[#3A3355] hover:bg-white/[0.07] hover:text-white disabled:opacity-30"
          >
            <Icon name="arrowRight" size={17} className="flip-rtl" />
          </button>
        </div>
      </div>
    </div>
  );
}
