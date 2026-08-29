"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Is this just an AI caption generator?",
    a: "No. Kairo starts with strategy: it works out your positioning, who you are actually talking to, which competitor archetypes you are up against and where the gaps are. Only then does it build the calendar. Every one of the 30 days has a reason to exist — a funnel stage, a content pillar, a place in the monthly arc. The posts are the output of the plan, not the plan itself.",
  },
  {
    q: "Why is there no free trial?",
    a: "Because the product is not a demo you poke at — it is a finished 30-day campaign delivered the moment you add a project. There is nothing meaningful to sample halfway. You get the whole plan on day one, and you can cancel before the next month if it is not for you.",
  },
  {
    q: "What exactly do I get for each day?",
    a: "A finished visual sized for the platform, a written caption built on a proper copywriting framework, a hashtag set mixed across reach, niche and community tiers, a call to action, the posting time, and the art direction behind the design. Video days also come with a timed script, shot list and sound direction.",
  },
  {
    q: "How does it know about my competitors?",
    a: "Kairo maps your category onto competitor archetypes — the volume incumbent, the prestige specialist, the cheap alternative, the status quo — and identifies each one's strength, their structural gap, and the counter move that is available to you. If you name specific competitors, those get mapped onto the archetypes so the angles are pointed at real rivals.",
  },
  {
    q: "Can I change posts I do not like?",
    a: "Yes. Every post can be edited directly, or rebuilt with a prompt using credits. Rewrite just the caption, ask for a completely different angle, redesign the visual, or regenerate the whole day. Your plan includes a credit balance and you can top up whenever.",
  },
  {
    q: "What about slow-moving products?",
    a: "You tag each product as a hero, a core line or a slow mover. Kairo pushes heroes as the default recommendation everywhere, and builds deliberate rescue campaigns for slow movers — usually in week three — that attack the actual reason they are not selling, whether that is unclear use case, a price anchor problem or missing proof.",
  },
  {
    q: "Which platforms does it cover?",
    a: "Instagram, TikTok, Facebook, LinkedIn, X, Pinterest, YouTube Shorts and Threads. Caption length, hashtag count and format choice all adapt per platform, because a LinkedIn carousel and a TikTok hook are not the same job.",
  },
  {
    q: "Do I have to post it manually?",
    a: "Yes, for now. You download the asset and the caption and post it. The dashboard tracks what you have posted and what you have not, so nothing quietly gets skipped, and you can log how each one performed to shape next month.",
  },
  {
    q: "Can I run more than one brand?",
    a: "That is the point of projects. Each brand, product line or client gets its own project with its own logo, colours, voice, products and calendar. Starter includes one, Growth three, Studio eight.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#16161F] overflow-hidden rounded-2xl border border-[#1E1E28] bg-white/[0.015]">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors hover:bg-white/[0.025] sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-semibold text-white">{item.q}</span>
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#2A2A38] transition-transform duration-300 ${
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
                <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#9B9BAE] sm:px-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
