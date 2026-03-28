import React, { createContext, useContext, useState } from 'react';

type CartContextType = {
  cartId: number | null;
  setCartId: (id: number | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<number | null>(null);

  const clearCart = () => {
    setCartId(null);
  };

  return (
    <CartContext.Provider value={{ cartId, setCartId, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
}