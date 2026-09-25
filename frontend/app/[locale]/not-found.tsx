import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { fallbackLng, isValidLocale, type Locale } from "@/lib/i18n/settings";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const COPY: Record<Locale, { title: string; body: string; cta: string }> = {
  tr: {
    title: "Sayfa Bulunamadı",
    body: "Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.",
    cta: "Ana Sayfaya Dön",
  },
  en: {
    title: "Page Not Found",
    body: "The page you're looking for may have moved or never existed.",
    cta: "Back to Home",
  },
  ar: {
    title: "الصفحة غير موجودة",
    body: "الصفحة التي تبحث عنها ربما تم نقلها أو لم تكن موجودة من الأساس.",
    cta: "العودة إلى الصفحة الرئيسية",
  },
};

export default async function LocaleNotFound() {
  // Next.js doesn't pass route params to not-found.tsx — the locale is read
  // from the x-locale header proxy.ts sets for every locale-prefixed request.
  const headerLocale = (await headers()).get("x-locale");
  const locale: Locale = headerLocale && isValidLocale(headerLocale) ? headerLocale : fallbackLng;
  const copy = COPY[locale];

  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-start px-5 py-24 md:px-16">
      <p className="label-caps text-brass">404</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-graphite">{copy.body}</p>
      <Link href={`/${locale}`} className="btn-primary label-caps mt-8">
        {copy.cta}
      </Link>
    </section>
  );
}
