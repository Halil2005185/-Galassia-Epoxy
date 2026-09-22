export type LocalizedText = {
  ar: string;
  en: string;
  tr: string;
};

export type ProductImage = {
  key: string;
  url: string;
};

export type Category = {
  _id: string;
  name: LocalizedText;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  images: ProductImage[];
  // Populated (an object) on list/detail responses from the backend.
  category: Category | string;
  createdAt: string;
  updatedAt: string;
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  pages: number;
};
