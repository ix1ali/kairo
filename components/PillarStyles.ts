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
  // `color` is the chip's label, so it has to clear 4.5:1 against the pale
  // tint in `bg`. The hues that read well on black — cyan, lime, rose — are
  // far too light for that on white, so each one drops to a darker shade of
  // itself. `bg` stays as it was: a tint that light works either way.
  draft: { label: "Draft", color: "#55556B", bg: "rgba(155,155,174,0.14)", icon: "edit" },
  approved: { label: "Approved", color: "#5B3FE0", bg: "rgba(124,92,255,0.12)", icon: "checkCircle" },
  scheduled: { label: "Scheduled", color: "#0E7490", bg: "rgba(34,211,238,0.14)", icon: "clock" },
  posted: { label: "Posted", color: "#4D7C0F", bg: "rgba(200,247,81,0.22)", icon: "check" },
  skipped: { label: "Skipped", color: "#C2255C", bg: "rgba(255,107,138,0.13)", icon: "skip" },
};

export const FORMAT_ICON: Record<string, string> = {
  reel: "▶",
  video: "▶",
  carousel: "❯",
  static: "▣",
  story: "◔",
};
