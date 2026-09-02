import Link from "next/link";
import { Logo } from "@/components/Logo";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import LangSwitch from "@/components/LangSwitch";


export default async function Footer() {
  const t = dict(await getLang()).footer;
  const COLUMNS = [
    {
      title: t.product,
      links: [
        { href: "/#how", label: t.how },
        { href: "/#plan", label: t.inside },
        { href: "/#dashboard", label: t.dashboard },
        { href: "/pricing", label: t.pricing },
      ],
    },
    {
      title: t.help,
      links: [
        { href: "/dashboard/contact", label: t.contact },
        { href: "/#faq", label: t.faq },
        { href: "/pricing", label: t.pricing },
        { href: "/#plan", label: t.inside },
      ],
    },
    {
      title: t.account,
      links: [
        { href: "/signup", label: t.create },
        { href: "/login", label: t.signIn },
        { href: "/dashboard/billing", label: t.billing },
        { href: "/dashboard/credits", label: t.credits },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[#E7E7EF] bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6E6E85]">
              {t.blurb}
            </p>
            <div className="mt-6">
              <LangSwitch />
            </div>
            <div className="mt-4 flex gap-2">
              {["Instagram", "TikTok", "LinkedIn", "X"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E7EF] bg-[#0B0B12]/[0.025] text-[10px] font-bold text-[#6E6E85]"
                  title={s}
                >
                  {s.slice(0, 2)}
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-[#0B0B12]">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#6E6E85] transition-colors hover:text-[#0B0B12]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#E7E7EF] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#6E6E85]">
            © {new Date().getFullYear()} Koala. {t.rights}
          </p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { href: "/legal/terms", label: t.terms },
              { href: "/legal/privacy", label: t.privacy },
              { href: "/legal/refund", label: t.refund },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-[#6E6E85] transition-colors hover:text-[#0B0B12]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-4 text-xs text-[#6E6E85]">{t.noTrial}</p>
      </div>
    </footer>
  );
}
