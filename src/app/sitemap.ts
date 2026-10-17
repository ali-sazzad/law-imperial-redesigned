import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { firm } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${firm.url}/${l}`]));
  return locales.map((l) => ({
    url: `${firm.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages },
  }));
}
