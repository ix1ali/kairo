import { CONTENT_TYPES } from "@/lib/strategy/contentTypes";
import { Icon, type IconName } from "@/components/icons/Ui";
import { SectionHead } from "./Section";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

const GROUP_META: { id: "ugc" | "teach" | "product" | "story" | "convert" | "community"; icon: IconName; keys: string[]; accent: string }[] = [
  {
    id: "ugc",
    icon: "users",
    accent: "#357A38",
    keys: ["ugc-review", "ugc-unboxing", "ugc-getready", "customer-feature", "review-dump"],
  },
  {
    id: "teach",
    icon: "brain",
    accent: "#0284C7",
    keys: ["tutorial", "mistakes", "myth-buster", "explainer", "data-post", "faq"],
  },
  {
    id: "product",
    icon: "image",
    accent: "#6D4DF6",
    keys: ["close-up", "how-its-made", "flat-lay", "comparison", "before-after", "use-cases"],
  },
  {
    id: "story",
    icon: "megaphone",
    accent: "#A65209",
    keys: ["founder-story", "bts", "day-in-life", "team-spotlight", "standards"],
  },
  {
    id: "convert",
    icon: "target",
    accent: "#DB2777",
    keys: ["offer-launch", "bundle", "restock", "countdown", "objection-answer"],
  },
  {
    id: "community",
    icon: "heart",
    accent: "#0F766E",
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
            className="rounded-2xl border border-[#E6E2DC] bg-white p-5 transition-colors hover:border-[#C9C4BC]"
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: `${g.accent}1A`, color: g.accent }}
              >
                <Icon name={g.icon} size={17} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-[#141220]">{g.title}</p>
                <p className="text-[11.5px] text-[#6E697E]">{g.note}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-[#EDEAE4] pt-3.5">
              {g.keys.slice(0, 4).map((k) => {
                const c = byKey[k];
                if (!c) return null;
                return (
                  <span
                    key={k}
                    title={c.why}
                    className="rounded-lg border border-[#E6E2DC] bg-white px-2.5 py-1.5 text-[11.5px] text-[#615D70]"
                  >
                    {c.name}
                  </span>
                );
              })}
              {g.keys.length > 4 && (
                <span className="rounded-lg px-2 py-1.5 text-[11.5px] text-[#6E697E]">
                  +{g.keys.length - 4} {t.more}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[13px] leading-relaxed text-[#6E697E]">
        {t.footer}
      </p>
    </div>
  );
}
