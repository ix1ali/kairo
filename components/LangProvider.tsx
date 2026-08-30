"use client";

import { createContext, useContext } from "react";
import { dict, type Dict, type Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

/** The dictionary for the current interface language. */
export function useT(): Dict {
  return dict(useContext(LangContext));
}

export function useRtl(): boolean {
  return useContext(LangContext) === "ar";
}
