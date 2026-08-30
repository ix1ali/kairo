import { en, type Dict } from "./en";
import { ar } from "./ar";

export type Lang = "en" | "ar";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "AR" },
];

export const LANG_COOKIE = "kairo_lang";

const DICTS: Record<Lang, Dict> = { en, ar };

export function dict(lang: Lang): Dict {
  return DICTS[lang] || en;
}

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ar";
}

export type { Dict };
