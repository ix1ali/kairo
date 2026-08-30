import { redirect } from "next/navigation";
import Sidebar, { type SidebarProject } from "@/components/dashboard/Sidebar";
import { currentUser } from "@/lib/auth";
import { read } from "@/lib/db";
import { getPackage } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const db = read();
  const owned = db.projects.filter((p) => p.userId === user.id);
  const projects: SidebarProject[] = owned.map((p) => {
    const posts = db.posts.filter((x) => x.projectId === p.id);
    return {
      id: p.id,
      name: p.name,
      colors: { primary: p.colors.primary, secondary: p.colors.secondary },
      posted: posts.filter((x) => x.status === "posted").length,
      total: posts.length,
    };
  });

  const pkg = getPackage(user.packageId);
  const active = user.subscriptionStatus === "active" && !!user.packageId;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <Sidebar
        projects={projects}
        credits={user.credits}
        planName={active ? pkg.name : "No"}
        userName={user.name || user.email}
        canAddProject={active && owned.length < pkg.projects}
        hasPlan={active}
      />
      <div className="lg:pl-[17rem]">{children}</div>
    </div>
  );
}
