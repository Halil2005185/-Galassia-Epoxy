export type Tone = "olive" | "emerald" | "geode" | "amber" | "onyx" | "walnut";

export type CollectionMeta = {
  slug: string;
  tone: Tone;
};

export const collections: CollectionMeta[] = [
  { slug: "dining-river-tables", tone: "olive" },
  { slug: "serving-trays-boards", tone: "emerald" },
  { slug: "wall-art-geodes", tone: "geode" },
  { slug: "home-bar-accents", tone: "amber" },
];

export type ProductMeta = {
  slug: string;
  categorySlug: string;
  ref: string;
  dimensions: string;
  tone: Tone;
};

export const products: ProductMeta[] = [
  { slug: "aethel-river-dining-table", categorySlug: "dining-river-tables", ref: "No. 018 / 2024", dimensions: "320 × 110 cm", tone: "olive" },
  { slug: "emerald-gold-vein-board", categorySlug: "serving-trays-boards", ref: "EPX-TR-042", dimensions: "52 × 28 cm", tone: "emerald" },
  { slug: "celestial-geode-wall-sculpture", categorySlug: "wall-art-geodes", ref: "No. 072 / 2024", dimensions: "180 × 120 cm", tone: "geode" },
  { slug: "amber-brass-rim-coaster-set", categorySlug: "home-bar-accents", ref: "Set of 4", dimensions: "Ø 11 cm", tone: "amber" },
  { slug: "galactic-drift-walnut-table", categorySlug: "dining-river-tables", ref: "Customizable Dimensions", dimensions: "140 × 80 cm", tone: "walnut" },
  { slug: "imperial-onyx-serving-platter", categorySlug: "serving-trays-boards", ref: "Batch 04", dimensions: "65 × 28 cm", tone: "onyx" },
];

export function getProductMeta(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCollectionMeta(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export const WHATSAPP_NUMBER = "905359285805";

export function whatsappHref(message: string, imageUrl?: string) {
  // wa.me can't attach a file directly — appending the image URL lets
  // WhatsApp unfurl it into a link preview inside the pre-filled message.
  const fullMessage = imageUrl ? `${message}\n${imageUrl}` : message;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
}
