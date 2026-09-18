import type { Category, Product } from "../types";

/**
 * Placeholder data layer. The backend only has Mongoose models
 * (Product, Category) so far — no REST routes exist yet — so this
 * persists to localStorage instead of a real API. Each function's
 * signature mirrors what a fetch()-based API client would look like,
 * so swapping this for real endpoints later is a matter of replacing
 * the function bodies, not the call sites.
 */

const CATEGORIES_KEY = "galassia_admin_categories";
const PRODUCTS_KEY = "galassia_admin_products";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function makeId(): string {
  return crypto.randomUUID();
}

export function listCategories(): Category[] {
  return read<Category>(CATEGORIES_KEY).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createCategory(input: Omit<Category, "id" | "createdAt">): Category {
  const categories = read<Category>(CATEGORIES_KEY);
  if (categories.some((c) => c.slug === input.slug)) {
    throw new Error("هذا الرابط المختصر مستخدم بالفعل لفئة أخرى.");
  }
  const category: Category = { ...input, id: makeId(), createdAt: new Date().toISOString() };
  write(CATEGORIES_KEY, [...categories, category]);
  return category;
}

export function deleteCategory(id: string): void {
  write(CATEGORIES_KEY, read<Category>(CATEGORIES_KEY).filter((c) => c.id !== id));
}

export function listProducts(): Product[] {
  return read<Product>(PRODUCTS_KEY).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createProduct(input: Omit<Product, "id" | "createdAt">): Product {
  const products = read<Product>(PRODUCTS_KEY);
  if (products.some((p) => p.slug === input.slug)) {
    throw new Error("هذا الرابط المختصر مستخدم بالفعل لمنتج آخر.");
  }
  if (input.images.length < 1 || input.images.length > 5) {
    throw new Error("يجب إضافة صورة واحدة على الأقل وخمس صور كحد أقصى.");
  }
  const product: Product = { ...input, id: makeId(), createdAt: new Date().toISOString() };
  write(PRODUCTS_KEY, [...products, product]);
  return product;
}

export function deleteProduct(id: string): void {
  write(PRODUCTS_KEY, read<Product>(PRODUCTS_KEY).filter((p) => p.id !== id));
}
