"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Ui";
import { useT } from "@/components/LangProvider";

type Item = { kind: "image"; src: string } | { kind: "video"; src: string; poster: string };

const IMAGES: Item[] = Array.from({ length: 26 }, (_, i) => ({
  kind: "image" as const,
  src: `/assets/creatives/c${String(i + 1).padStart(2, "0")}.webp`,
}));

const VIDEOS: Item[] = Array.from({ length: 5 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { kind: "video" as const, src: `/assets/video/v${n}.mp4`, poster: `/assets/video/v${n}.jpg` };
});

/** Videos every fourth slot, so the rail always has motion in view. */
const ITEMS: Item[] = (() => {
  const out: Item[] = [];
  let v = 0;
  IMAGES.forEach((img, i) => {
    out.push(img);
    if ((i + 1) % 4 === 0 && v < VIDEOS.length) out.push(VIDEOS[v++]);
  });
  return out;
})();

function VideoCard({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur">
        <Icon name="play" size={9} filled />
        Video
      </span>
    </>
  );
}

export default function MediaRail() {
  const t = useT();
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function update() {
    const el = rail.current;
    if (!el) return;
    // Works in both directions: RTL reports negative scrollLeft in Chrome.
    const pos = Math.abs(el.scrollLeft);
    setAtStart(pos < 8);
    setAtEnd(pos + el.clientWidth >= el.scrollWidth - 8);
  }

  useEffect(update, []);

  function nudge(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * Math.min(el.clientWidth * 0.85, 720), behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={rail}
        onScroll={update}
        className="scrollbar-none flex snap-x gap-4 overflow-x-auto pb-2"
      >
        {ITEMS.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            className="lift glow-hover relative aspect-[3/4] w-[196px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#1E1E28] bg-[#0C0C13] sm:w-[228px]"
          >
            {item.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <VideoCard src={item.src} poster={item.poster} />
            )}
          </figure>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-[12.5px] text-[#4E4E60]">{t.wall.footer}</p>
        <div className="flex shrink-0 gap-2">
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
