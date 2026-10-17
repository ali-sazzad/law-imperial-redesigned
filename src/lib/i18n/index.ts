import type { Locale } from "./config";
import { en, type Dict } from "./en";
import { ne } from "./ne";

export type { Dict };

const dictionaries: Record<Locale, Dict> = { en, ne };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}
