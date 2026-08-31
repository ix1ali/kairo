"use client";

import { useEffect, useRef, useState } from "react";
import { CAMPAIGN, VIDEO_ROW } from "@/lib/media";
import { useT } from "@/components/LangProvider";

/**
 * Pick a format, see what we make.
 *
 * A row that keeps moving on its own, because a static fan looked like a
 * screenshot. The track is rendered twice so the loop has no seam, and the
 * tabs swap the set underneath it.
 *
 * This replaced a second video section that showed the same clips again
 * further down the page.
 */

type Item = { media: "video"; src: string; poster: string; kind: string } | { media: "image"; src: string; kind: string };

const TABS: { key: string; items: Item[] }[] = [
  {
    key: "video",
    // The eight strongest clips, not everything we have.
    items: VIDEO_ROW.map((v) => ({ media: "video" as const, src: v.src, poster: v.poster, kind: v.kind })),
  },
  { key: "images", items: CAMPAIGN.posts.map((p) => ({ media: "image" as const, src: p.src, kind: p.kind })) },
];

function Clip({ src, poster }: { src: string; poster: string }) {
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
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className="h-full w-full object-cover"
    />
  );
}

export default function Showcase() {
  const t = useT();
  const [tab, setTab] = useState(0);
  const items = TABS[tab].items;

  return (
    <div>
      <div className="marquee-mask marquee-hover -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
        <div
          key={tab}
          className="marquee-track animate-marquee flex w-max gap-3 sm:gap-4"
          style={{ animationDuration: items.length > 5 ? "48s" : "34s" }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-3 sm:gap-4" aria-hidden={copy === 1}>
              {items.map((item) => (
                <figure
                  key={`${copy}-${item.src}`}
                  className="w-[168px] shrink-0 sm:w-[210px] lg:w-[236px]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-[#22222E] bg-[#0C0C13]">
                    {item.media === "video" ? (
                      <Clip src={item.src} poster={item.poster} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  {/* Naming the kind is the point: it shows the range, not just the look. */}
                  <figcaption className="mt-3 text-center text-[13px] font-semibold text-[#C4C4D4] sm:text-[14px]">
                    {item.kind}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3 sm:mt-10 sm:gap-6">
        {TABS.map((x, i) => {
          const on = i === tab;
          return (
            <button key={x.key} onClick={() => setTab(i)} className="group relative pb-3 text-center">
              <span
                className={`block text-[13.5px] font-semibold transition-colors sm:text-[15px] ${
                  on ? "text-white" : "text-[#75758C] group-hover:text-[#C4C4D4]"
                }`}
              >
                {t.showcase.tabs[i]}
              </span>
              <span
                className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full transition-all duration-500 ${
                  on
                    ? "bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] opacity-100"
                    : "bg-[#22222E] opacity-60"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
