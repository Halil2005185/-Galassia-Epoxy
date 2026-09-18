export type LocalizedText = {
  ar: string;
  en: string;
  tr: string;
};

export type Category = {
  id: string;
  name: LocalizedText;
  slug: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  images: string[];
  categoryId: string;
  createdAt: string;
};
