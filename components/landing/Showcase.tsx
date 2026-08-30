"use client";

import { useRef } from "react";
import { Icon } from "@/components/icons/Ui";
import { useT } from "@/components/LangProvider";

export interface ShowcaseCard {
  id: string;
  brand: string;
  tagline: string;
  category: string;
  contentType: string;
  accent: string;
  svg: string;
}

export default function Showcase({ cards }: { cards: ShowcaseCard[] }) {
  const t = useT();
  const rail = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 620), behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={rail}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {cards.map((c) => (
          <figure
            key={c.id}
            className="group w-[220px] shrink-0 snap-start sm:w-[248px]"
          >
            <div
              className="overflow-hidden rounded-2xl border border-[#1E1E28] bg-black transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#3A3355] [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: c.svg }}
            />
            <figcaption className="mt-3 px-0.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.accent }} />
                <p className="truncate text-[13.5px] font-semibold text-white">{c.brand}</p>
              </div>
              <p className="mt-0.5 truncate text-[11.5px] text-[#5B5B70]">{c.category}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#1E1E28] bg-white/[0.03] px-2.5 py-1 text-[10.5px] font-medium text-[#8A8A9E]">
                <Icon name="wand" size={10} />
                {c.contentType}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-[12.5px] text-[#4E4E60]">
          {t.showcase.footer}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label={t.showcase.prev}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#22222E] bg-white/[0.03] text-[#9B9BAE] transition-colors hover:border-[#3A3355] hover:bg-white/[0.07] hover:text-white"
          >
            <Icon name="arrowRight" size={16} className="rotate-180 flip-rtl" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label={t.showcase.next}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#22222E] bg-white/[0.03] text-[#9B9BAE] transition-colors hover:border-[#3A3355] hover:bg-white/[0.07] hover:text-white"
          >
            <Icon name="arrowRight" size={16} className="flip-rtl" />
          </button>
        </div>
      </div>
    </div>
  );
}
