import { API_BASE_URL } from '../constants/config';
import type { Category } from '../types/category';
import type { Product } from '../types/product';

export async function getProducts(category?: Category): Promise<Product[]> {
  const url = category
    ? `${API_BASE_URL}/products?category=${category}`
    : `${API_BASE_URL}/products`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data: Product[] = await response.json();
  return data;
}

export async function getProductById(productId: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  const data: Product = await response.json();
  return data;
}
