import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/PlaceholderImage";
import { collections, whatsappHref } from "@/lib/data";
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
  const { t } = await getTranslation(lng, "categories");
  return { title: `${t("page.title")} | Galassia Epoxy Design` };
}

type Value = { title: string; body: string };
type CollectionItem = {
  eyebrow: string;
  plate: string;
  series: string;
  title: string;
  description: string;
  specs: { label: string; value: string }[];
  ctaLabel: string;
};

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t } = await getTranslation(locale, "categories");
  const { t: tActions } = await getTranslation(locale, "common");
  const values = t("page.values", { returnObjects: true }) as Value[];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 md:px-16 md:pt-16">
        <p className="label-caps text-brass">{t("page.eyebrow")}</p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-4xl md:text-5xl">{t("page.title")}</h1>
          <p className="max-w-md text-sm leading-6 text-graphite">
            {t("page.description")}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <p className="label-caps text-graphite">{t("page.archiveIndexLabel")}</p>
            <p className="mt-1 font-display text-lg">{t("page.archiveIndexValue")}</p>
          </div>
          <div>
            <p className="label-caps text-graphite">{t("page.methodLabel")}</p>
            <p className="mt-1 font-display text-lg">{t("page.methodValue")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] space-y-16 px-5 pb-16 md:px-16">
        {collections.map((collection, index) => {
          const item = t(`items.${collection.slug}`, {
            returnObjects: true,
          }) as CollectionItem;
          const reversed = index % 2 === 1;
          return (
            <div
              key={collection.slug}
              className="grid grid-cols-1 gap-8 border border-border bg-surface p-6 lg:grid-cols-12 lg:items-center lg:p-10"
            >
              <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
                <PlaceholderImage
                  label={item.series}
                  tone={collection.tone}
                  className="aspect-[16/11] w-full"
                />
              </div>
              <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
                <div className="flex items-center justify-between">
                  <p className="label-caps text-brass">{item.eyebrow}</p>
                  <p className="label-caps text-graphite">{item.plate}</p>
                </div>
                <h2 className="mt-3 font-display text-2xl leading-tight md:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-graphite">
                  {item.description}
                </p>
                <dl className="mt-6 space-y-3 border-t border-border pt-4">
                  {item.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4 text-sm">
                      <dt className="label-caps text-graphite">{spec.label}</dt>
                      <dd className="text-right text-ink">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/categories/${collection.slug}`}
                    className="label-caps bg-ink px-6 py-3 text-surface"
                  >
                    {item.ctaLabel}
                  </Link>
                  <a
                    href={whatsappHref(t("page.commissionSpecsMessage", { title: item.title }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-caps border border-ink px-6 py-3"
                  >
                    {t("page.commissionSpecs")}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-16">
        <div className="grid grid-cols-1 gap-6 border-t border-b border-border py-10 text-center sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="px-4">
              <h3 className="label-caps text-brass">{value.title}</h3>
              <p className="mt-3 text-sm leading-6 text-graphite">{value.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-8 bg-ink p-10 text-surface md:flex-row md:items-center md:p-16">
          <div>
            <p className="label-caps text-brass">{t("page.ctaEyebrow")}</p>
            <h2 className="mt-3 max-w-lg font-display text-2xl md:text-3xl">
              {t("page.ctaTitle")}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-surface/70">
              {t("page.ctaDescription")}
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref(t("page.customDimensionMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps bg-brass px-8 py-4 text-center text-ink"
            >
              {tActions("actions.inquireWhatsapp")}
            </a>
            <Link
              href={`/${locale}/contact`}
              className="label-caps border border-surface px-8 py-4 text-center text-surface transition-colors hover:bg-surface hover:text-ink"
            >
              {t("page.requestLookbook")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
