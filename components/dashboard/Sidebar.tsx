"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export interface SidebarProject {
  id: string;
  name: string;
  colors: { primary: string; secondary: string };
  posted: number;
  total: number;
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: <path d="M2.5 7.5 9 2.5l6.5 5v7a1 1 0 0 1-1 1h-3v-4h-5v4h-3a1 1 0 0 1-1-1z" />,
    calendar: (
      <>
        <rect x="2.5" y="3.5" width="13" height="12" rx="2" />
        <path d="M2.5 7h13M6 2v3M12 2v3" />
      </>
    ),
    plus: <path d="M9 3.5v11M3.5 9h11" />,
    credit: (
      <>
        <rect x="2" y="4.5" width="14" height="9" rx="2" />
        <path d="M2 8h14" />
      </>
    ),
    billing: (
      <>
        <path d="M4 2.5h10v13l-2.5-1.6L9 15.5l-2.5-1.6L4 15.5z" />
        <path d="M6.5 6.5h5M6.5 9.5h5" />
      </>
    ),
    settings: (
      <>
        <circle cx="9" cy="9" r="2.4" />
        <path d="M9 1.8v1.6M9 14.6v1.6M16.2 9h-1.6M3.4 9H1.8M14.1 3.9l-1.1 1.1M5 13l-1.1 1.1M14.1 14.1 13 13M5 5 3.9 3.9" />
      </>
    ),
    wand: (
      <>
        <path d="M3 15 13 5" />
        <path d="M11.5 3.5 12.5 2M15 6.5 16.5 5.5M13.5 2.5 14.5 4M10.5 6 12 7" />
      </>
    ),
    support: (
      <>
        <path d="M2.5 4.5h13v9h-13z" />
        <path d="m2.5 5.2 6.5 4.6 6.5-4.6" />
      </>
    ),
    out: (
      <>
        <path d="M11 13v2H3V3h8v2" />
        <path d="M7.5 9h8M13 6.5 15.5 9 13 11.5" />
      </>
    ),
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {paths[name]}
    </svg>
  );
}

export default function Sidebar({
  projects,
  credits,
  planName,
  userName,
  canAddProject,
  hasPlan,
}: {
  projects: SidebarProject[];
  credits: number;
  planName: string;
  userName: string;
  canAddProject: boolean;
  hasPlan: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/dashboard", label: "Overview", icon: "home" },
    { href: "/dashboard/generate", label: "Generate", icon: "wand" },
    { href: "/dashboard/credits", label: "Credits", icon: "credit" },
    { href: "/dashboard/billing", label: "Billing", icon: "billing" },
    { href: "/dashboard/settings", label: "Settings", icon: "settings" },
    { href: "/dashboard/contact", label: "Contact us", icon: "support" },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#16161F] px-5">
        <Logo size={26} href="/dashboard" />
        <button className="btn btn-quiet btn-sm lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
        <nav className="space-y-0.5">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#7C5CFF]/13 text-white"
                    : "text-[#7C7C90] hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <Icon name={n.icon} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7E7E93]">Projects</p>
            <span className="text-[10px] text-[#3E3E4E]">{projects.length}</span>
          </div>

          <div className="space-y-0.5">
            {projects.map((p) => {
              const active = pathname.startsWith(`/dashboard/projects/${p.id}`);
              const pct = p.total ? Math.round((p.posted / p.total) * 100) : 0;
              return (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 transition-colors ${
                    active ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-6 w-6 shrink-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${p.colors.primary}, ${p.colors.secondary})`,
                      }}
                    />
                    <span
                      className={`flex-1 truncate text-[13px] font-medium ${
                        active ? "text-white" : "text-[#9B9BAE]"
                      }`}
                    >
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#7E7E93]">{pct}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              );
            })}

            {canAddProject ? (
              <Link
                href="/dashboard/projects/new"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-xl border border-dashed border-[#2A2A38] px-3 py-2.5 text-[13px] font-medium text-[#7E7E93] transition-colors hover:border-[#7C5CFF]/50 hover:text-[#7C5CFF]"
              >
                <Icon name="plus" />
                New project
              </Link>
            ) : (
              <Link
                href="/dashboard/billing"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl border border-dashed border-[#2A2A38] px-3 py-2.5 text-[12px] leading-snug text-[#7E7E93] hover:border-[#7C5CFF]/40 hover:text-[#9B9BAE]"
              >
                {hasPlan ? "Project limit reached — upgrade to add more" : "Choose a plan to add your first project"}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#16161F] p-3">
        <Link
          href="/dashboard/credits"
          className="mb-2 block rounded-xl border border-[#1E1E28] bg-gradient-to-br from-[#7C5CFF]/12 to-transparent px-3.5 py-3 transition-colors hover:border-[#7C5CFF]/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7E7E93]">
              Credits
            </span>
            <span className="display text-lg text-[#C9BEFF]">{credits.toLocaleString()}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#7E7E93]">{planName} plan</p>
        </Link>

        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#22D3EE] text-[12px] font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 truncate text-[13px] font-medium text-[#9B9BAE]">{userName}</span>
          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-[#7E7E93] transition-colors hover:bg-white/[0.05] hover:text-[#FF6B8A]"
            aria-label="Sign out"
            title="Sign out"
          >
            <Icon name="out" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* mobile bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#16161F] bg-[#0A0A0F]/95 px-4 backdrop-blur lg:hidden">
        <Logo size={24} href="/dashboard" />
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)} aria-label="Open menu">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[17rem] border-r border-[#16161F] bg-[#0A0A0F]">
            {body}
          </aside>
        </div>
      )}

      <aside className="fixed left-0 top-0 hidden h-screen w-[17rem] border-r border-[#16161F] bg-[#0A0A0F] lg:block">
        {body}
      </aside>
    </>
  );
}
