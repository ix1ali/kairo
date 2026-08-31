import { currentUser } from "@/lib/auth";
import { readForUser } from "@/lib/db";
import GenerateStudio from "@/components/dashboard/GenerateStudio";

export const metadata = { title: "Generate" };

export default async function GeneratePage() {
  const user = (await currentUser())!;
  const db = await readForUser(user.id);
  const projects = db.projects
    .filter((p) => p.userId === user.id)
    .map((p) => ({ id: p.id, name: p.name }));

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="eyebrow">Generate</p>
        <h1 className="display mt-2 text-3xl">Make one thing.</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#9B9BAE]">
          For everything that comes up between months. One image or one video, on its own,
          without touching your calendar.
        </p>
      </div>

      <GenerateStudio projects={projects} credits={user.credits} />
    </main>
  );
}
