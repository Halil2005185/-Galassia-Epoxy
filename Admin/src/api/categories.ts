import apiClient from "./client";
import type { Category, LocalizedText } from "../types";

export type CategoryPayload = {
  name: LocalizedText;
  slug: string;
};

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await apiClient.get<Category>(`/categories/slug/${slug}`);
  return data;
}

export async function addCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await apiClient.post<Category>("/categories/add-category", payload);
  return data;
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>
): Promise<Category> {
  const { data } = await apiClient.put<Category>(`/categories/update-category/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/delete-category/${id}`);
}
