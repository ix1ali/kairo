"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useT } from "@/components/LangProvider";
import LangSwitch from "@/components/LangSwitch";

export default function Nav() {
  const t = useT();
  const LINKS = [
    { href: "/#how", label: t.nav.how },
    { href: "/#plan", label: t.nav.plan },
    { href: "/#dashboard", label: t.nav.dashboard },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/#faq", label: t.nav.faq },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[#EDEAE4] bg-[#FAF9F7]/95 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#615D70] transition-colors hover:bg-[#F3F1EE] hover:text-[#141220]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch compact />
          <Link href="/login" className="btn btn-quiet btn-sm">
            {t.nav.signIn}
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            {t.nav.getStarted}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="btn btn-ghost btn-sm md:hidden"
          aria-label={t.nav.menu}
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-[#EDEAE4] bg-[#FAF9F7]/97 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#615D70] hover:bg-[#F3F1EE] hover:text-[#141220]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex justify-center">
              <LangSwitch />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                {t.nav.signIn}
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                {t.nav.getStarted}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
