import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, locales, type Locale } from "@/lib/i18n/config";

/** Pick the first Accept-Language entry we support, in the order the browser lists them. */
function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase().slice(0, 2);
    if (isLocale(tag)) return tag;
  }
  return null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const current = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (current) {
    const headers = new Headers(req.headers);
    headers.set("x-locale", current);
    return NextResponse.next({ request: { headers } });
  }

  const saved = req.cookies.get(localeCookie)?.value;
  const locale = isLocale(saved) ? saved : (fromAcceptLanguage(req.headers.get("accept-language")) ?? defaultLocale);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals, the generated apple-icon, and anything with a file extension (icon.svg, robots.txt...).
  matcher: ["/((?!api|_next|apple-icon|.*\\..*).*)"],
};
