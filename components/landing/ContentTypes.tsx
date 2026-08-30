import { CONTENT_TYPES } from "@/lib/strategy/contentTypes";
import { Icon, type IconName } from "@/components/icons/Ui";

const GROUPS: { title: string; note: string; icon: IconName; keys: string[]; accent: string }[] = [
  {
    title: "Creator & customer made",
    note: "The formats that read as a recommendation, not an ad.",
    icon: "users",
    accent: "#C8F751",
    keys: ["ugc-review", "ugc-unboxing", "ugc-getready", "customer-feature", "review-dump"],
  },
  {
    title: "Teaching",
    note: "Earns the save, and the save earns the reach.",
    icon: "brain",
    accent: "#22D3EE",
    keys: ["tutorial", "mistakes", "myth-buster", "explainer", "data-post", "faq"],
  },
  {
    title: "Product",
    note: "Shows the thing doing its job, from six different angles.",
    icon: "image",
    accent: "#7C5CFF",
    keys: ["close-up", "how-its-made", "flat-lay", "comparison", "before-after", "use-cases"],
  },
  {
    title: "Story",
    note: "The human layer. People buy from people.",
    icon: "megaphone",
    accent: "#FFB443",
    keys: ["founder-story", "bts", "day-in-life", "team-spotlight", "standards"],
  },
  {
    title: "Conversion",
    note: "The ask, made clearly, after the trust is built.",
    icon: "target",
    accent: "#FF6B8A",
    keys: ["offer-launch", "bundle", "restock", "countdown", "objection-answer"],
  },
  {
    title: "Community",
    note: "Two-way posts. Comments are reach.",
    icon: "heart",
    accent: "#5EEAD4",
    keys: ["this-or-that", "hot-take", "qa", "trend", "giveaway", "meme"],
  },
];

export default function ContentTypes() {
  const byKey = Object.fromEntries(CONTENT_TYPES.map((c) => [c.key, c]));

  return (
    <div>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="eyebrow">Content strategies</p>
        <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">
          {CONTENT_TYPES.length} ways to make a post.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
          Kairo picks a different tactic every day, so thirty posts never collapse into thirty
          product shots.
        </p>
      </div>

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
                <p className="text-[11.5px] text-[#5B5B70]">{g.note}</p>
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
                    className="rounded-lg border border-[#1E1E28] bg-white/[0.03] px-2.5 py-1.5 text-[11.5px] text-[#9B9BAE]"
                  >
                    {c.name}
                  </span>
                );
              })}
              {g.keys.length > 4 && (
                <span className="rounded-lg px-2 py-1.5 text-[11.5px] text-[#5B5B70]">
                  +{g.keys.length - 4} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[13px] leading-relaxed text-[#5B5B70]">
        Every one arrives with a production note — how to shoot it, how long to hold the shot, what
        to put on screen.
      </p>
    </div>
  );
}
