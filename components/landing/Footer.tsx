import Link from "next/link";
import { Logo } from "@/components/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#plan", label: "Inside the plan" },
      { href: "/#dashboard", label: "Dashboard" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/#categories", label: "Coffee & food" },
      { href: "/#categories", label: "Gyms & studios" },
      { href: "/#categories", label: "Beauty & skincare" },
      { href: "/#categories", label: "Ecommerce brands" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Sign in" },
      { href: "/dashboard/billing", label: "Billing" },
      { href: "/dashboard/credits", label: "Credits" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#16161F] bg-[#07070B]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6C6C80]">
              A real marketing plan, then thirty days of content built to execute it. Strategy first,
              assets second, guesswork never.
            </p>
            <div className="mt-6 flex gap-2">
              {["Instagram", "TikTok", "LinkedIn", "X"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E1E28] bg-white/[0.03] text-[10px] font-bold text-[#6C6C80]"
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
                      className="text-sm text-[#6C6C80] transition-colors hover:text-[#ECECF3]"
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
          <p className="text-xs text-[#4E4E60]">
            © {new Date().getFullYear()} Kairo. Built for brands that post with intent.
          </p>
          <p className="text-xs text-[#4E4E60]">
            No free trial. Every plan starts with a full 30-day calendar.
          </p>
        </div>
      </div>
    </footer>
  );
}
