"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons/Ui";
import { PACKAGES } from "@/lib/plans";
import { useT } from "@/components/LangProvider";

/**
 * What a month of content costs the traditional way.
 *
 * Rates are typical freelance and agency figures, shown as editable inputs so
 * nobody has to take our word for them — change any number and the maths
 * updates.
 */
const LINES: { key: string; label: string; note: string; icon: IconName; rate: number; unit: string }[] = [
  { key: "designer", label: "Graphic designer", note: "per finished post", icon: "palette", rate: 35, unit: "post" },
  { key: "copywriter", label: "Copywriter", note: "per caption", icon: "text", rate: 20, unit: "post" },
  { key: "videographer", label: "Videographer + editor", note: "per short video", icon: "video", rate: 180, unit: "video" },
  { key: "strategist", label: "Strategist", note: "monthly plan and competitor work", icon: "brain", rate: 600, unit: "month" },
];

export default function Savings() {
  const t = useT();
  const [planId, setPlanId] = useState("growth");
  const [rates, setRates] = useState<Record<string, number>>(
    Object.fromEntries(LINES.map((l) => [l.key, l.rate]))
  );

  const plan = PACKAGES.find((p) => p.id === planId) || PACKAGES[1];

  const rows = useMemo(
    () =>
      LINES.map((l) => {
        const qty = l.unit === "post" ? plan.totalPosts : l.unit === "video" ? plan.videosPerMonth : 1;
        return { ...l, qty, total: qty * (rates[l.key] || 0) };
      }),
    [plan, rates]
  );

  const traditional = rows.reduce((a, r) => a + r.total, 0);
  const saved = Math.max(0, traditional - plan.price);
  const pct = traditional > 0 ? Math.round((saved / traditional) * 100) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      {/* the old way */}
      <div className="panel p-4 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold text-[#141220]">{t.savings.oldWay}</p>
            <p className="text-[12.5px] text-[#6E697E]">{t.savings.oldWaySub}</p>
          </div>
          <div className="flex gap-1 rounded-xl border border-[#E6E2DC] bg-white p-1">
            {PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlanId(p.id)}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  planId === p.id ? "bg-[#EDEAE4] text-[#141220]" : "text-[#6E697E] hover:text-[#141220]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.key}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2.5 rounded-xl border border-[#E6E2DC] bg-white px-3 py-3 sm:flex-nowrap sm:px-4 ${
                r.qty === 0 ? "opacity-40" : ""
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#DB2777]/12 text-[#DB2777]">
                <Icon name={r.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-[#141220]">
                  {t.savings.lines[r.key as keyof typeof t.savings.lines].label}
                </p>
                <p className="text-[11.5px] text-[#6E697E]">
                  {t.savings.lines[r.key as keyof typeof t.savings.lines].note}
                </p>
              </div>
              <div className="flex w-full shrink-0 items-center justify-end gap-1.5 sm:w-auto">
                <span className="text-[12px] text-[#6E697E]">$</span>
                <input
                  type="number"
                  min={0}
                  value={rates[r.key]}
                  onChange={(e) => setRates((v) => ({ ...v, [r.key]: Math.max(0, Number(e.target.value) || 0) }))}
                  className="w-16 rounded-lg border border-[#DCD7CF] bg-[#F3F1EE] px-2 py-1 text-right text-[13px] text-[#141220] outline-none focus:border-[#6D4DF6]"
                />
                <span className="w-16 text-right text-[12px] text-[#6E697E]">
                  × {r.qty || 0}
                </span>
                <span className="w-20 text-right text-[13px] font-semibold text-[#3A3548]">
                  ${r.total.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#E6E2DC] pt-4">
          <p className="text-[13.5px] text-[#615D70]">{t.savings.total}</p>
          <p className="display text-2xl text-[#DB2777]">${traditional.toLocaleString()}</p>
        </div>
      </div>

      {/* the Koala way */}
      <div className="relative overflow-hidden rounded-3xl border border-[#357A38]/30 bg-gradient-to-b from-[#EDF5E4] to-[#FAF9F7] p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#357A38]/12 blur-[70px]" />

        <div className="relative">
          <p className="text-[15px] font-semibold text-[#141220]">{t.savings.withKoala}</p>
          <p className="text-[12.5px] text-[#5C7A3F]">
            {plan.name} — {t.savings.sameposts} {plan.totalPosts} {t.savings.posts}
          </p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="display text-5xl">${plan.price}</span>
            <span className="text-[14px] text-[#6E697E]">{t.savings.perMonth}</span>
          </div>

          <div className="mt-7 rounded-2xl border border-[#357A38]/25 bg-[#357A38]/[0.07] p-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#4F7A2E]">
              {t.savings.youKeep}
            </p>
            <p className="display mt-1.5 text-4xl text-[#357A38]">${saved.toLocaleString()}</p>
            <p className="mt-1 text-[13px] text-[#5C7A3F]">
              {t.savings.everyMonth} — {pct}% {t.savings.less}
            </p>
          </div>

          <ul className="mt-6 space-y-2.5">
            {t.savings.points.map((point) => (
              <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-[#5C7A3F]">
                <Icon name="check" size={14} className="mt-0.5 shrink-0 text-[#357A38]" strokeWidth={2.6} />
                {point}
              </li>
            ))}
          </ul>

          <Link href={`/signup?plan=${plan.id}`} className="btn btn-primary mt-6 w-full py-3">
            {t.savings.start} {plan.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
