import type { Viewport } from "next";
import { headers } from "next/headers";
import { Newsreader, Noto_Sans_Devanagari, Noto_Serif_Devanagari, Public_Sans } from "next/font/google";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { en } from "@/lib/i18n/en";
import { ne } from "@/lib/i18n/ne";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });
const serifDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-noto-serif-devanagari",
  display: "swap",
});
const sansDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#0f2238", width: "device-width", initialScale: 1 };

/** The locale comes from the URL (set as x-locale by proxy.ts) so <html lang> is right on first paint. */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const raw = (await headers()).get("x-locale");
  const locale = isLocale(raw) ? raw : defaultLocale;
  const d = locale === "ne" ? ne : en;
  return (
    <html lang={d.htmlLang} className={`${newsreader.variable} ${publicSans.variable} ${serifDeva.variable} ${sansDeva.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-crimson focus:px-4 focus:py-2 focus:text-white"
        >
          {d.ui.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
