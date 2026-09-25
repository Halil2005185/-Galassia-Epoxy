import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/PlaceholderImage";
import { collections, getCollectionMeta, products, whatsappHref } from "@/lib/data";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, languages, type Locale } from "@/lib/i18n/settings";
import { absoluteUrl, pageAlternates, truncateDescription } from "@/lib/seo";

export function generateStaticParams() {
  return languages.flatMap((locale) =>
    collections.map((collection) => ({ locale, slug: collection.slug }))
  );
}

type CollectionItem = {
  eyebrow: string;
  plate: string;
  series: string;
  title: string;
  description: string;
  specs: { label: string; value: string }[];
  ctaLabel: string;
};

type ProductItem = { title: string; badge: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lng: Locale = isValidLocale(locale) ? locale : "tr";
  const { t } = await getTranslation(lng, "categories");
  const meta = getCollectionMeta(slug);
  if (!meta) return { title: "Collection Not Found", robots: { index: false, follow: true } };

  const item = t(`items.${slug}`, { returnObjects: true }) as CollectionItem;
  const description = truncateDescription(item.description);

  return {
    title: item.title,
    description,
    alternates: pageAlternates(lng, `/categories/${slug}`),
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const meta = getCollectionMeta(slug);
  if (!meta) notFound();

  const { t } = await getTranslation(locale, "categories");
  const { t: tProducts } = await getTranslation(locale, "products");
  const { t: tCommon } = await getTranslation(locale, "common");
  const item = t(`items.${slug}`, { returnObjects: true }) as CollectionItem;
  const pieces = products.filter((p) => p.categorySlug === slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("breadcrumbHome"), item: absoluteUrl(`/${locale}`) },
      {
        "@type": "ListItem",
        position: 2,
        name: t("page.breadcrumbCategories"),
        item: absoluteUrl(`/${locale}/categories`),
      },
      { "@type": "ListItem", position: 3, name: item.title, item: absoluteUrl(`/${locale}/categories/${slug}`) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="mx-auto max-w-[1440px] px-5 pt-6 md:px-16">
        <nav className="text-xs text-graphite">
          <Link href={`/${locale}`} className="hover:text-ink">{tCommon("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/categories`} className="hover:text-ink">{t("page.breadcrumbCategories")}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{item.title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-16">
        <div className="flex items-center justify-between">
          <p className="label-caps text-brass">{item.eyebrow}</p>
          <p className="label-caps text-graphite">{item.plate}</p>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          {item.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-graphite">
          {item.description}
        </p>

        <div className="mt-8">
          <PlaceholderImage label={item.series} tone={meta.tone} className="aspect-[16/7] w-full" />
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-b border-border py-8 sm:grid-cols-3">
          {item.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="label-caps text-graphite">{spec.label}</dt>
              <dd className="mt-2 text-sm text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {pieces.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pb-16 md:px-16">
          <h2 className="font-display text-2xl md:text-3xl">{t("page.piecesInCollection")}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pieces.map((product) => {
              const productItem = tProducts(`items.${product.slug}`, {
                returnObjects: true,
              }) as ProductItem;
              return (
                <Link key={product.slug} href={`/${locale}/products/${product.slug}`} className="group block border border-border bg-surface">
                  <PlaceholderImage
                    label={product.ref}
                    tone={product.tone}
                    className="aspect-[4/5] w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="p-5">
                    <p className="label-caps text-brass">{productItem.badge}</p>
                    <h3 className="mt-2 font-display text-lg leading-snug">{productItem.title}</h3>
                    <p className="mt-2 text-sm text-graphite">{product.dimensions}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-16">
        <div className="flex flex-col items-start justify-between gap-8 bg-ink p-10 text-surface md:flex-row md:items-center md:p-16">
          <div>
            <p className="label-caps text-brass">{t("page.ctaEyebrow")}</p>
            <h2 className="mt-3 max-w-lg font-display text-2xl md:text-3xl">
              {item.ctaLabel}
            </h2>
          </div>
          <a
            href={whatsappHref(t("page.collectionInquiryMessage", { title: item.title }))}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps flex-shrink-0 bg-brass px-8 py-4 text-center text-ink"
          >
            {t("page.commissionSpecs")}
          </a>
        </div>
      </section>
    </>
  );
}
