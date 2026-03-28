export interface CartItem {
    productId: number;
    quantity: number;
  }
  
  export interface Cart {
    id: number;
    items: CartItem[];
    createdAt: number;
    updatedAt: number;
  }