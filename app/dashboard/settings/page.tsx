import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { read } from "@/lib/db";
import { getPackage } from "@/lib/plans";
import PreferencesForm from "@/components/dashboard/PreferencesForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = (await currentUser())!;
  const db = read();
  const projects = db.projects.filter((p) => p.userId === user.id);
  const pkg = getPackage(user.packageId);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="eyebrow">Settings</p>
        <h1 className="display mt-2 text-3xl">Account</h1>
      </div>

      <div className="space-y-5">
        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Profile</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Name", user.name],
              ["Email", user.email],
              ["Member since", new Date(user.createdAt).toLocaleDateString()],
              ["Plan", user.subscriptionStatus === "active" ? pkg.name : "None"],
              ["Projects", `${projects.length} of ${pkg.projects}`],
              ["Credits", user.credits.toLocaleString()],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-[#7E7E93]">{k}</p>
                <p className="mt-0.5 truncate text-[14px] text-white">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Link href="/dashboard/billing" className="btn btn-ghost btn-sm">
              Manage plan
            </Link>
            <Link href="/dashboard/credits" className="btn btn-ghost btn-sm">
              Buy credits
            </Link>
          </div>
        </section>

        <PreferencesForm initial={user.preferences} />

        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Your projects</h2>
          {projects.length === 0 ? (
            <p className="text-[14px] text-[#7C7C90]">No projects yet.</p>
          ) : (
            <div className="space-y-2">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${p.colors.primary}, ${p.colors.secondary})`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-white">{p.name}</p>
                      <p className="text-[12px] text-[#7E7E93]">
                        Created {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/projects/${p.id}/edit`} className="btn btn-quiet btn-sm shrink-0">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
