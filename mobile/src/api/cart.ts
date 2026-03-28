import { API_BASE_URL } from '../constants/config';
import type { Cart } from '../types/cart';

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const errorData = await response.json();
    return errorData.message || fallback;
  } catch {
    return fallback;
  }
}

export async function createCart(): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
  });

  if (!response.ok) {
    const message = await getErrorMessage(response, 'Failed to create cart');
    throw new Error(message);
  }

  const data: Cart = await response.json();
  return data;
}

export async function getCart(cartId: number): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart/${cartId}`);

  if (!response.ok) {
    const message = await getErrorMessage(response, 'Failed to fetch cart');
    throw new Error(message);
  }

  const data: Cart = await response.json();
  return data;
}

export async function addItemToCart(
  cartId: number,
  productId: number,
  quantity: number
): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart/${cartId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    const message = await getErrorMessage(response, 'Failed to add item to cart');
    throw new Error(message);
  }

  const data: Cart = await response.json();
  return data;
}