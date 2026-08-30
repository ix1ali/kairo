import { DEFAULT_LOCALE } from "./languages";

/**
 * Account-level defaults. Read when a new project is created and when a month
 * is exported — deliberately a small set, because a settings page full of
 * switches that do nothing is worse than no settings page.
 */
export interface UserPreferences {
  /** 0 = Sunday, 1 = Monday. Sunday is the working week across the Gulf. */
  weekStartsOn: 0 | 1;
  rhythm: "steady" | "frontload" | "weekend";
  locale: string;
  exportFormat: "png" | "svg";
  remindDue: boolean;
  weeklyDigest: boolean;
  autoHashtags: boolean;
}

export const DEFAULT_PREFS: UserPreferences = {
  weekStartsOn: 0,
  rhythm: "steady",
  locale: DEFAULT_LOCALE,
  exportFormat: "png",
  remindDue: true,
  weeklyDigest: false,
  autoHashtags: true,
};

export const POSTING_RHYTHMS: { key: UserPreferences["rhythm"]; label: string; note: string }[] = [
  { key: "steady", label: "Steady", note: "The same cadence every day of the month." },
  { key: "frontload", label: "Front-loaded", note: "Heavier in weeks one and two, tapering after." },
  { key: "weekend", label: "Weekend-heavy", note: "Weighted to Thursday through Saturday." },
];

/** Narrows whatever arrives over the wire to a valid preferences object. */
export function sanitisePreferences(input: unknown): UserPreferences {
  const raw = (input ?? {}) as Partial<Record<keyof UserPreferences, unknown>>;
  const pick = <T extends string | number>(value: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback;

  return {
    weekStartsOn: pick(raw.weekStartsOn, [0, 1] as const, DEFAULT_PREFS.weekStartsOn),
    rhythm: pick(raw.rhythm, ["steady", "frontload", "weekend"] as const, DEFAULT_PREFS.rhythm),
    locale: typeof raw.locale === "string" && raw.locale.length <= 12 ? raw.locale : DEFAULT_PREFS.locale,
    exportFormat: pick(raw.exportFormat, ["png", "svg"] as const, DEFAULT_PREFS.exportFormat),
    remindDue: typeof raw.remindDue === "boolean" ? raw.remindDue : DEFAULT_PREFS.remindDue,
    weeklyDigest: typeof raw.weeklyDigest === "boolean" ? raw.weeklyDigest : DEFAULT_PREFS.weeklyDigest,
    autoHashtags: typeof raw.autoHashtags === "boolean" ? raw.autoHashtags : DEFAULT_PREFS.autoHashtags,
  };
}
