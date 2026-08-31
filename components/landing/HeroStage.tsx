"use client";

import { useEffect, useRef, useState } from "react";
import Koala from "@/components/Koala";
import { Icon } from "@/components/icons/Ui";

/**
 * The hero stage. Kai, and nothing else.
 *
 * He is the brand, so he gets the whole stage — centre, lit, and large enough
 * to read as a character rather than an icon. Sample posts used to orbit him
 * and only split the attention.
 *
 * He leans toward the pointer on a real cursor. On touch he stays put, where a
 * tilt would only fight the scroll.
 */

export default function HeroStage({
  chipPosted,
  chipPostedSub,
  chipReady,
  chipReadySub,
}: {
  chipPosted: string;
  chipPostedSub: string;
  chipReady: string;
  chipReadySub: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      setTilt({ x: Math.max(-1, Math.min(1, dx)) * 7, y: Math.max(-1, Math.min(1, dy)) * 5 });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center sm:max-w-[440px]"
      style={{ perspective: 1200 }}
    >
      {/* aurora, sized to sit behind Kai like a spotlight */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF]/40 blur-[70px]" />
        <div
          className="animate-drift absolute left-[38%] top-[58%] h-[42%] w-[42%] rounded-full bg-[#22D3EE]/25 blur-[60px]"
          style={{ animationDelay: "-6s", animationDuration: "22s" }}
        />
      </div>

      <div
        className="relative h-full w-full"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Kai, and nothing competing with him */}
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ transform: "translateZ(70px)" }}
        >
          <Koala
            sizeClass="h-[190px] w-[190px] sm:h-[248px] sm:w-[248px]"
            mood="happy"
            className="drop-shadow-[0_28px_44px_rgba(0,0,0,0.7)]"
          />
        </div>
      </div>

      {/* proof chips */}
      <div
        className="absolute -left-2 top-[14%] z-20 animate-floaty rounded-2xl border border-[#22222E] bg-[#0C0C13]/90 px-3 py-2.5 backdrop-blur sm:-left-6"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#C8F751]/15 text-[#C8F751]">
            <Icon name="check" size={13} strokeWidth={3} />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-white">{chipPosted}</p>
            <p className="text-[10px] text-[#75758C]">{chipPostedSub}</p>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-2 bottom-[12%] z-20 animate-floaty rounded-2xl border border-[#22222E] bg-[#0C0C13]/90 px-3 py-2.5 backdrop-blur sm:-right-6"
        style={{ animationDelay: "1.9s" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-xl bg-[#7C5CFF]/18 text-[#A78BFA]">
            <Icon name="calendar" size={13} />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-white">{chipReady}</p>
            <p className="text-[10px] text-[#75758C]">{chipReadySub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
