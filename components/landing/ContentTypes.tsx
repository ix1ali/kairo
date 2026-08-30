import { CONTENT_TYPES } from "@/lib/strategy/contentTypes";
import { Icon, type IconName } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

const GROUP_META: { id: "ugc" | "teach" | "product" | "story" | "convert" | "community"; icon: IconName; keys: string[]; accent: string }[] = [
  {
    id: "ugc",
    icon: "users",
    accent: "#C8F751",
    keys: ["ugc-review", "ugc-unboxing", "ugc-getready", "customer-feature", "review-dump"],
  },
  {
    id: "teach",
    icon: "brain",
    accent: "#22D3EE",
    keys: ["tutorial", "mistakes", "myth-buster", "explainer", "data-post", "faq"],
  },
  {
    id: "product",
    icon: "image",
    accent: "#7C5CFF",
    keys: ["close-up", "how-its-made", "flat-lay", "comparison", "before-after", "use-cases"],
  },
  {
    id: "story",
    icon: "megaphone",
    accent: "#FFB443",
    keys: ["founder-story", "bts", "day-in-life", "team-spotlight", "standards"],
  },
  {
    id: "convert",
    icon: "target",
    accent: "#FF6B8A",
    keys: ["offer-launch", "bundle", "restock", "countdown", "objection-answer"],
  },
  {
    id: "community",
    icon: "heart",
    accent: "#5EEAD4",
    keys: ["this-or-that", "hot-take", "qa", "trend", "giveaway", "meme"],
  },
];

export default async function ContentTypes() {
  const t = dict(await getLang()).tactics;
  const byKey = Object.fromEntries(CONTENT_TYPES.map((c) => [c.key, c]));
  const GROUPS = GROUP_META.map((g) => ({ ...g, title: t.groups[g.id].title, note: t.groups[g.id].note }));

  return (
    <div>
      <SectionHead
        eyebrow={t.eyebrow}
        title={
          <>
            {CONTENT_TYPES.length} {t.h1}
          </>
        }
        sub={t.sub}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <div
            key={g.title}
            className="rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-5 transition-colors hover:border-[#33333F]"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: `${g.accent}1A`, color: g.accent }}
              >
                <Icon name={g.icon} size={17} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-white">{g.title}</p>
                <p className="text-[11.5px] text-[#7E7E93]">{g.note}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-[#16161F] pt-3.5">
              {g.keys.slice(0, 4).map((k) => {
                const c = byKey[k];
                if (!c) return null;
                return (
                  <span
                    key={k}
                    title={c.why}
                    className="rounded-lg border border-[#1E1E28] bg-white/[0.02] px-2.5 py-1.5 text-[11.5px] text-[#9B9BAE]"
                  >
                    {c.name}
                  </span>
                );
              })}
              {g.keys.length > 4 && (
                <span className="rounded-lg px-2 py-1.5 text-[11.5px] text-[#7E7E93]">
                  +{g.keys.length - 4} {t.more}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[13px] leading-relaxed text-[#7E7E93]">
        {t.footer}
      </p>
    </div>
  );
}
