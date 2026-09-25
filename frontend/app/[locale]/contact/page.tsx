import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { whatsappHref } from "@/lib/data";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, languages, type Locale } from "@/lib/i18n/settings";
import { pageAlternates, truncateDescription } from "@/lib/seo";

const INSTAGRAM_URL = "https://www.instagram.com/galassia_epoxydesign";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61556989703838";
const LINKTREE_URL = "https://linktr.ee/Galassia_Epoxy_Design?utm_source=qr_code";

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
  const { t } = await getTranslation(lng, "contact");
  const title = t("title");
  const description = truncateDescription(t("description"));

  return {
    title,
    description,
    alternates: pageAlternates(lng, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t } = await getTranslation(locale, "contact");

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-12 md:px-16 md:py-16">
      <p className="label-caps text-brass">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-lg text-sm leading-6 text-graphite">
        {t("description")}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="border border-border p-6">
          <p className="label-caps text-brass">{t("whatsappLabel")}</p>
          <p className="mt-2 font-display text-xl" dir="ltr">+90 535 928 58 05</p>
          <p className="mt-1 text-sm text-graphite">{t("hours")}</p>
          <p className="mt-3 text-sm leading-6 text-graphite">{t("responseTimeBody")}</p>
          <a
            href={whatsappHref(t("whatsappMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary label-caps mt-5 inline-flex"
          >
            {t("whatsappCta")}
          </a>
        </div>

        <div className="border border-border p-6">
          <p className="label-caps text-brass">{t("instagramLabel")}</p>
          <p className="mt-2 font-display text-xl" dir="ltr">{t("instagramHandle")}</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow label-caps mt-5"
          >
            <span>{t("visitCta")}</span>
            <span>&rarr;</span>
          </a>
        </div>

        <div className="border border-border p-6">
          <p className="label-caps text-brass">{t("facebookLabel")}</p>
          <p className="mt-2 font-display text-xl">{t("facebookHandle")}</p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow label-caps mt-5"
          >
            <span>{t("visitCta")}</span>
            <span>&rarr;</span>
          </a>
        </div>

        <div className="border border-border p-6">
          <p className="label-caps text-brass">{t("linktreeLabel")}</p>
          <p className="mt-2 font-display text-xl">{t("linktreeHandle")}</p>
          <a
            href={LINKTREE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow label-caps mt-5"
          >
            <span>{t("visitCta")}</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
