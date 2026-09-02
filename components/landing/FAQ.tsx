"use client";

import { useState } from "react";
import { useT } from "@/components/LangProvider";

export default function FAQ() {
  const t = useT();
  const ITEMS = t.faq.items;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#E7E7EF] overflow-hidden rounded-2xl border border-[#E7E7EF] bg-[#0B0B12]/[0.025]">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors hover:bg-[#0B0B12]/[0.035] sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-semibold text-[#0B0B12]">{item.q}</span>
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#DCDCE8] transition-transform duration-300 ${
                  isOpen ? "rotate-45 border-[#7C5CFF] bg-[#7C5CFF]/15" : ""
                }`}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#55556B] sm:px-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
