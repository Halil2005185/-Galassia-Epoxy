import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, languages, type Locale } from "@/lib/i18n/settings";

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lng: Locale = isValidLocale(locale) ? locale : "tr";
  const { t } = await getTranslation(lng, "contact");
  return { title: `${t("title")} | Galassia Epoxy Design` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t, i18n } = await getTranslation(locale, "contact");
  const formText = {
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    interestLabel: t("interestLabel"),
    interestPlaceholder: t("interestPlaceholder"),
    notesLabel: t("notesLabel"),
    notesPlaceholder: t("notesPlaceholder"),
    sendWhatsapp: t("sendWhatsapp"),
    message: i18n.getResource(locale, "contact", "message"),
  };

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-12 md:px-16 md:py-16">
      <p className="label-caps text-brass">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-lg text-sm leading-6 text-graphite">
        {t("description")}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <ContactForm t={formText} />

        <div className="space-y-6 lg:col-span-5">
          <div className="border border-border p-6">
            <p className="label-caps text-graphite">{t("directLineLabel")}</p>
            <p className="mt-2 font-display text-xl">+1 (800) 555-RESIN</p>
            <p className="mt-1 text-sm text-graphite">{t("hours")}</p>
          </div>
          <div className="border border-border p-6">
            <p className="label-caps text-graphite">{t("studioLabel")}</p>
            <p className="mt-2 text-sm leading-6 text-graphite">{t("studioValue")}</p>
          </div>
          <div className="border border-border p-6">
            <p className="label-caps text-graphite">{t("responseTimeLabel")}</p>
            <p className="mt-2 text-sm leading-6 text-graphite">{t("responseTimeBody")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
