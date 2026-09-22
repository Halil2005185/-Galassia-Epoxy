import axios from "axios";
import apiClient from "./client";
import type { Product, ProductListResponse } from "./types";

export async function getProducts(page = 1, limit = 100): Promise<ProductListResponse> {
  const { data } = await apiClient.get<ProductListResponse>("/products", {
    params: { page, limit },
  });
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<Product>(`/products/slug/${slug}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}
