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

  const matchedLocale = languages.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (matchedLocale) {
    // not-found.tsx doesn't receive the [locale] route param, so it can't
    // otherwise tell which locale a 404 happened under — expose it via a
    // request header so the 404 page can render in the right language.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", matchedLocale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

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
