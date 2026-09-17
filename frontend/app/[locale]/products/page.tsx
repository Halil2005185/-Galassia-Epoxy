import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/PlaceholderImage";
import { collections, products, whatsappHref } from "@/lib/data";
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
  const { t } = await getTranslation(lng, "products");
  return { title: `${t("page.title")} | Galassia Epoxy Design` };
}

type ProductItem = {
  category: string;
  badge: string;
  title: string;
  materials: string;
};
type CollectionItem = { title: string };

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t } = await getTranslation(locale, "products");
  const { t: tCategories } = await getTranslation(locale, "categories");
  const { t: tActions } = await getTranslation(locale, "common");
  const substrates = t("page.substrates", { returnObjects: true }) as string[];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 md:px-16 md:pt-16">
        <p className="label-caps text-brass">{t("page.eyebrow")}</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">{t("page.title")}</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-graphite">
              {t("page.description")}
            </p>
          </div>
          <div className="border border-border px-6 py-4">
            <p className="label-caps text-graphite">{t("page.curingWindowLabel")}</p>
            <p className="mt-1 font-display text-lg">
              {t("page.curingWindowValue")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 md:px-16">
        <div className="flex flex-col gap-4 border border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 border border-border px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-graphite">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="text-sm text-graphite">{t("page.searchPlaceholder")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-caps text-graphite">{t("page.substratesLabel")}</span>
            {substrates.map((s) => (
              <span key={s} className="label-caps border border-border px-3 py-2">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-6 border-b border-border pb-4 text-sm">
          <span className="label-caps border-b-2 border-ink pb-2 text-ink">
            {t("page.allCollections")} ({products.length})
          </span>
          {collections.map((c) => {
            const item = tCategories(`items.${c.slug}`, { returnObjects: true }) as CollectionItem;
            return (
              <span key={c.slug} className="label-caps pb-2 text-graphite">
                {item.title.split(/[&–]/)[0]}
              </span>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 md:px-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const item = t(`items.${product.slug}`, { returnObjects: true }) as ProductItem;
            return (
              <div key={product.slug} className="border border-border bg-surface">
                <div className="relative">
                  <PlaceholderImage
                    label={product.ref}
                    tone={product.tone}
                    className="aspect-[4/5] w-full"
                  />
                  <span className="label-caps absolute left-3 top-3 bg-ink px-3 py-1 text-surface">
                    {item.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="label-caps text-brass">{item.category}</p>
                    <p className="text-xs text-graphite">{product.dimensions}</p>
                  </div>
                  <h3 className="mt-2 font-display text-lg leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-graphite">
                    {item.materials}
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="link-arrow label-caps"
                    >
                      <span>{tActions("actions.viewPiece")}</span>
                      <span>&rarr;</span>
                    </Link>
                    <a
                      href={whatsappHref(`Hi Galassia, I'm interested in the ${item.title} (${product.ref}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-caps ml-auto bg-ink px-4 py-2 text-surface"
                    >
                      {tActions("actions.whatsappInquire")}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-16">
        <div className="flex flex-col items-start justify-between gap-8 bg-ink p-10 text-surface md:flex-row md:items-center md:p-16">
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
              href={whatsappHref("Hi Galassia, I'd like to initiate a WhatsApp commission conversation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps border border-surface bg-surface px-8 py-4 text-center text-ink"
            >
              {t("page.initiateCommission")}
            </a>
            <Link
              href={`/${locale}/about`}
              className="label-caps border border-surface px-8 py-4 text-center text-surface transition-colors hover:bg-surface hover:text-ink"
            >
              {t("page.viewBespokeProcess")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
