// Internal cart item stored in memory
export type CartItem = {
  productId: number;
  quantity: number;
};

// Internal cart structure used by the backend
export type Cart = {
  id: number;
  items: CartItem[];
  createdAt: number;
  updatedAt: number;
  discountCode?: string;
};

// Enriched item returned to the client (includes product details)
export type CartSummaryItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

// Final response returned to the frontend
export type CartResponse = {
  id: number;
  items: CartSummaryItem[];
  totalItems: number;
  subtotal: number;
  createdAt: number;
  updatedAt: number;
  discount: number;
  total: number;
};