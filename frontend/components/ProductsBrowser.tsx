"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productPageUrl, whatsappHref } from "@/lib/data";
import type { Category, Product } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/settings";

function categoryLabel(category: Category | string, locale: Locale) {
  if (typeof category === "string") return category;
  return category.name[locale];
}

function excerpt(text: string, maxLength = 110) {
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

type ProductsBrowserText = {
  searchPlaceholder: string;
  substratesLabel: string;
  substrates: string[];
  allCollections: string;
  loadError: string;
  empty: string;
  noResults: string;
  viewPiece: string;
  whatsappInquire: string;
  cardWhatsappMessage: string;
};

export default function ProductsBrowser({
  locale,
  products,
  loadError,
  t,
}: {
  locale: Locale;
  products: Product[];
  loadError: boolean;
  t: ProductsBrowserText;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const categoryTabs = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of products) {
      if (typeof product.category !== "string") {
        map.set(product.category._id, product.category.name[locale]);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products, locale]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (selectedCategoryId) {
        const categoryId = typeof product.category === "string" ? product.category : product.category._id;
        if (categoryId !== selectedCategoryId) return false;
      }
      if (query) {
        const haystack = `${product.name[locale]} ${product.description[locale]}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [products, locale, search, selectedCategoryId]);

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 md:px-16">
        <div className="flex flex-col gap-4 border border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 border border-border px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-graphite">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-graphite"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-caps text-graphite">{t.substratesLabel}</span>
            {t.substrates.map((s) => (
              <span key={s} className="label-caps border border-border px-3 py-2">
                {s}
              </span>
            ))}
          </div>
        </div>

        {products.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-6 border-b border-border pb-4 text-sm">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`label-caps pb-2 transition-colors ${
                selectedCategoryId === null ? "border-b-2 border-ink text-ink" : "text-graphite hover:text-ink"
              }`}
            >
              {t.allCollections} ({products.length})
            </button>
            {categoryTabs.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`label-caps pb-2 transition-colors ${
                  selectedCategoryId === category.id ? "border-b-2 border-ink text-ink" : "text-graphite hover:text-ink"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 md:px-16">
        {loadError ? (
          <p className="border border-border bg-surface p-8 text-center text-sm text-graphite">
            {t.loadError}
          </p>
        ) : products.length === 0 ? (
          <p className="border border-border bg-surface p-8 text-center text-sm text-graphite">
            {t.empty}
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="border border-border bg-surface p-8 text-center text-sm text-graphite">
            {t.noResults}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const title = product.name[locale];
              const cover = product.images[0];
              return (
                <article key={product._id} className="border border-border bg-surface">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        // See HeroCrossfade.tsx for why R2 images are unoptimized.
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="label-caps text-graphite">{title}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="label-caps text-brass">{categoryLabel(product.category, locale)}</p>
                    <h3 className="mt-2 font-display text-lg leading-snug">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">
                      {excerpt(product.description[locale])}
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="link-arrow label-caps"
                      >
                        <span>{t.viewPiece}</span>
                        <span>&rarr;</span>
                      </Link>
                      <a
                        href={whatsappHref(t.cardWhatsappMessage.replace("{{title}}", title), productPageUrl(locale, product.slug))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-caps ml-auto bg-ink px-4 py-2 text-surface"
                      >
                        {t.whatsappInquire}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
