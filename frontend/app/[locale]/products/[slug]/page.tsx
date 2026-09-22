import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api/products";
import type { Category, Product } from "@/lib/api/types";
import { whatsappHref } from "@/lib/data";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, languages, type Locale } from "@/lib/i18n/settings";

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

function categoryOf(product: Product): Category | null {
  return typeof product.category === "string" ? null : product.category;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lng: Locale = isValidLocale(locale) ? locale : "tr";
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Piece Not Found" };
  return { title: `${product.name[lng]} | Galassia Epoxy Design` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const { t } = await getTranslation(locale, "products");
  const { t: tCommon } = await getTranslation(locale, "common");

  const category = categoryOf(product);
  const title = product.name[locale];
  const description = product.description[locale];
  const [mainImage, ...restImages] = product.images;

  let related: Product[] = [];
  try {
    const { products } = await getProducts(1, 100);
    related = products
      .filter((p) => p._id !== product._id)
      .filter((p) => {
        const c = categoryOf(p);
        return category && c ? c._id === category._id : false;
      })
      .slice(0, 3);
    if (related.length === 0) {
      related = products.filter((p) => p._id !== product._id).slice(0, 3);
    }
  } catch {
    related = [];
  }

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pt-6 md:px-16">
        <nav className="text-xs text-graphite">
          <Link href={`/${locale}`} className="hover:text-ink">{tCommon("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/products`} className="hover:text-ink">{t("page.breadcrumbProducts")}</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span className="text-ink">{category.name[locale]}</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-ink">{title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
              {mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImage.url} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="label-caps text-graphite">{title}</span>
                </div>
              )}
            </div>
            {restImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {restImages.slice(0, 3).map((image) => (
                  <div key={image.key} className="aspect-square w-full overflow-hidden bg-canvas">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={title} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
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
            {category && <p className="label-caps text-brass">{category.name[locale]}</p>}
            <h1 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
              {title}
            </h1>
            <div className="mt-4 h-px w-16 bg-brass" />
            <p className="mt-4 text-sm leading-6 text-graphite">
              {description}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappHref(t("page.sendOrderMessage", { title }))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary label-caps"
              >
                {t("page.sendOrder")}
              </a>
              <a
                href={whatsappHref(t("page.requestCustomMessage", { title }))}
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

      {related.length > 0 && (
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
            {related.map((item) => {
              const itemCategory = categoryOf(item);
              const itemCover = item.images[0];
              return (
                <Link key={item._id} href={`/${locale}/products/${item.slug}`} className="group block border border-border">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
                    {itemCover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={itemCover.url}
                        alt={item.name[locale]}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="label-caps text-graphite">{item.name[locale]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {itemCategory && <p className="label-caps text-brass">{itemCategory.name[locale]}</p>}
                    <h3 className="mt-2 font-display text-lg leading-snug">{item.name[locale]}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
