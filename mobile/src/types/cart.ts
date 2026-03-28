export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: number;
  updatedAt: number;
}