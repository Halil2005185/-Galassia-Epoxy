import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductsBrowser from "@/components/ProductsBrowser";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/types";
import { whatsappHref } from "@/lib/data";
import { getTranslation } from "@/lib/i18n/server";
import { isValidLocale, languages, type Locale } from "@/lib/i18n/settings";
import { pageAlternates, truncateDescription } from "@/lib/seo";

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
  const { t } = await getTranslation(lng, "products");
  const title = t("page.title");
  const description = truncateDescription(t("page.description"));

  return {
    title,
    description,
    alternates: pageAlternates(lng, "/products"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const { t } = await getTranslation(locale, "products");
  const { t: tActions } = await getTranslation(locale, "common");
  const substrates = t("page.substrates", { returnObjects: true }) as string[];

  let products: Product[] = [];
  let loadError = false;
  try {
    const response = await getProducts(1, 100);
    products = response.products;
  } catch {
    loadError = true;
  }

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

      <ProductsBrowser
        locale={locale}
        products={products}
        loadError={loadError}
        t={{
          searchPlaceholder: t("page.searchPlaceholder"),
          substratesLabel: t("page.substratesLabel"),
          substrates,
          allCollections: t("page.allCollections"),
          loadError: t("page.loadError"),
          empty: t("page.empty"),
          noResults: t("page.noResults"),
          viewPiece: tActions("actions.viewPiece"),
          whatsappInquire: tActions("actions.whatsappInquire"),
          cardWhatsappMessage: t("page.cardWhatsappMessage", { title: "{{title}}" }),
        }}
      />

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
          <div className="flex flex-shrink-0 flex-col gap-3 lg:flex-row">
            <a
              href={whatsappHref(t("page.initiateCommissionMessage"))}
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
