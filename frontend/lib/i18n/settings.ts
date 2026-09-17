export const fallbackLng = "tr" as const;
export const languages = ["tr", "en", "ar"] as const;
export type Locale = (typeof languages)[number];

export const defaultNS = "common";
export const namespaces = [
  "common",
  "home",
  "products",
  "categories",
  "about",
  "contact",
] as const;
export type Namespace = (typeof namespaces)[number];

export const cookieName = "i18next";

export const rtlLanguages: Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return rtlLanguages.includes(locale as Locale);
}

export function isValidLocale(locale: string): locale is Locale {
  return (languages as readonly string[]).includes(locale);
}

export const localeLabels: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
};

export function getOptions(lng: Locale = fallbackLng, ns: Namespace | Namespace[] = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
