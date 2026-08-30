import { notFound } from "next/navigation";
import ProjectEditor from "@/components/dashboard/ProjectEditor";
import type { WizardOptions } from "@/components/dashboard/ProjectWizard";
import { currentUser } from "@/lib/auth";
import { getPackage } from "@/lib/plans";
import { getProjectFor } from "@/lib/projects";
import { BRAND_THEMES, DEFAULT_COLORS, GOAL_OPTIONS, PLATFORM_OPTIONS, VOICE_OPTIONS } from "@/lib/projects";
import { CATEGORY_OPTIONS } from "@/lib/strategy/categories";
import { activeTextProvider } from "@/lib/ai";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await currentUser())!;
  const { id } = await params;
  const found = getProjectFor(user.id, id);
  if (!found) notFound();

  const pkg = getPackage(user.packageId);
  const options: WizardOptions = {
    categories: CATEGORY_OPTIONS,
    themes: BRAND_THEMES,
    voices: VOICE_OPTIONS,
    platforms: PLATFORM_OPTIONS,
    goals: GOAL_OPTIONS,
    defaultColors: DEFAULT_COLORS,
    packageName: pkg.name,
    totalPosts: pkg.totalPosts,
    videos: pkg.videosPerMonth,
    hasTextProvider: activeTextProvider() !== "local",
  };

  return <ProjectEditor project={found.project} options={options} postCount={found.posts.length} />;
}
