import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api/products";
import { collections, siteUrl } from "@/lib/data";
import { languages, type Locale } from "@/lib/i18n/settings";

type StaticEntry = { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number };

const STATIC_ENTRIES: StaticEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const lng of languages) {
    map[lng] = `${siteUrl()}/${lng}${path}`;
  }
  return map;
}

function entryFor(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return languages.map((locale: Locale) => ({
    url: `${siteUrl()}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: languageAlternates(path) },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ENTRIES.flatMap(({ path, changeFrequency, priority }) =>
    entryFor(path, changeFrequency, priority)
  );

  for (const collection of collections) {
    entries.push(...entryFor(`/categories/${collection.slug}`, "monthly", 0.7));
  }

  try {
    const { products } = await getProducts(1, 200);
    for (const product of products) {
      entries.push(...entryFor(`/products/${product.slug}`, "weekly", 0.7));
    }
  } catch {
    // Backend unreachable at build time — ship the sitemap without product
    // URLs rather than failing the whole route.
  }

  return entries;
}
