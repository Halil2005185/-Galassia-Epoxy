import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslation } from "@/lib/i18n/server";
import { isRtl, isValidLocale, languages, type Locale } from "@/lib/i18n/settings";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lng: Locale = isValidLocale(locale) ? locale : "tr";
  const { t } = await getTranslation(lng, "home");
  return {
    title: "Galassia Epoxy Design | Atelier",
    description: t("hero.subtitle"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dir = isRtl(locale) ? "rtl" : "ltr";
  const { t } = await getTranslation(locale, "common");

  const headerText = {
    banner: t("banner"),
    nav: {
      home: t("nav.home"),
      products: t("nav.products"),
      categories: t("nav.categories"),
      about: t("nav.about"),
      contact: t("nav.contact"),
    },
    chatWhatsapp: t("chatWhatsapp"),
    account: t("account"),
    openMenu: t("openMenu"),
    closeMenu: t("closeMenu"),
    language: t("language"),
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink font-body">
        <Header locale={locale} t={headerText} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
