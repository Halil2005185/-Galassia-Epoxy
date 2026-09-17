import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/PlaceholderImage";
import { getProductMeta, products, whatsappHref } from "@/lib/data";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, languages, type Locale } from "@/lib/i18n/settings";

export function generateStaticParams() {
  return languages.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug }))
  );
}

type ProductItem = {
  category: string;
  badge: string;
  title: string;
  materials: string;
  description: string;
  availability: string;
  specs: { label: string; value: string }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lng: Locale = isValidLocale(locale) ? locale : "tr";
  const meta = getProductMeta(slug);
  if (!meta) return { title: "Piece Not Found" };
  const { t } = await getTranslation(lng, "products");
  const item = t(`items.${slug}`, { returnObjects: true }) as ProductItem;
  return { title: `${item.title} | Galassia Epoxy Design` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const meta = getProductMeta(slug);
  if (!meta) notFound();

  const { t } = await getTranslation(locale, "products");
  const { t: tCommon } = await getTranslation(locale, "common");
  const item = t(`items.${slug}`, { returnObjects: true }) as ProductItem;

  const related = products
    .filter((p) => p.categorySlug === meta.categorySlug && p.slug !== meta.slug)
    .concat(products.filter((p) => p.slug !== meta.slug))
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pt-6 md:px-16">
        <nav className="text-xs text-graphite">
          <Link href={`/${locale}`} className="hover:text-ink">{tCommon("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/products`} className="hover:text-ink">{t("page.breadcrumbProducts")}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{item.category}</span>
          <span className="mx-2">/</span>
          <span className="text-ink">{item.title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative">
              <PlaceholderImage
                label={t("page.pieceRef", { ref: meta.ref })}
                tone={meta.tone}
                className="aspect-[4/3] w-full"
              />
              <span className="label-caps absolute bottom-3 right-3 bg-ink px-3 py-1 text-surface">
                {t("page.certifiedOriginal")}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[t("page.mirrorPolish"), t("page.organicGrain"), t("page.detailLabel")].map((label) => (
                <div key={label}>
                  <PlaceholderImage label={label} tone={meta.tone} className="aspect-square w-full" />
                  <p className="label-caps mt-2 text-center text-graphite">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-ink">
                  &#10003;
                </span>
                <p className="text-sm text-graphite">{t("page.handcraftedCheck")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-ink">
                  &#10003;
                </span>
                <p className="text-sm text-graphite">{t("page.foodSafeCheck")}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="label-caps text-brass">{item.category}</p>
            <span className="label-caps ml-2 border border-border px-2 py-1 align-middle text-graphite">
              {item.badge}
            </span>
            <h1 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
              {item.title}
            </h1>
            <div className="mt-4 h-px w-16 bg-brass" />
            <p className="mt-4 text-sm leading-6 text-graphite">
              {item.description}
            </p>

            <div className="mt-6 flex items-start gap-2 border border-border p-4">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 bg-brass" />
              <div>
                <p className="text-sm text-ink">
                  {t("page.availableRef", { ref: meta.ref })}
                </p>
                <p className="mt-1 text-xs leading-5 text-graphite">
                  {item.availability}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappHref(`Hi Galassia, I'd like to order / inquire about the ${item.title} (${meta.ref}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary label-caps"
              >
                {t("page.sendOrder")}
              </a>
              <a
                href={whatsappHref(`Hi Galassia, I'd like to request a custom size or colorway for the ${item.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary label-caps"
              >
                {t("page.requestCustom")}
              </a>
            </div>
            <p className="mt-3 text-xs text-graphite">
              {t("page.responseTime")}
            </p>

            <dl className="mt-8 divide-y divide-border border-t border-border">
              {item.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="label-caps text-graphite">{spec.label}</dt>
                  <dd className="text-right text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
          <p className="label-caps text-brass">{t("page.metamorphosisEyebrow")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            {t("page.metamorphosisTitle")}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-graphite">
            {t("page.metamorphosisDescription")}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="border border-border p-6">
              <p className="label-caps text-brass">{t("page.step1Badge")}</p>
              <h3 className="mt-2 font-display text-lg">{t("page.step1Title")}</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">{t("page.step1Body")}</p>
            </div>
            <div className="border border-border p-6">
              <p className="label-caps text-brass">{t("page.step2Badge")}</p>
              <h3 className="mt-2 font-display text-lg">{t("page.step2Title")}</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">{t("page.step2Body")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-caps text-brass">{t("page.pairingsEyebrow")}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {t("page.pairingsTitle")}
            </h2>
          </div>
          <Link href={`/${locale}/products`} className="link-arrow label-caps hidden sm:inline-flex">
            <span>{t("page.viewFullCatalog")}</span>
            <span>&rarr;</span>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {related.map((relatedMeta) => {
            const relatedItem = t(`items.${relatedMeta.slug}`, { returnObjects: true }) as ProductItem;
            return (
              <Link key={relatedMeta.slug} href={`/${locale}/products/${relatedMeta.slug}`} className="group block border border-border">
                <PlaceholderImage
                  label={relatedItem.category}
                  tone={relatedMeta.tone}
                  className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-5">
                  <p className="label-caps text-brass">{relatedItem.badge}</p>
                  <h3 className="mt-2 font-display text-lg leading-snug">{relatedItem.title}</h3>
                  <p className="mt-2 text-sm text-graphite">{relatedMeta.dimensions}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
