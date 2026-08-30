"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post, Project } from "@/lib/types";
import PostDrawer from "./PostDrawer";
import { FUNNEL_LABEL, PILLAR_COLOR, PILLAR_LABEL, STATUS_STYLE } from "@/components/PillarStyles";
import { Icon } from "@/components/icons/Ui";
import { PlatformIcon } from "@/components/icons/Social";

type Tab = "calendar" | "strategy" | "products";
type View = "calendar" | "gallery";

const WEEK_NAMES = ["Plant the flag", "Earn the trust", "Make the offer", "Deepen the loop", "Momentum bridge"];

export default function ProjectWorkspace({
  project: initialProject,
  posts: initialPosts,
  credits: initialCredits,
  packageName,
}: {
  project: Project;
  posts: Post[];
  credits: number;
  packageName: string;
}) {
  const [project] = useState(initialProject);
  const [posts, setPosts] = useState(initialPosts);
  const [credits, setCredits] = useState(initialCredits);
  const [tab, setTab] = useState<Tab>("calendar");
  const [view, setView] = useState<View>("calendar");
  const [openId, setOpenId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPillar, setFilterPillar] = useState<string>("all");
  const [filterWeek, setFilterWeek] = useState<number>(0);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState("");

  const stats = useMemo(() => {
    const posted = posts.filter((p) => p.status === "posted").length;
    const scheduled = posts.filter((p) => p.status === "scheduled" || p.status === "approved").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const rated = posts.filter((p) => p.feedback);
    const avg = rated.length
      ? Math.round((rated.reduce((a, p) => a + (p.feedback?.rating || 0), 0) / rated.length) * 10) / 10
      : null;
    const reach = posts.reduce((a, p) => a + (p.metrics?.reach || 0), 0);
    return { posted, scheduled, drafts, avg, reach, total: posts.length };
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (filterPillar !== "all" && p.pillar !== filterPillar) return false;
      if (filterWeek && Math.ceil(p.day / 7) !== filterWeek) return false;
      if (q && !`${p.hook} ${p.caption} ${p.productName || ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, filterStatus, filterPillar, filterWeek, query]);

  const byDay = useMemo(() => {
    const map = new Map<number, Post[]>();
    for (const p of filtered) {
      if (!map.has(p.day)) map.set(p.day, []);
      map.get(p.day)!.push(p);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  const todayKey = new Date().toDateString();

  /** The next thing to actually do: earliest unposted day, today or later. */
  const upNext = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const pending = posts
      .filter((p) => p.status !== "posted" && p.status !== "skipped")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return pending.find((p) => new Date(p.date).getTime() >= start.getTime()) || pending[0] || null;
  }, [posts]);

  const open = posts.find((p) => p.id === openId) || null;

  function updatePost(p: Post) {
    setPosts((list) => list.map((x) => (x.id === p.id ? p : x)));
  }

  /** One tap on the circle marks a post done, or undoes it. */
  async function toggleDone(post: Post) {
    const next: Post["status"] = post.status === "posted" ? "approved" : "posted";
    updatePost({ ...post, status: next, postedAt: next === "posted" ? new Date().toISOString() : null });
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.post) updatePost(data.post);
  }

  async function bulk(status: Post["status"], target: Post[]) {
    setBusy("bulk");
    for (const p of target) {
      const res = await fetch(`/api/posts/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.post) updatePost(data.post);
    }
    setBusy("");
  }

  const s = project.strategy;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      {/* header */}
      <div className="mb-7 flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl text-xl font-bold text-[#141220]"
            style={{ background: `linear-gradient(135deg, ${project.colors.primary}, ${project.colors.secondary})` }}
          >
            {project.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              project.name.charAt(0).toUpperCase()
            )}
          </span>
          <div className="min-w-0">
            <h1 className="display truncate text-2xl sm:text-3xl">{project.name}</h1>
            <p className="mt-1 text-[13px] text-[#6B6678]">
              {project.tagline || s?.oneLiner || project.category}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {project.platforms.map((p) => (
                <span key={p} className="chip capitalize">
                  <PlatformIcon platform={p} size={12} />
                  {p}
                </span>
              ))}
              <span className="chip">{packageName} plan</span>
              <span className="chip">{project.language}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a className="btn btn-ghost btn-sm" href={`/api/export/${project.id}?scope=plan`}>
            Export plan
          </a>
          <a className="btn btn-primary btn-sm" href={`/api/export/${project.id}`}>
            Download all 30 days
          </a>
        </div>
      </div>

      {/* stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Total posts", stats.total, undefined],
          ["Posted", stats.posted, "#357A38"],
          ["Scheduled", stats.scheduled, "#0284C7"],
          ["Drafts", stats.drafts, undefined],
          ["Avg rating", stats.avg ? `${stats.avg}★` : "—", "#A65209"],
          ["Logged reach", stats.reach ? stats.reach.toLocaleString() : "—", "#6D4DF6"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="panel px-4 py-3.5">
            <p className="text-[10.5px] uppercase tracking-wider text-[#6E697E]">{String(label)}</p>
            <p className="display mt-1 text-xl" style={color ? { color: String(color) } : undefined}>
              {String(value)}
            </p>
          </div>
        ))}
      </div>

      {/* progress */}
      <div className="panel mb-6 p-5">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-[#141220]">Month progress</p>
          <p className="text-[12px] text-[#6E697E]">
            {stats.posted} of {stats.total} posted
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#EDEAE4]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6D4DF6] to-[#0284C7] transition-all duration-500"
            style={{ width: `${stats.total ? (stats.posted / stats.total) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-10 gap-1 sm:grid-cols-15 lg:grid-cols-30">
          {Array.from({ length: 30 }).map((_, i) => {
            const dayPosts = posts.filter((p) => p.day === i + 1);
            const allPosted = dayPosts.length > 0 && dayPosts.every((p) => p.status === "posted");
            const anySched = dayPosts.some((p) => p.status === "scheduled" || p.status === "approved");
            return (
              <button
                key={i}
                onClick={() => dayPosts[0] && setOpenId(dayPosts[0].id)}
                title={`Day ${i + 1}`}
                className="aspect-square rounded-[3px] transition-transform hover:scale-125"
                style={{
                  background: allPosted
                    ? "rgba(200,247,81,0.6)"
                    : anySched
                    ? "rgba(34,211,238,0.4)"
                    : "rgba(255,255,255,0.07)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* tabs */}
      <div className="mb-5 flex gap-1 border-b border-[#EDEAE4]">
        {(
          [
            ["calendar", "Calendar"],
            ["strategy", "Strategy"],
            ["products", "Brand & products"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
              tab === k
                ? "border-[#6D4DF6] text-[#141220]"
                : "border-transparent text-[#6E697E] hover:text-[#141220]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- CALENDAR ---------------- */}
      {tab === "calendar" && (
        <>
          {upNext && (
            <button
              onClick={() => setOpenId(upNext.id)}
              className="mb-5 flex w-full items-center gap-4 rounded-2xl border border-[#6D4DF6]/35 bg-gradient-to-r from-[#6D4DF6]/12 to-transparent p-3.5 text-left transition-colors hover:border-[#6D4DF6]/60 hover:from-[#6D4DF6]/18"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upNext.assetUrl || `/api/render/${upNext.id}`}
                alt=""
                className="h-[62px] w-[50px] shrink-0 rounded-lg border border-[#DCD7CF] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#6D4DF6]">
                  <Icon name="play" size={11} filled />
                  Post this next
                </p>
                <p className="mt-1 truncate text-[15px] font-semibold text-[#141220]">{upNext.hook}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#6B6678]">
                  Day {upNext.day} · {upNext.timeOfDay}
                  <PlatformIcon platform={upNext.platform} size={12} />
                  {upNext.contentTypeName || upNext.format}
                </p>
              </div>
              <span className="btn btn-primary btn-sm shrink-0">Open</span>
            </button>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <input
              className="input max-w-[220px]"
              placeholder="Search posts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="input max-w-[150px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_STYLE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <select
              className="input max-w-[150px]"
              value={filterPillar}
              onChange={(e) => setFilterPillar(e.target.value)}
            >
              <option value="all">All pillars</option>
              {Object.entries(PILLAR_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select
              className="input max-w-[150px]"
              value={filterWeek}
              onChange={(e) => setFilterWeek(Number(e.target.value))}
            >
              <option value={0}>All weeks</option>
              {[1, 2, 3, 4, 5].map((w) => (
                <option key={w} value={w}>
                  Week {w} — {WEEK_NAMES[w - 1]}
                </option>
              ))}
            </select>

            <div className="ml-auto flex gap-1 rounded-xl border border-[#E6E2DC] bg-white p-1">
              {(["calendar", "gallery"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
                    view === v ? "bg-[#EDEAE4] text-[#141220]" : "text-[#6E697E]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {filterWeek > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#E6E2DC] bg-white px-4 py-3">
              <p className="text-[13px] text-[#615D70]">
                Week {filterWeek}: <span className="font-semibold text-[#141220]">{WEEK_NAMES[filterWeek - 1]}</span>
              </p>
              <div className="ml-auto flex gap-2">
                <a className="btn btn-ghost btn-sm" href={`/api/export/${project.id}?week=${filterWeek}`}>
                  Export week
                </a>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={!!busy}
                  onClick={() => bulk("approved", filtered.filter((p) => p.status === "draft"))}
                >
                  {busy ? "Working…" : "Approve week"}
                </button>
              </div>
            </div>
          )}

          {byDay.length === 0 ? (
            <div className="panel p-10 text-center">
              <p className="text-[15px] text-[#6B6678]">No posts match those filters.</p>
            </div>
          ) : view === "calendar" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {byDay.map(([day, dayPosts]) => {
                const date = new Date(dayPosts[0].date);
                const week = Math.ceil(day / 7);
                const allDone = dayPosts.every((p) => p.status === "posted");
                const isToday = date.toDateString() === todayKey;
                const isPast = date.getTime() < new Date(todayKey).getTime();
                return (
                  <div
                    key={day}
                    className={`panel overflow-hidden transition-colors ${
                      isToday
                        ? "border-[#6D4DF6]/60 shadow-[0_0_0_1px_rgba(124,92,255,0.35)]"
                        : allDone
                        ? "border-[#357A38]/30 bg-[#357A38]/[0.03]"
                        : isPast && !allDone
                        ? "border-[#A65209]/25"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#EDEAE4] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg text-[12px] font-bold ${
                            allDone ? "bg-[#357A38]/18 text-[#357A38]" : "bg-[#F3F1EE] text-[#615D70]"
                          }`}
                        >
                          {allDone ? <Icon name="check" size={13} strokeWidth={3} /> : day}
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold text-[#141220]">Day {day}</p>
                          <p className="text-[10.5px] text-[#6E697E]">
                            {date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                      {isToday ? (
                        <span className="chip" style={{ color: "#5B3FE0", borderColor: "#6D4DF688", background: "#6D4DF622" }}>
                          Today
                        </span>
                      ) : isPast && !allDone ? (
                        <span className="chip" style={{ color: "#A65209", borderColor: "#A6520944", background: "#A652091A" }}>
                          Overdue
                        </span>
                      ) : (
                        <span className="chip">W{week}</span>
                      )}
                    </div>

                    <div className="divide-y divide-[#E6E2DC]">
                      {dayPosts.map((p) => {
                        const st = STATUS_STYLE[p.status];
                        const done = p.status === "posted";
                        return (
                          <div key={p.id} className="flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-white">
                            <button
                              onClick={() => setOpenId(p.id)}
                              className="relative h-[52px] w-[42px] shrink-0 overflow-hidden rounded-lg border border-[#DCD7CF] bg-[#F3F1EE]"
                              aria-label={`Open day ${p.day}`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.assetUrl || `/api/render/${p.id}`}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                              {done && (
                                <span className="absolute inset-0 grid place-items-center bg-[#FAF9F7]/65">
                                  <Icon name="check" size={16} className="text-[#357A38]" strokeWidth={3} />
                                </span>
                              )}
                            </button>

                            <button
                              onClick={() => setOpenId(p.id)}
                              className="min-w-0 flex-1 text-left"
                            >
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ background: PILLAR_COLOR[p.pillar] }}
                                />
                                <span className="text-[10.5px] font-semibold text-[#6B6678]">{p.timeOfDay}</span>
                                <span className="text-[#6E697E]">
                                  <PlatformIcon platform={p.platform} size={11} />
                                </span>
                                <span className="truncate text-[10px] text-[#6E697E]">{p.contentTypeName || p.format}</span>
                              </span>
                              <span
                                className={`mt-1 block clamp-2 text-[12.5px] leading-snug ${
                                  done ? "text-[#6E697E] line-through decoration-[#357A38]/40" : "text-[#3A3548]"
                                }`}
                              >
                                {p.hook}
                              </span>
                            </button>

                            <button
                              onClick={() => toggleDone(p)}
                              title={done ? "Mark as not posted" : "Mark as posted"}
                              aria-label={done ? "Mark as not posted" : "Mark as posted"}
                              className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center self-start rounded-full border transition-all duration-200 active:scale-90 ${
                                done
                                  ? "border-[#357A38] bg-[#357A38] text-[#FAF9F7] shadow-[0_0_14px_rgba(200,247,81,0.4)]"
                                  : "border-[#C9C4BC] bg-white text-[#A8A29A] hover:border-[#357A38]/70 hover:bg-[#357A38]/10 hover:text-[#357A38]"
                              }`}
                            >
                              <Icon name="check" size={14} strokeWidth={3.2} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {filtered.map((p) => {
                const st = STATUS_STYLE[p.status];
                return (
                  <button
                    key={p.id}
                    onClick={() => setOpenId(p.id)}
                    className="group overflow-hidden rounded-xl border border-[#E6E2DC] bg-[#F3F1EE] text-left transition-all hover:-translate-y-1 hover:border-[#C6B8F5]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.assetUrl || `/api/render/${p.id}`}
                      alt=""
                      loading="lazy"
                      className="w-full"
                    />
                    <div className="border-t border-[#EDEAE4] bg-[#FAF9F7] px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#615D70]">Day {p.day}</span>
                        <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: st.color }}>
                          <Icon name={st.icon} size={10} strokeWidth={2.6} />
                          {st.label}
                        </span>
                      </div>
                      <p className="mt-1 clamp-2 text-[11.5px] leading-snug text-[#6E697E]">{p.hook}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ---------------- STRATEGY ---------------- */}
      {tab === "strategy" && s && (
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow">Positioning</p>
            <p className="display mt-3 text-2xl leading-snug">{s.positioning}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#615D70]">{s.oneLiner}</p>
            {s.goal && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EDEAE4] pt-4">
                <span className="chip" style={{ color: "#357A38", borderColor: "#357A3844", background: "#357A381A" }}>
                  <Icon name="target" size={11} />
                  Goal: {s.goal}
                </span>
                <span className="chip">Measured by {s.goalKpi}</span>
              </div>
            )}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="panel p-6">
              <p className="eyebrow mb-4">What makes you different</p>
              <ul className="space-y-2.5">
                {s.differentiators.map((d, i) => (
                  <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#615D70]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D4DF6]" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel p-6">
              <p className="eyebrow mb-4">Content pillars</p>
              <div className="space-y-2.5">
                {s.pillars.map((p) => (
                  <div key={p.key}>
                    <div className="mb-1 flex items-center justify-between text-[12.5px]">
                      <span className="font-medium text-[#141220]">{p.name}</span>
                      <span className="text-[#6E697E]">{Math.round(p.share * 100)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEAE4]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.share * 100 * 3.5}%`,
                          background: PILLAR_COLOR[p.key],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <p className="eyebrow mb-4">Audience segments</p>
            <div className="grid gap-3 md:grid-cols-2">
              {s.audienceSegments.map((a, i) => (
                <div key={i} className="rounded-xl border border-[#E6E2DC] bg-white p-4">
                  <p className="text-[14px] font-semibold text-[#141220]">{a.name}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#6B6678]">{a.description}</p>
                  <p className="mt-2.5 text-[12px] text-[#6E697E]">
                    <span className="font-semibold text-[#615D70]">Trigger:</span> {a.trigger}
                  </p>
                  <p className="mt-1 text-[12px] text-[#6E697E]">
                    <span className="font-semibold text-[#615D70]">Objection:</span> {a.objection}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <p className="eyebrow mb-4">Competitive landscape</p>
            <div className="space-y-3">
              {s.competitors.map((c, i) => (
                <div key={i} className="rounded-xl border border-[#E6E2DC] bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#141220]">{c.name}</p>
                    <span className="chip">{c.archetype}</span>
                  </div>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#6E697E]">Strength</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#6B6678]">{c.strength}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#6E697E]">Their gap</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#6B6678]">{c.gap}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#6D4DF6]">Counter move</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#4A4560]">{c.counterMove}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="panel p-6">
              <p className="eyebrow mb-4">Hero product plan</p>
              <ul className="space-y-2.5">
                {s.heroPlan.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-[#615D70]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#357A38]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <p className="eyebrow mb-4">Slow mover rescue plan</p>
              <ul className="space-y-2.5">
                {s.slowMoverPlan.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-[#615D70]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A65209]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel p-6">
            <p className="eyebrow mb-4">The 30-day arc</p>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {s.weeks.map((w) => (
                <div key={w.week} className="rounded-xl border border-[#E6E2DC] bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6D4DF6]">
                    Week {w.week}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-[#141220]">{w.name}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B6678]">{w.objective}</p>
                  <p className="mt-2.5 border-t border-[#EDEAE4] pt-2 text-[11px] text-[#6E697E]">
                    KPI · {w.kpi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="panel p-6">
              <p className="eyebrow mb-4">Hashtag sets</p>
              {Object.entries(s.hashtagSets).map(([k, v]) => (
                <div key={k} className="mb-3">
                  <p className="mb-1.5 text-[11px] uppercase tracking-wider text-[#6E697E]">{k}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.map((t) => (
                      <span key={t} className="chip">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="panel p-6">
              <p className="eyebrow mb-4">Success metrics</p>
              <div className="space-y-2">
                {s.kpis.map((k, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-[#E6E2DC] bg-white px-4 py-3"
                  >
                    <span className="text-[13px] text-[#615D70]">{k.name}</span>
                    <span className="text-[13px] font-semibold text-[#141220]">{k.target}</span>
                  </div>
                ))}
              </div>
              <p className="eyebrow mb-3 mt-6">Posting times</p>
              <ul className="space-y-1.5">
                {s.postingTimes.map((t, i) => (
                  <li key={i} className="text-[12.5px] leading-relaxed text-[#6B6678]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PRODUCTS ---------------- */}
      {tab === "products" && (
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow mb-4">Brand system</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Category", project.category],
                ["Voice", project.voice],
                ["Theme", project.brandTheme.replace(/-/g, " ")],
                ["Market", project.market || "—"],
                ["Audience", project.audience || "—"],
                ["Language", project.language],
                ["Website", project.website || "—"],
                ["Goals", project.goals.join(", ") || "—"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-[#E6E2DC] bg-white px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-[#6E697E]">{k}</p>
                  <p className="mt-1 text-[13px] leading-snug text-[#141220]">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(project.colors).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center gap-2 rounded-xl border border-[#E6E2DC] bg-white px-3 py-2"
                >
                  <span className="h-6 w-6 rounded-md border border-[#E6E2DC]" style={{ background: v }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#6E697E]">{k}</p>
                    <p className="text-[12px] font-medium text-[#141220]">{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <p className="eyebrow mb-4">Products</p>
            {project.products.length === 0 ? (
              <p className="text-[14px] text-[#6B6678]">No products added to this project.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {project.products.map((p) => {
                  const tierColor =
                    p.tier === "hero" ? "#357A38" : p.tier === "slow" ? "#A65209" : "#615D70";
                  const mentions = posts.filter((x) => x.productId === p.id).length;
                  return (
                    <div key={p.id} className="rounded-xl border border-[#E6E2DC] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-[#141220]">{p.name}</p>
                          {p.price && <p className="text-[12px] text-[#6E697E]">{p.price}</p>}
                        </div>
                        <span
                          className="chip shrink-0"
                          style={{ color: tierColor, borderColor: `${tierColor}55`, background: `${tierColor}14` }}
                        >
                          {p.tier}
                        </span>
                      </div>
                      {p.description && (
                        <p className="mt-2 text-[12.5px] leading-relaxed text-[#6B6678]">{p.description}</p>
                      )}
                      {p.benefits && (
                        <p className="mt-2 text-[12px] text-[#6E697E]">
                          <span className="font-semibold text-[#615D70]">Benefit:</span> {p.benefits}
                        </p>
                      )}
                      {p.objection && (
                        <p className="mt-1 text-[12px] text-[#6E697E]">
                          <span className="font-semibold text-[#615D70]">Objection:</span> {p.objection}
                        </p>
                      )}
                      <p className="mt-3 border-t border-[#EDEAE4] pt-2.5 text-[11.5px] text-[#6E697E]">
                        Featured in {mentions} post{mentions === 1 ? "" : "s"} this month
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="panel p-6">
            <p className="eyebrow mb-3">Manage</p>
            <p className="mb-4 text-[13px] leading-relaxed text-[#6B6678]">
              Editing brand details or products and regenerating rebuilds all {posts.length} posts
              from the updated inputs. Your posted history and ratings are cleared with them, so
              export first if you want to keep this month.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/projects/${project.id}/edit`} className="btn btn-ghost btn-sm">
                Edit project
              </Link>
              <a className="btn btn-ghost btn-sm" href={`/api/export/${project.id}`}>
                Export everything first
              </a>
            </div>
          </div>
        </div>
      )}

      {open && (
        <PostDrawer
          post={open}
          credits={credits}
          onClose={() => setOpenId(null)}
          onUpdated={updatePost}
          onCredits={setCredits}
        />
      )}
    </main>
  );
}
