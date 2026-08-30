/**
 * Output locales.
 *
 * Language alone is not enough for marketing copy — Kuwaiti Arabic and Moroccan
 * Darija sell very differently, and so do British and American English. You pick
 * a country; you get that country's language and the dialect people actually
 * speak there.
 */

export interface Locale {
  /** BCP-47-ish tag, e.g. "ar-KW" */
  code: string;
  country: string;
  /** ISO 3166-1 alpha-2, used to draw the flag */
  cc: string;
  language: string;
  /** How the copy should actually sound */
  dialect: string;
  native: string;
  rtl?: boolean;
}

export const LOCALES: Locale[] = [
  /* ---------------- Arabic ---------------- */
  { code: "ar-SA", country: "Saudi Arabia", cc: "SA", language: "Arabic", dialect: "Saudi (Najdi)", native: "السعودية", rtl: true },
  { code: "ar-KW", country: "Kuwait", cc: "KW", language: "Arabic", dialect: "Kuwaiti", native: "الكويتي", rtl: true },
  { code: "ar-AE", country: "United Arab Emirates", cc: "AE", language: "Arabic", dialect: "Emirati", native: "الإماراتي", rtl: true },
  { code: "ar-QA", country: "Qatar", cc: "QA", language: "Arabic", dialect: "Qatari", native: "القطري", rtl: true },
  { code: "ar-BH", country: "Bahrain", cc: "BH", language: "Arabic", dialect: "Bahraini", native: "البحريني", rtl: true },
  { code: "ar-OM", country: "Oman", cc: "OM", language: "Arabic", dialect: "Omani", native: "العماني", rtl: true },
  { code: "ar-EG", country: "Egypt", cc: "EG", language: "Arabic", dialect: "Egyptian", native: "المصري", rtl: true },
  { code: "ar-JO", country: "Jordan", cc: "JO", language: "Arabic", dialect: "Levantine", native: "الأردني", rtl: true },
  { code: "ar-LB", country: "Lebanon", cc: "LB", language: "Arabic", dialect: "Lebanese", native: "اللبناني", rtl: true },
  { code: "ar-IQ", country: "Iraq", cc: "IQ", language: "Arabic", dialect: "Iraqi", native: "العراقي", rtl: true },
  { code: "ar-MA", country: "Morocco", cc: "MA", language: "Arabic", dialect: "Darija", native: "الدارجة", rtl: true },
  { code: "ar-PS", country: "Palestine", cc: "PS", language: "Arabic", dialect: "Palestinian", native: "الفلسطيني", rtl: true },
  { code: "ar-TN", country: "Tunisia", cc: "TN", language: "Arabic", dialect: "Tunisian", native: "التونسي", rtl: true },
  { code: "ar-DZ", country: "Algeria", cc: "DZ", language: "Arabic", dialect: "Algerian", native: "الجزائري", rtl: true },
  { code: "ar", country: "Pan-Arab", cc: "AR", language: "Arabic", dialect: "Modern Standard", native: "الفصحى", rtl: true },

  /* ---------------- English ---------------- */
  { code: "en-US", country: "United States", cc: "US", language: "English", dialect: "American", native: "English" },
  { code: "en-GB", country: "United Kingdom", cc: "GB", language: "English", dialect: "British", native: "English" },
  { code: "en-AU", country: "Australia", cc: "AU", language: "English", dialect: "Australian", native: "English" },
  { code: "en-CA", country: "Canada", cc: "CA", language: "English", dialect: "Canadian", native: "English" },
  { code: "en-IE", country: "Ireland", cc: "IE", language: "English", dialect: "Irish", native: "English" },
  { code: "en-IN", country: "India", cc: "IN", language: "English", dialect: "Indian", native: "English" },
  { code: "en-ZA", country: "South Africa", cc: "ZA", language: "English", dialect: "South African", native: "English" },

  /* ---------------- Spanish ---------------- */
  { code: "es-ES", country: "Spain", cc: "ES", language: "Spanish", dialect: "Castilian", native: "Español" },
  { code: "es-MX", country: "Mexico", cc: "MX", language: "Spanish", dialect: "Mexican", native: "Español" },
  { code: "es-AR", country: "Argentina", cc: "AR2", language: "Spanish", dialect: "Rioplatense", native: "Español" },
  { code: "es-CO", country: "Colombia", cc: "CO", language: "Spanish", dialect: "Colombian", native: "Español" },

  /* ---------------- French / Portuguese / German ---------------- */
  { code: "fr-FR", country: "France", cc: "FR", language: "French", dialect: "Metropolitan", native: "Français" },
  { code: "fr-CA", country: "Québec", cc: "CAQ", language: "French", dialect: "Québécois", native: "Français" },
  { code: "pt-PT", country: "Portugal", cc: "PT", language: "Portuguese", dialect: "European", native: "Português" },
  { code: "pt-BR", country: "Brazil", cc: "BR", language: "Portuguese", dialect: "Brazilian", native: "Português" },
  { code: "de-DE", country: "Germany", cc: "DE", language: "German", dialect: "Standard", native: "Deutsch" },
  { code: "de-AT", country: "Austria", cc: "AT", language: "German", dialect: "Austrian", native: "Deutsch" },
  { code: "de-CH", country: "Switzerland", cc: "CH", language: "German", dialect: "Swiss", native: "Deutsch" },

  /* ---------------- rest of Europe ---------------- */
  { code: "it-IT", country: "Italy", cc: "IT", language: "Italian", dialect: "Standard", native: "Italiano" },
  { code: "nl-NL", country: "Netherlands", cc: "NL", language: "Dutch", dialect: "Standard", native: "Nederlands" },
  { code: "tr-TR", country: "Türkiye", cc: "TR", language: "Turkish", dialect: "Standard", native: "Türkçe" },
  { code: "pl-PL", country: "Poland", cc: "PL", language: "Polish", dialect: "Standard", native: "Polski" },
  { code: "sv-SE", country: "Sweden", cc: "SE", language: "Swedish", dialect: "Standard", native: "Svenska" },
  { code: "el-GR", country: "Greece", cc: "GR", language: "Greek", dialect: "Standard", native: "Ελληνικά" },
  { code: "ru-RU", country: "Russia", cc: "RU", language: "Russian", dialect: "Standard", native: "Русский" },
  { code: "uk-UA", country: "Ukraine", cc: "UA", language: "Ukrainian", dialect: "Standard", native: "Українська" },
  { code: "ro-RO", country: "Romania", cc: "RO", language: "Romanian", dialect: "Standard", native: "Română" },

  /* ---------------- Middle East & Asia ---------------- */
  { code: "fa-IR", country: "Iran", cc: "IR", language: "Persian", dialect: "Farsi", native: "فارسی", rtl: true },
  { code: "ur-PK", country: "Pakistan", cc: "PK", language: "Urdu", dialect: "Standard", native: "اردو", rtl: true },
  { code: "hi-IN", country: "India", cc: "IN", language: "Hindi", dialect: "Standard", native: "हिन्दी" },
  { code: "id-ID", country: "Indonesia", cc: "ID", language: "Indonesian", dialect: "Standard", native: "Bahasa Indonesia" },
  { code: "ms-MY", country: "Malaysia", cc: "MY", language: "Malay", dialect: "Standard", native: "Bahasa Melayu" },
  { code: "th-TH", country: "Thailand", cc: "TH", language: "Thai", dialect: "Standard", native: "ไทย" },
  { code: "vi-VN", country: "Vietnam", cc: "VN", language: "Vietnamese", dialect: "Standard", native: "Tiếng Việt" },
  { code: "ja-JP", country: "Japan", cc: "JP", language: "Japanese", dialect: "Standard", native: "日本語" },
  { code: "ko-KR", country: "South Korea", cc: "KR", language: "Korean", dialect: "Standard", native: "한국어" },
  { code: "zh-CN", country: "China", cc: "CN", language: "Chinese", dialect: "Simplified", native: "简体中文" },
  { code: "zh-TW", country: "Taiwan", cc: "TW", language: "Chinese", dialect: "Traditional", native: "繁體中文" },
];

export const DEFAULT_LOCALE = "en-GB";

export function getLocale(code: string): Locale {
  return LOCALES.find((l) => l.code === code) || LOCALES.find((l) => l.code === DEFAULT_LOCALE)!;
}

/** "Arabic — Kuwaiti" */
export function localeLabel(code: string) {
  const l = getLocale(code);
  return `${l.language} — ${l.dialect}`;
}

/** Grouped for a picker, in the order languages appear above. */
export function localesByLanguage(): { language: string; locales: Locale[] }[] {
  const order: string[] = [];
  const map = new Map<string, Locale[]>();
  for (const l of LOCALES) {
    if (!map.has(l.language)) {
      map.set(l.language, []);
      order.push(l.language);
    }
    map.get(l.language)!.push(l);
  }
  return order.map((language) => ({ language, locales: map.get(language)! }));
}

export function isRtl(code: string) {
  return !!getLocale(code).rtl;
}
