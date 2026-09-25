import { siteUrl } from "./data";
import { fallbackLng, languages, type Locale } from "./i18n/settings";

export const SITE_NAME = "Galassia Epoxy Design";

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Builds `alternates.canonical` + `alternates.languages` (hreflang) for a
 * page given its path *without* the locale prefix (e.g. "" for home,
 * "/products/some-slug" for a product page). Every locale variant of a page
 * points at every other locale variant, plus an x-default pointing at the
 * fallback language, so search engines never treat the tr/en/ar versions of
 * the same page as duplicate content.
 */
export function pageAlternates(locale: Locale, pathWithoutLocale: string) {
  const languageMap: Record<string, string> = {};
  for (const lng of languages) {
    languageMap[lng] = absoluteUrl(`/${lng}${pathWithoutLocale}`);
  }
  languageMap["x-default"] = absoluteUrl(`/${fallbackLng}${pathWithoutLocale}`);

  return {
    canonical: absoluteUrl(`/${locale}${pathWithoutLocale}`),
    languages: languageMap,
  };
}

/** Trims text to a safe meta-description length without cutting mid-word. */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

const OG_LOCALE_MAP: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  ar: "ar_SA",
};

export function ogLocale(locale: Locale): string {
  return OG_LOCALE_MAP[locale];
}

export function ogAlternateLocales(locale: Locale): string[] {
  return languages.filter((l) => l !== locale).map(ogLocale);
}
