import { Icon } from "@/components/icons/Ui";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

/* Deterministic, so server and client render identically. */
const CHAOS = [
  { rot: -7, c: "#E8A33D", h: 62, kind: "photo" },
  { rot: 4, c: "#4E8DF5", h: 48, kind: "text" },
  { rot: -3, c: "#6A6A80", h: 70, kind: "blank" },
  { rot: 9, c: "#D8574F", h: 44, kind: "photo" },
  { rot: -5, c: "#3FA871", h: 66, kind: "text" },
  { rot: 6, c: "#9B5DE5", h: 52, kind: "photo" },
  { rot: -9, c: "#C98B3A", h: 58, kind: "blank" },
  { rot: 3, c: "#5A5A6E", h: 46, kind: "text" },
  { rot: -4, c: "#E0616B", h: 68, kind: "photo" },
  { rot: 7, c: "#3C7FA8", h: 50, kind: "blank" },
  { rot: -6, c: "#8A8A3A", h: 60, kind: "text" },
  { rot: 5, c: "#7A5C9E", h: 54, kind: "photo" },
];

const WEEK_TINTS = [0.3, 0.5, 0.85, 0.45];

function ChaosCard({ item }: { item: (typeof CHAOS)[number] }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-white/10"
      style={{ transform: `rotate(${item.rot}deg)`, background: `${item.c}22` }}
    >
      <div className="aspect-[4/5] p-2">
        {item.kind === "photo" && (
          <div className="h-full w-full rounded" style={{ background: `${item.c}77` }} />
        )}
        {item.kind === "text" && (
          <div className="flex h-full flex-col justify-center gap-1.5 px-1">
            <div className="h-1.5 w-full rounded-full" style={{ background: `${item.c}99` }} />
            <div className="h-1.5 w-3/4 rounded-full" style={{ background: `${item.c}66` }} />
            <div className="h-1.5 w-1/2 rounded-full" style={{ background: `${item.c}44` }} />
          </div>
        )}
        {item.kind === "blank" && (
          <div className="grid h-full place-items-center text-lg font-bold text-white/25">?</div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ tint, accent }: { tint: number; accent: boolean }) {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{
        borderColor: `rgba(124,92,255,${0.18 + tint * 0.35})`,
        background: `linear-gradient(160deg, rgba(124,92,255,${tint * 0.3}), rgba(34,211,238,${tint * 0.12}))`,
      }}
    >
      <div className="aspect-[4/5] p-2">
        <div className="flex h-full flex-col justify-between">
          <div
            className="h-1 w-5 rounded-full"
            style={{ background: accent ? "#C8F751" : `rgba(255,255,255,${0.25 + tint * 0.4})` }}
          />
          <div className="space-y-1">
            <div
              className="h-1 w-full rounded-full"
              style={{ background: `rgba(255,255,255,${0.2 + tint * 0.45})` }}
            />
            <div
              className="h-1 w-2/3 rounded-full"
              style={{ background: `rgba(255,255,255,${0.14 + tint * 0.3})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ChaosVsPlan() {
  const t = dict(await getLang()).difference;
  const WEEKS = t.weeks.map((w, i) => ({ n: i + 1, label: w.label, goal: w.goal, tint: WEEK_TINTS[i] }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ---------- chaos ---------- */}
      <div className="relative overflow-hidden rounded-3xl border border-[#3A2028] bg-gradient-to-b from-[#1A1013] to-[#0C0A0C] p-6 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF6B8A]/15 text-[#FF6B8A]">
            <Icon name="shuffle" size={19} />
          </span>
          <div>
            <p className="text-base font-semibold text-white">{t.chaosTitle}</p>
            <p className="text-[12.5px] text-[#8A6570]">{t.chaosSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {CHAOS.map((c, i) => (
            <ChaosCard key={i} item={c} />
          ))}
        </div>

        <ul className="mt-6 space-y-2">
          {t.chaosPoints.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-[13px] text-[#9A7A82]">
              <Icon name="close" size={13} className="text-[#FF6B8A]" strokeWidth={2.4} />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- plan ---------- */}
      <div className="relative overflow-hidden rounded-3xl border border-[#2A2547] bg-gradient-to-b from-[#141130] to-[#0A0A12] p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#7C5CFF]/20 blur-[70px]" />

        <div className="relative mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#C8F751]/15 text-[#C8F751]">
            <Icon name="checkCircle" size={19} />
          </span>
          <div>
            <p className="text-base font-semibold text-white">{t.planTitle}</p>
            <p className="text-[12.5px] text-[#8A85B0]">{t.planSub}</p>
          </div>
        </div>

        <div className="relative space-y-2.5">
          {WEEKS.map((w) => (
            <div key={w.n} className="flex items-center gap-3">
              <div className="w-[74px] shrink-0">
                <p className="text-[11px] font-bold text-white">W{w.n}</p>
                <p className="text-[10.5px] leading-tight text-[#7C7C9E]">{w.label}</p>
              </div>
              <div className="grid flex-1 grid-cols-7 gap-1.5">
                {Array.from({ length: 7 }).map((_, d) => (
                  <PlanCard key={d} tint={w.tint} accent={w.n === 3 && d === 4} />
                ))}
              </div>
              <span
                className="hidden w-14 shrink-0 rounded-md px-1.5 py-1 text-center text-[9.5px] font-semibold sm:block"
                style={{
                  background: `rgba(124,92,255,${0.1 + w.tint * 0.16})`,
                  color: w.n === 3 ? "#C8F751" : "#A79BE0",
                }}
              >
                {w.goal}
              </span>
            </div>
          ))}

          {/* progression arrow */}
          <div className="flex items-center gap-2 pt-1 pl-[74px]">
            <div className="h-px flex-1 bg-gradient-to-r from-[#7C5CFF]/30 via-[#7C5CFF]/70 to-[#C8F751]/70" />
            <Icon name="arrowRight" size={13} className="flip-rtl text-[#C8F751]" />
          </div>
        </div>

        <ul className="relative mt-5 space-y-2">
          {t.planPoints.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-[13px] text-[#A9A5C4]">
              <Icon name="check" size={13} className="text-[#C8F751]" strokeWidth={2.6} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
