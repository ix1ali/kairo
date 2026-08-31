"use client";

import { useEffect, useRef, useState } from "react";
import { CAMPAIGN, VIDEO_ROW } from "@/lib/media";
import { useT } from "@/components/LangProvider";

/**
 * Pick a format, see what we make of it.
 *
 * A fanned row where the middle card is upright and the ones either side rake
 * away, so depth does the work instead of a caption explaining it. Tabs swap
 * the set.
 *
 * Only work that is genuinely ours is listed. A tab of stock-looking stills
 * would fill the row and prove nothing.
 */

type Item = { kind: "video"; src: string; poster: string } | { kind: "image"; src: string };

const TABS: { key: string; items: Item[] }[] = [
  {
    key: "video",
    items: VIDEO_ROW.slice(0, 7).map((v) => ({ kind: "video", src: v.src, poster: v.poster })),
  },
  // The one campaign that is genuinely ours: four posts from a single photo.
  { key: "ads", items: CAMPAIGN.posts.map((src) => ({ kind: "image" as const, src })) },
];

function Card({ item, active }: { item: Item; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.pause();
      return;
    }
    if (!el.getAttribute("src") && item.kind === "video") el.setAttribute("src", item.src);
    void el.play().catch(() => {});
  }, [active, item]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-[#22222E] bg-[#0C0C13]">
      {item.kind === "video" ? (
        <video
          ref={ref}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
      )}
    </div>
  );
}

export default function Showcase() {
  const t = useT();
  const [tab, setTab] = useState(0);
  const items = TABS[tab].items;
  const mid = (items.length - 1) / 2;

  return (
    <div>
      {/* the fan */}
      <div
        className="relative -mx-4 flex h-[300px] items-center justify-center overflow-hidden sm:-mx-6 sm:h-[380px] lg:-mx-8 lg:h-[420px]"
        style={{ perspective: 1400 }}
      >
        {items.map((item, i) => {
          const offset = i - mid;
          const distance = Math.abs(offset);
          return (
            <div
              key={`${tab}-${item.src}`}
              className="absolute aspect-[9/16] h-[220px] transition-all duration-700 sm:h-[300px] lg:h-[340px]"
              style={{
                transform: `translateX(${offset * 62}%) rotateY(${offset * -22}deg) scale(${
                  1 - distance * 0.07
                })`,
                zIndex: 10 - Math.round(distance),
                opacity: distance > 3 ? 0 : 1 - distance * 0.14,
                filter: distance > 0.6 ? `brightness(${1 - distance * 0.12})` : undefined,
              }}
            >
              <Card item={item} active={distance < 1.5} />
            </div>
          );
        })}
      </div>

      {/* tabs */}
      <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 sm:mt-10 sm:gap-6">
        {TABS.map((x, i) => {
          const on = i === tab;
          return (
            <button
              key={x.key}
              onClick={() => setTab(i)}
              className="group relative pb-3 text-center"
            >
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
