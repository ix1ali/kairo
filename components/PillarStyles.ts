export const PILLAR_COLOR: Record<string, string> = {
  authority: "#22D3EE",
  product: "#7C5CFF",
  proof: "#C8F751",
  story: "#FFB443",
  offer: "#FF6B8A",
  community: "#5EEAD4",
  objection: "#A78BFA",
};

export const PILLAR_LABEL: Record<string, string> = {
  authority: "Authority",
  product: "Product",
  proof: "Proof",
  story: "Story",
  offer: "Offer",
  community: "Community",
  objection: "Objection",
};

export const FUNNEL_LABEL: Record<string, string> = {
  awareness: "Awareness",
  consideration: "Consideration",
  conversion: "Conversion",
  retention: "Retention",
};

export const STATUS_STYLE: Record<
  string,
  { label: string; color: string; bg: string; icon: "edit" | "checkCircle" | "clock" | "check" | "skip" }
> = {
  draft: { label: "Draft", color: "#9B9BAE", bg: "rgba(155,155,174,0.12)", icon: "edit" },
  approved: { label: "Approved", color: "#7C5CFF", bg: "rgba(124,92,255,0.16)", icon: "checkCircle" },
  scheduled: { label: "Scheduled", color: "#22D3EE", bg: "rgba(34,211,238,0.14)", icon: "clock" },
  posted: { label: "Posted", color: "#C8F751", bg: "rgba(200,247,81,0.14)", icon: "check" },
  skipped: { label: "Skipped", color: "#FF6B8A", bg: "rgba(255,107,138,0.13)", icon: "skip" },
};

export const FORMAT_ICON: Record<string, string> = {
  reel: "▶",
  video: "▶",
  carousel: "❯",
  static: "▣",
  story: "◔",
};
