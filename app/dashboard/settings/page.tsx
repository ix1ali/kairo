import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { read } from "@/lib/db";
import { getPackage } from "@/lib/plans";
import { activeImageProvider, activeTextProvider, providerStatus } from "@/lib/ai";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = (await currentUser())!;
  const db = read();
  const projects = db.projects.filter((p) => p.userId === user.id);
  const pkg = getPackage(user.packageId);
  const providers = providerStatus();
  const imageProvider = activeImageProvider();
  const textProvider = activeTextProvider();

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
              <div key={k} className="rounded-xl border border-[#E6E2DC] bg-white px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-[#6E697E]">{k}</p>
                <p className="mt-0.5 truncate text-[14px] text-[#141220]">{v}</p>
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

        <section className="panel p-6">
          <h2 className="display mb-2 text-lg">Generation providers</h2>
          <p className="mb-5 text-[13px] leading-relaxed text-[#6B6678]">
            Koala works with no keys at all — the strategy engine writes your plan and the built-in
            design engine renders every asset from your brand system. Adding a key upgrades image
            and video generation without changing anything else.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="chip chip-on">Images: {imageProvider}</span>
            <span className="chip chip-on">Copy: {textProvider}</span>
          </div>

          <div className="divide-y divide-[#EDEAE4] overflow-hidden rounded-xl border border-[#E6E2DC]">
            {providers.map((p) => (
              <div key={p.key} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[#141220]">{p.name}</p>
                  <p className="text-[12px] text-[#6E697E]">{p.note}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <code className="hidden rounded bg-[#F3F1EE] px-2 py-1 text-[11px] text-[#6E697E] sm:block">
                    {p.key}
                  </code>
                  <span
                    className="chip"
                    style={
                      p.configured
                        ? { color: "#357A38", borderColor: "#357A3855", background: "#357A3814" }
                        : undefined
                    }
                  >
                    {p.configured ? "Connected" : "Not set"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-xl border border-[#E6E2DC] bg-white px-4 py-3 text-[12px] leading-relaxed text-[#6E697E]">
            Add keys to <code className="text-[#615D70]">.env.local</code> in the project root and
            restart the dev server. See <code className="text-[#615D70]">.env.example</code> for the
            full list.
          </p>
        </section>

        <section className="panel p-6">
          <h2 className="display mb-4 text-lg">Your projects</h2>
          {projects.length === 0 ? (
            <p className="text-[14px] text-[#6B6678]">No projects yet.</p>
          ) : (
            <div className="space-y-2">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E6E2DC] bg-white px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${p.colors.primary}, ${p.colors.secondary})`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-[#141220]">{p.name}</p>
                      <p className="text-[12px] text-[#6E697E]">
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
