"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Ui";
import { useT } from "@/components/LangProvider";

/**
 * The stills, on their own.
 *
 * Deliberately a grid rather than another sideways rail — the video wall
 * above already scrolls, and two rails back to back read as one long
 * undifferentiated smear. A grid also lets the images be judged as a set,
 * which is the point: one consistent look across a whole month.
 */

const COUNT = 40;
const PREVIEW = 10;

const IMAGES = Array.from(
  { length: COUNT },
  (_, i) => `/assets/creatives/c${String(i + 1).padStart(2, "0")}.webp`
);

export default function ImageWall() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const shown = open ? IMAGES : IMAGES.slice(0, PREVIEW);

  return (
    <div>
      <div className="relative">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {shown.map((src, i) => (
            <figure
              key={src}
              className="lift group relative aspect-[4/5] overflow-hidden rounded-xl border border-[#1E1E28] bg-[#0C0C13] sm:rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading={i < 4 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </figure>
          ))}
        </div>

        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
        )}
      </div>

      <div className="mt-7 flex flex-col items-center gap-3">
        <button onClick={() => setOpen((v) => !v)} className="btn btn-ghost">
          {open ? t.wall.stillsLess : t.wall.stillsMore}
          <Icon name="arrowDown" size={15} className={open ? "rotate-180" : ""} />
        </button>
        <p className="text-center text-[12px] text-[#4E4E60]">{t.wall.stillsFooter}</p>
      </div>
    </div>
  );
}
