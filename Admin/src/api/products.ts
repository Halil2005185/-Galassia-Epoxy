import apiClient from "./client";
import type { LocalizedText, Product, ProductListResponse } from "../types";

export type ProductInput = {
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  category: string;
  images: File[];
};

function buildProductFormData(input: Partial<ProductInput>): FormData {
  const formData = new FormData();

  if (input.name) formData.append("name", JSON.stringify(input.name));
  if (input.description) formData.append("description", JSON.stringify(input.description));
  if (input.slug) formData.append("slug", input.slug);
  if (input.category) formData.append("category", input.category);
  input.images?.forEach((file) => formData.append("images", file));

  return formData;
}

export async function getProducts(page = 1, limit = 10): Promise<ProductListResponse> {
  const { data } = await apiClient.get<ProductListResponse>("/products", {
    params: { page, limit },
  });
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/slug/${slug}`);
  return data;
}

export async function addProduct(input: ProductInput): Promise<Product> {
  const { data } = await apiClient.post<Product>(
    "/products/add-product",
    buildProductFormData(input)
  );
  return data;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product> {
  const { data } = await apiClient.put<Product>(
    `/products/update-product/${id}`,
    buildProductFormData(input)
  );
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/delete-product/${id}`);
}
