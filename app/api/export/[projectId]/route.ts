import { requireUser } from "@/lib/api";
import { read } from "@/lib/db";
import { renderPosterSVG } from "@/lib/render/poster";
import { createZip, type ZipEntry } from "@/lib/zip";
import { logoDataUri } from "@/lib/render/logo";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function csvCell(v: string) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { projectId } = await params;

  const db = read();
  const project = db.projects.find((p) => p.id === projectId && p.userId === auth.user.id);
  if (!project) return new Response("Not found", { status: 404 });
  const posts = db.posts
    .filter((p) => p.projectId === project.id)
    .sort((a, b) => a.day - b.day || a.slot - b.slot);

  const url = new URL(req.url);
  const scope = url.searchParams.get("scope");
  const week = Number(url.searchParams.get("week") || 0);
  const selected = week ? posts.filter((p) => Math.ceil(p.day / 7) === week) : posts;

  const logo = logoDataUri(project.logoUrl);
  const entries: ZipEntry[] = [];

  // Strategy document
  const s = project.strategy;
  if (s) {
    const md = [
      `# ${project.name} — 30 day marketing plan`,
      "",
      `_Generated ${new Date(s.generatedAt).toLocaleDateString()} by Kairo (${s.engine})_`,
      "",
      `## Positioning`,
      s.positioning,
      "",
      `**One liner:** ${s.oneLiner}`,
      "",
      `## What makes you different`,
      ...s.differentiators.map((d) => `- ${d}`),
      "",
      `## Who we are talking to`,
      ...s.audienceSegments.map(
        (a) => `### ${a.name}\n${a.description}\n- **Trigger:** ${a.trigger}\n- **Objection:** ${a.objection}`
      ),
      "",
      `## Competitive landscape`,
      ...s.competitors.map(
        (c) =>
          `### ${c.name}\n- **Archetype:** ${c.archetype}\n- **Their strength:** ${c.strength}\n- **Their gap:** ${c.gap}\n- **Our counter move:** ${c.counterMove}`
      ),
      "",
      `## Content pillars`,
      ...s.pillars.map((p) => `- **${p.name}** (${Math.round(p.share * 100)}%, ${p.funnel}) — ${p.description}`),
      "",
      `## The 30 day arc`,
      ...s.weeks.map((w) => `### Week ${w.week}: ${w.name}\n${w.objective}\n- Focus: ${w.focus}\n- KPI: ${w.kpi}`),
      "",
      `## Hero product plan`,
      ...s.heroPlan.map((h) => `- ${h}`),
      "",
      `## Slow mover rescue plan`,
      ...s.slowMoverPlan.map((h) => `- ${h}`),
      "",
      `## Posting times`,
      ...s.postingTimes.map((t) => `- ${t}`),
      "",
      `## Success metrics`,
      ...s.kpis.map((k) => `- ${k.name}: ${k.target}`),
      "",
      `## Hashtag sets`,
      ...Object.entries(s.hashtagSets).map(([k, v]) => `- **${k}:** ${v.map((x) => `#${x}`).join(" ")}`),
    ].join("\n");
    entries.push({ name: "00-strategy.md", data: md });
  }

  // Calendar CSV
  const header = [
    "Day", "Date", "Time", "Platform", "Format", "Pillar", "Funnel", "Theme",
    "Content type", "Hook", "Caption", "Hashtags", "CTA", "Product", "Status",
  ];
  const rows = selected.map((p) =>
    [
      p.day,
      new Date(p.date).toISOString().slice(0, 10),
      p.timeOfDay,
      p.platform,
      p.format,
      p.pillar,
      p.funnel,
      p.theme,
      p.contentTypeName || "",
      p.hook,
      p.caption,
      p.hashtags.map((h) => `#${h}`).join(" "),
      p.cta,
      p.productName || "",
      p.status,
    ]
      .map((v) => csvCell(String(v)))
      .join(",")
  );
  entries.push({ name: "01-calendar.csv", data: [header.join(","), ...rows].join("\n") });

  if (scope !== "plan") {
    for (const post of selected) {
      const folder = `day-${pad(post.day)}`;
      const base = `${folder}/${pad(post.day)}-${post.slot + 1}-${post.pillar}`;
      entries.push({ name: `${base}.svg`, data: renderPosterSVG(post, project, logo) });
      entries.push({
        name: `${base}.txt`,
        data: [
          `${project.name} — Day ${post.day}, ${post.timeOfDay} (${post.platform}, ${post.format})`,
          `Theme: ${post.theme}  |  Pillar: ${post.pillar}  |  Funnel stage: ${post.funnel}`,
          post.contentTypeName ? `Content type: ${post.contentTypeName} — ${post.contentWhy}` : "",
          post.productName ? `Product: ${post.productName}` : "",
          "",
          "--- CAPTION ---",
          post.caption,
          "",
          "--- HASHTAGS ---",
          post.hashtags.map((h) => `#${h}`).join(" "),
          "",
          "--- CALL TO ACTION ---",
          post.cta,
          "",
          post.format === "video" ? "--- SCRIPT ---" : "--- ART DIRECTION ---",
          post.visualDirection,
        ]
          .filter((l) => l !== "")
          .join("\n"),
      });
    }
  }

  const zip = createZip(entries);
  const slug = project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const suffix = week ? `-week-${week}` : scope === "plan" ? "-plan" : "-30-days";

  return new Response(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}${suffix}.zip"`,
      "Content-Length": String(zip.length),
    },
  });
}
