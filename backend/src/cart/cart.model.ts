import type { CartItem } from './cart-item.model';

export interface Cart {
  id: number;
  items: CartItem[];
  createdAt: number;
  updatedAt: number;
}