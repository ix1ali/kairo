import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, type Lang } from "./index";

/** Reads the visitor's chosen interface language. Server components only. */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "en";
}
