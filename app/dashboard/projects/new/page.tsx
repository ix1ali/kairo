import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProjectWizard, { type WizardOptions } from "@/components/dashboard/ProjectWizard";
import { currentUser } from "@/lib/auth";
import { read } from "@/lib/db";
import { getPackage } from "@/lib/plans";
import { BRAND_THEMES, DEFAULT_COLORS, GOAL_OPTIONS, PLATFORM_OPTIONS, VOICE_OPTIONS } from "@/lib/projects";
import { CATEGORY_OPTIONS } from "@/lib/strategy/categories";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const user = (await currentUser())!;
  if (user.subscriptionStatus !== "active" || !user.packageId) redirect("/dashboard/billing");

  const pkg = getPackage(user.packageId);
  const owned = read().projects.filter((p) => p.userId === user.id).length;
  if (owned >= pkg.projects) redirect("/dashboard/billing");

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
  };

  return (
    <Suspense>
      <ProjectWizard options={options} />
    </Suspense>
  );
}
