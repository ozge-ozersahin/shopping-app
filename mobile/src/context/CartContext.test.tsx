import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { CartProvider, useCartContext } from './CartContext';

function TestComponent() {
  const { cartId, setCartId, clearCart, lastOrder, setLastOrder } =
    useCartContext();

  return (
    <>
      <Text testID="cartId">{cartId === null ? 'null' : String(cartId)}</Text>
      <Text testID="lastOrder">
        {lastOrder ? String(lastOrder.id) : 'null'}
      </Text>

      <Text onPress={() => setCartId(123)}>Set Cart</Text>
      <Text onPress={clearCart}>Clear Cart</Text>
      <Text
        onPress={() =>
          setLastOrder({
            id: 99,
            items: [],
            subtotal: 100,
            discount: 10,
            total: 90,
          } as any)
        }
      >
        Set Order
      </Text>
    </>
  );
}

describe('CartContext', () => {
  it('provides default values', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cartId')).toHaveTextContent('null');
    expect(screen.getByTestId('lastOrder')).toHaveTextContent('null');
  });

  it('updates cartId', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.press(screen.getByText('Set Cart'));

    expect(screen.getByTestId('cartId')).toHaveTextContent('123');
  });

  it('clears cartId', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.press(screen.getByText('Set Cart'));
    fireEvent.press(screen.getByText('Clear Cart'));

    expect(screen.getByTestId('cartId')).toHaveTextContent('null');
  });

  it('updates lastOrder', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.press(screen.getByText('Set Order'));

    expect(screen.getByTestId('lastOrder')).toHaveTextContent('99');
  });

  it('throws if used outside provider', () => {
    const BrokenComponent = () => {
      useCartContext();
      return <Text>Broken</Text>;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useCartContext must be used within a CartProvider'
    );
  });
});