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
      title: t.useCases,
      links: [
        { href: "/#categories", label: t.coffee },
        { href: "/#categories", label: t.gyms },
        { href: "/#categories", label: t.beauty },
        { href: "/#categories", label: t.ecom },
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
    <footer className="relative border-t border-[#16161F] bg-[#0A0A0F]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#7E7E93]">
              {t.blurb}
            </p>
            <div className="mt-6">
              <LangSwitch />
            </div>
            <div className="mt-4 flex gap-2">
              {["Instagram", "TikTok", "LinkedIn", "X"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E1E28] bg-white/[0.02] text-[10px] font-bold text-[#7E7E93]"
                  title={s}
                >
                  {s.slice(0, 2)}
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#7E7E93] transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[#16161F] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#7E7E93]">
            © {new Date().getFullYear()} Koala. {t.rights}
          </p>
          <p className="text-xs text-[#7E7E93]">
            {t.noTrial}
          </p>
        </div>
      </div>
    </footer>
  );
}
