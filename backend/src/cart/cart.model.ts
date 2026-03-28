export type CartItem = {
  productId: number;
  quantity: number;
};

export type Cart = {
  id: number;
  items: CartItem[];
  createdAt: number;
  updatedAt: number;
};

export type CartSummaryItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type CartResponse = {
  id: number;
  items: CartSummaryItem[];
  totalItems: number;
  subtotal: number;
  createdAt: number;
  updatedAt: number;
};