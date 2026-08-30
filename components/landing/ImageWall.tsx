"use client";

import { useEffect, useState } from "react";
import { STILL_COLUMNS } from "@/lib/media";
import { useT } from "@/components/LangProvider";

/**
 * The stills, on their own.
 *
 * Deliberately a different shape from the video wall above: columns of two,
 * drifting as a single dense band rather than two thin rows. The order is
 * curated in lib/media.ts, so each stacked pair and each neighbouring column
 * belong to the same family — the lip-glaze campaign, then skincare, then
 * fragrance, and so on. That is the whole argument of the section: one look,
 * held across a month.
 */

export default function ImageWall() {
  const t = useT();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <div className={ready ? "" : "opacity-0"}>
      <div className="marquee-mask marquee-hover overflow-hidden">
        <div
          className="marquee-track flex w-max gap-2.5 sm:gap-3"
          style={{ animationDuration: "150s" }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-2.5 sm:gap-3" aria-hidden={copy === 1}>
              {STILL_COLUMNS.map((col, ci) => (
                <div key={`${copy}-${ci}`} className="flex shrink-0 flex-col gap-2.5 sm:gap-3">
                  {col.map((src) => (
                    <figure
                      key={src}
                      className="relative aspect-[4/5] w-[132px] overflow-hidden rounded-xl border border-[#E6E2DC] bg-[#EDEAE4] sm:w-[168px] sm:rounded-2xl lg:w-[190px]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-7 w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-[12px] text-[#6E697E]">{t.wall.stillsFooter}</p>
      </div>
    </div>
  );
}
