import CreditsClient from "@/components/dashboard/CreditsClient";
import { currentUser } from "@/lib/auth";
import { readForUser } from "@/lib/db";

export const metadata = { title: "Credits" };

export default async function CreditsPage() {
  const user = (await currentUser())!;
  const db = await readForUser(user.id);
  const spend = db.posts
    .filter((p) => db.projects.some((x) => x.id === p.projectId && x.userId === user.id))
    .flatMap((p) =>
      p.revisions.map((r) => ({ ...r, day: p.day, projectId: p.projectId, hook: p.hook }))
    )
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 15);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="eyebrow">Credits</p>
        <h1 className="display mt-2 text-3xl">Change anything you want</h1>
      </div>

      <CreditsClient credits={user.credits} />

      {spend.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6E6E85]">
            Recent spend
          </h2>
          <div className="panel divide-y divide-[#E7E7EF]">
            {spend.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] text-[#0B0B12]">{r.prompt}</p>
                  <p className="text-[12px] text-[#6E6E85]">
                    Day {r.day} · {new Date(r.at).toLocaleString()}
                  </p>
                </div>
                <span className="chip shrink-0">-{r.creditsSpent}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
