import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import HeroCrossfade from "@/components/HeroCrossfade";
import { collections, whatsappHref } from "@/lib/data";
import { getProducts } from "@/lib/api/products";
import type { Category, Product } from "@/lib/api/types";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, type Locale } from "@/lib/i18n/settings";
import { notFound } from "next/navigation";

type Stat = { value: string; label: string };
type Step = { number: string; title: string; body: string };

function categoryLabel(category: Category | string, locale: Locale) {
  if (typeof category === "string") return category;
  return category.name[locale];
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t } = await getTranslation(locale, "home");
  const { t: tCategories } = await getTranslation(locale, "categories");
  const { t: tActions } = await getTranslation(locale, "common");

  const stats = t("hero.stats", { returnObjects: true }) as Stat[];
  const steps = t("philosophy.steps", { returnObjects: true }) as Step[];

  let masterworks: Product[] = [];
  try {
    const response = await getProducts(1, 6);
    masterworks = response.products;
  } catch {
    masterworks = [];
  }

  const heroImages = masterworks
    .flatMap((product) => product.images.map((image) => image.url))
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-12 md:px-16 md:pt-20">
        <p className="label-caps text-brass">{t("hero.eyebrow")}</p>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <h1 className="font-display text-4xl leading-[1.1] md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-graphite">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${locale}/products`} className="btn-primary label-caps">
                {t("hero.exploreCatalog")}
              </Link>
              <a
                href={whatsappHref(t("hero.inquireWhatsapp"))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary label-caps"
              >
                {t("hero.inquireWhatsapp")}
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 divide-x divide-border border border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-4 text-center">
                  <p className="font-display text-xl">{stat.value}</p>
                  <p className="label-caps mt-1 text-graphite">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            {heroImages.length > 0 ? (
              <HeroCrossfade images={heroImages} alt={t("hero.imageCaption")} />
            ) : (
              <PlaceholderImage
                label={t("hero.imageCaption")}
                tone="olive"
                className="aspect-[4/3] w-full"
              />
            )}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-caps text-brass">{t("collections.eyebrow")}</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                {t("collections.title")}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-graphite">
              {t("collections.description")}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => {
              const item = tCategories(`items.${collection.slug}`, {
                returnObjects: true,
              }) as { title: string; series: string };
              return (
                <Link
                  key={collection.slug}
                  href={`/${locale}/categories/${collection.slug}`}
                  className="group block border border-border bg-surface"
                >
                  <PlaceholderImage
                    label={item.series}
                    tone={collection.tone}
                    className="aspect-[4/5] w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-lg leading-snug">
                      {item.title}
                    </h3>
                    <span className="link-arrow label-caps mt-4">
                      <span>{tActions("actions.viewCollection")}</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Masterwork Creations */}
      {masterworks.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-16 text-center md:px-16">
            <p className="label-caps text-brass">{t("masterworks.eyebrow")}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {t("masterworks.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-graphite">
              {t("masterworks.description")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
              {masterworks.slice(0, 3).map((product) => {
                const title = product.name[locale];
                const cover = product.images[0];
                return (
                  <div key={product._id} className="border border-border">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover.url} alt={title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="label-caps text-graphite">{title}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="label-caps text-brass">{categoryLabel(product.category, locale)}</p>
                      <h3 className="mt-2 font-display text-lg leading-snug">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-graphite">
                        {product.description[locale]}
                      </p>
                      <div className="mt-5 flex gap-3">
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          className="label-caps flex-1 border border-ink px-4 py-3 text-center transition-colors hover:bg-ink hover:text-surface"
                        >
                          {tActions("actions.viewDetails")}
                        </Link>
                        <a
                          href={whatsappHref(t("masterworks.whatsappMessage", { title }))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label-caps flex-1 bg-ink px-4 py-3 text-center text-surface"
                        >
                          {tActions("actions.whatsappInquire")}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-16 md:px-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="label-caps text-brass">{t("philosophy.eyebrow")}</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              {t("philosophy.title")}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-graphite">
              {t("philosophy.description")}
            </p>
            <div className="mt-8 space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4 border-t border-border pt-6">
                  <span className="label-caps text-brass">{step.number}</span>
                  <div>
                    <h3 className="font-display text-lg">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-graphite">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <PlaceholderImage
              label={t("philosophy.imageCaption")}
              tone="walnut"
              className="aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-16">
        <div className="flex flex-col items-start justify-between gap-8 bg-ink p-10 text-surface md:flex-row md:items-center md:p-16">
          <div>
            <p className="label-caps text-brass">{t("cta.eyebrow")}</p>
            <h2 className="mt-3 max-w-lg font-display text-2xl md:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-surface/70">
              {t("cta.description")}
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref(t("cta.startDiscussion"))}
              target="_blank"
              rel="noopener noreferrer"
              className="label-caps bg-brass px-8 py-4 text-center text-ink"
            >
              {t("cta.startDiscussion")}
            </a>
            <Link
              href={`/${locale}/contact`}
              className="label-caps border border-surface px-8 py-4 text-center text-surface transition-colors hover:bg-surface hover:text-ink"
            >
              {t("cta.requestBrief")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
