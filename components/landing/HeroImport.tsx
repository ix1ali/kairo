"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons/Ui";
import { useT } from "@/components/LangProvider";

export default function HeroImport({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const router = useRouter();
  const [url, setUrl] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const q = url.trim();
    router.push(q ? `/signup?url=${encodeURIComponent(q)}` : "/signup");
  }

  return (
    <form onSubmit={go} className={compact ? "w-full max-w-md" : "w-full max-w-lg"}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E7E93]">
            <Icon name="link" size={17} />
          </span>
          <input
            className="input py-3.5 pl-11 text-[15px]"
            placeholder={t.hero.placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Your website or store link"
          />
        </div>
        <button type="submit" className="btn btn-primary shrink-0 px-6 py-3.5 text-base">
          {t.hero.cta}
          <Icon name="arrowRight" size={16} strokeWidth={2} className="flip-rtl" />
        </button>
      </div>
      <p className="mt-2.5 flex items-center gap-1.5 text-[12.5px] text-[#7E7E93]">
        <Icon name="sparkle" size={13} className="text-[#7C5CFF]" filled />
        {t.hero.hint}
      </p>
    </form>
  );
}
