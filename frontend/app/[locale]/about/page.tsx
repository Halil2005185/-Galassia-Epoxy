import { notFound } from "next/navigation";
import { whatsappHref } from "@/lib/data";
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
  const { t } = await getTranslation(lng, "about");
  return { title: `${t("title")} | Galassia Epoxy Design` };
}

type Value = { title: string; body: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t } = await getTranslation(locale, "about");
  const values = t("values", { returnObjects: true }) as Value[];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 md:px-16 md:pt-16">
        <p className="label-caps text-brass">{t("eyebrow")}</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">{t("title")}</h1>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-graphite">
          {t("description")}
        </p>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-16 sm:grid-cols-3 md:px-16">
          {values.map((v) => (
            <div key={v.title} className="border border-border p-6">
              <h2 className="label-caps text-brass">{v.title}</h2>
              <p className="mt-3 text-sm leading-6 text-graphite">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-16">
        <div className="flex flex-col items-start justify-between gap-8 bg-ink p-10 text-surface md:flex-row md:items-center md:p-16">
          <div>
            <p className="label-caps text-brass">{t("ctaEyebrow")}</p>
            <h2 className="mt-3 max-w-lg font-display text-2xl md:text-3xl">
              {t("ctaTitle")}
            </h2>
          </div>
          <a
            href={whatsappHref(t("whatsappMessage"))}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps flex-shrink-0 bg-brass px-8 py-4 text-center text-ink"
          >
            {t("startDiscussion")}
          </a>
        </div>
      </section>
    </>
  );
}
