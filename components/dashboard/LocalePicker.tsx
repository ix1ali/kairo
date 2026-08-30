"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Flag } from "@/components/icons/Flag";
import { Icon } from "@/components/icons/Ui";
import { getLocale, localesByLanguage, LOCALES } from "@/lib/languages";

export default function LocalePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const current = getLocale(value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localesByLanguage();
    const hits = LOCALES.filter((l) =>
      `${l.language} ${l.dialect} ${l.country} ${l.native}`.toLowerCase().includes(q)
    );
    const seen: string[] = [];
    const map = new Map<string, typeof LOCALES>();
    for (const l of hits) {
      if (!map.has(l.language)) {
        map.set(l.language, []);
        seen.push(l.language);
      }
      map.get(l.language)!.push(l);
    }
    return seen.map((language) => ({ language, locales: map.get(language)! }));
  }, [query]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input flex items-center gap-2.5 text-left"
        aria-expanded={open}
      >
        <Flag cc={current.cc} size={22} />
        <span className="min-w-0 flex-1 truncate">
          <span className="text-[#141220]">{current.language}</span>
          <span className="text-[#6E697E]"> — {current.dialect}</span>
        </span>
        <Icon name="arrowDown" size={14} className={`text-[#6E697E] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 max-h-[320px] w-full overflow-hidden rounded-2xl border border-[#DCD7CF] bg-[#FFFFFF] shadow-2xl">
          <div className="border-b border-[#EDEAE4] p-2.5">
            <input
              autoFocus
              className="input py-2 text-[13px]"
              placeholder="Search country, language or dialect…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[248px] overflow-y-auto p-1.5">
            {groups.length === 0 && (
              <p className="px-3 py-4 text-center text-[13px] text-[#6E697E]">No match.</p>
            )}
            {groups.map((g) => (
              <div key={g.language} className="mb-1">
                <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6E697E]">
                  {g.language}
                </p>
                {g.locales.map((l) => {
                  const on = l.code === value;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onChange(l.code);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                        on ? "bg-[#6D4DF6]/15" : "hover:bg-[#F3F1EE]"
                      }`}
                    >
                      <Flag cc={l.cc} size={22} />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[13px] ${on ? "text-[#141220]" : "text-[#3A3548]"}`}>
                          {l.dialect}
                        </span>
                        <span className="block truncate text-[11px] text-[#6E697E]">{l.country}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-[#6E697E]" dir={l.rtl ? "rtl" : "ltr"}>
                        {l.native}
                      </span>
                      {on && <Icon name="check" size={13} className="text-[#6D4DF6]" strokeWidth={2.6} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
