import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { readForUser } from "@/lib/db";
import { getPackage } from "@/lib/plans";
import { projectStats } from "@/lib/projects";
import SeedDemoButton from "@/components/dashboard/SeedDemoButton";
import Koala from "@/components/Koala";
import { PILLAR_COLOR, STATUS_STYLE } from "@/components/PillarStyles";
import { Icon } from "@/components/icons/Ui";
import { PlatformIcon } from "@/components/icons/Social";

export const metadata = { title: "Overview" };

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="panel px-5 py-4">
      <p className="text-[11px] uppercase tracking-wider text-[#6E6E85]">{label}</p>
      <p className="display mt-1.5 text-2xl" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  );
}

export default async function DashboardHome() {
  const user = (await currentUser())!;
  const db = await readForUser(user.id);
  const projects = db.projects.filter((p) => p.userId === user.id);
  const pkg = getPackage(user.packageId);
  const active = user.subscriptionStatus === "active" && !!user.packageId;

  const allPosts = db.posts.filter((p) => projects.some((x) => x.id === p.projectId));
  const stats = projectStats(allPosts);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = allPosts
    .filter((p) => p.status !== "posted" && p.status !== "skipped")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  if (!active) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="panel p-8 text-center">
          <div className="mb-2 flex justify-center">
            <Koala size={130} mood="thinking" />
          </div>
          <span className="chip chip-on">Step 1 of 2</span>
          <h1 className="display mt-5 text-3xl">Choose a plan to begin</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#55556B]">
            Koala does not run a free trial. Pick your posting volume and your first 30-day campaign
            is generated the moment you add a brand.
          </p>
          <Link href="/dashboard/billing" className="btn btn-primary mt-7 px-6 py-3">
            See plans
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="display mt-2 text-3xl">
            {projects.length ? `Welcome back, ${user.name.split(" ")[0]}` : "Let's set up your first brand"}
          </h1>
        </div>
        {projects.length < pkg.projects && (
          <Link href="/dashboard/projects/new" className="btn btn-primary">
            + New project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="panel p-10 text-center">
          <div className="mx-auto mb-2 flex justify-center">
            <Koala size={150} mood="happy" />
          </div>
          <h2 className="display text-2xl">Add your first brand</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#55556B]">
            Paste your website and Koala reads your brand automatically, or fill it in yourself.
            Either way, you get a strategy and {pkg.totalPosts} finished posts in about a minute.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/projects/new" className="btn btn-primary px-6 py-3">
              Create a project
            </Link>
            <SeedDemoButton />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Stat label="Projects" value={`${projects.length}/${pkg.projects}`} />
            <Stat label="Posted" value={stats.posted} accent="#4D7C0F" />
            <Stat label="Scheduled" value={stats.approved} accent="#22D3EE" />
            <Stat label="Drafts" value={stats.drafts} />
            <Stat label="Credits" value={user.credits.toLocaleString()} accent="#7C5CFF" />
          </div>

          <section className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6E6E85]">
              Your brands
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((p) => {
                const posts = db.posts.filter((x) => x.projectId === p.id);
                const s = projectStats(posts);
                const pct = s.total ? Math.round((s.posted / s.total) * 100) : 0;
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className="panel group p-5 transition-all hover:border-[#C9BEEB] hover:bg-[#0B0B12]/[0.05]"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl text-lg font-bold text-[#0B0B12]"
                        style={{
                          background: `linear-gradient(135deg, ${p.colors.primary}, ${p.colors.secondary})`,
                        }}
                      >
                        {p.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.logoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          p.name.charAt(0).toUpperCase()
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#0B0B12]">{p.name}</p>
                        <p className="truncate text-[13px] text-[#6E6E85]">
                          {p.tagline || p.category}
                        </p>
                      </div>
                      <span className="chip shrink-0">{s.total} posts</span>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-[11px] text-[#6E6E85]">
                        <span>{s.posted} posted</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#0B0B12]/[0.07]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.platforms.slice(0, 4).map((pl) => (
                        <span key={pl} className="chip capitalize">
                          <PlatformIcon platform={pl} size={12} />
                          {pl}
                        </span>
                      ))}
                      {p.products.filter((x) => x.tier === "slow").length > 0 && (
                        <span className="chip" style={{ color: "#B45309", borderColor: "#FFB44340" }}>
                          {p.products.filter((x) => x.tier === "slow").length} slow mover
                          {p.products.filter((x) => x.tier === "slow").length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}

              {projects.length < pkg.projects && (
                <Link
                  href="/dashboard/projects/new"
                  className="flex min-h-[172px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E7EF] p-5 text-center transition-colors hover:border-[#7C5CFF]/50 hover:bg-[#0B0B12]/[0.035]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#E7E7EF] text-[#6E6E85]">
                    +
                  </span>
                  <p className="mt-3 text-sm font-medium text-[#55556B]">Add another brand</p>
                  <p className="mt-1 text-[12px] text-[#6E6E85]">
                    {pkg.projects - projects.length} remaining on {pkg.name}
                  </p>
                </Link>
              )}
            </div>
          </section>

          {upcoming.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6E6E85]">
                Next up
              </h2>
              <div className="panel divide-y divide-[#E7E7EF]">
                {upcoming.map((p) => {
                  const project = projects.find((x) => x.id === p.projectId)!;
                  const st = STATUS_STYLE[p.status];
                  return (
                    <Link
                      key={p.id}
                      href={`/dashboard/projects/${p.projectId}?day=${p.day}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#0B0B12]/[0.035]"
                    >
                      <span
                        className="h-9 w-9 shrink-0 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${PILLAR_COLOR[p.pillar]}66, ${PILLAR_COLOR[p.pillar]}18)`,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#0B0B12]">{p.hook}</p>
                        <p className="truncate text-[12px] text-[#6E6E85]">
                          {project.name} · Day {p.day} · {p.timeOfDay} · {p.platform}
                        </p>
                      </div>
                      <span
                        className="chip shrink-0"
                        style={{ color: st.color, background: st.bg, borderColor: `${st.color}33` }}
                      >
                        <Icon name={st.icon} size={11} strokeWidth={2.6} />
                        {st.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
