import { notFound } from "next/navigation";
import ProjectWorkspace from "@/components/dashboard/ProjectWorkspace";
import { currentUser } from "@/lib/auth";
import { getPackage } from "@/lib/plans";
import { getProjectFor } from "@/lib/projects";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return { title: "Project" };
  const { id } = await params;
  const found = getProjectFor(user.id, id);
  return { title: found?.project.name || "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await currentUser())!;
  const { id } = await params;
  const found = getProjectFor(user.id, id);
  if (!found) notFound();

  return (
    <ProjectWorkspace
      project={found.project}
      posts={found.posts}
      credits={user.credits}
      packageName={getPackage(user.packageId).name}
    />
  );
}
