import React, { createContext, useContext, useState } from 'react';
import type { Cart } from '@/src/types/cart';

type CartContextType = {
  cartId: number | null;
  setCartId: (id: number | null) => void;
  clearCart: () => void;
  lastOrder: Cart | null;
  setLastOrder: (order: Cart | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<number | null>(null);
  const [lastOrder, setLastOrder] = useState<Cart | null>(null);

  // Clear the active cart when the session expires or checkout completes
  const clearCart = () => {
    setCartId(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        setCartId,
        clearCart,
        lastOrder,
        setLastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  // Guard against using the context outside the provider
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
}