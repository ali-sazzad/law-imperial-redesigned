import type { Locale } from "./config";

const devanagari = "०१२३४५६७८९";

/** Show digits in the reader's script. Use only for display: href="tel:" and form values keep ASCII digits. */
export function digits(text: string, locale: Locale): string {
  return locale === "ne" ? text.replace(/[0-9]/g, (c) => devanagari[Number(c)]) : text;
}
