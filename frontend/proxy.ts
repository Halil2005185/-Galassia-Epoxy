import { NextRequest, NextResponse } from "next/server";
import { cookieName, fallbackLng, languages } from "./lib/i18n/settings";

function detectLocaleFromHeader(header: string | null): string {
  if (!header) return fallbackLng;
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());
  for (const pref of preferred) {
    const base = pref.split("-")[0];
    const match = languages.find((lang) => lang === base);
    if (match) return match;
  }
  return fallbackLng;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = languages.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  if (/\.[^/]+$/.test(pathname)) return NextResponse.next();

  const cookieLocale = request.cookies.get(cookieName)?.value;
  const locale =
    (cookieLocale && languages.includes(cookieLocale as (typeof languages)[number]) && cookieLocale) ||
    detectLocaleFromHeader(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
