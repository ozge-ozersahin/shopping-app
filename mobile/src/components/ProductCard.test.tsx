import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import ProductCard from './ProductCard';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ProductCard', () => {
  const product = {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    price: 25,
    category: 'women',
    stock: 3,
    imageUrl: 'https://example.com/image.png',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information', () => {
    render(<ProductCard product={product as any} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('£25.00')).toBeTruthy();
    expect(screen.getByText('women')).toBeTruthy();
    expect(screen.getByText('Stock: 3')).toBeTruthy();
  });

  it('navigates to product detail when product info is pressed', () => {
    render(<ProductCard product={product as any} />);

    fireEvent.press(screen.getByText('Test Product'));

    expect(mockPush).toHaveBeenCalledWith('/products/1');
  });

  it('increases quantity', () => {
    render(<ProductCard product={product as any} />);

    fireEvent.press(screen.getByText('+'));

    expect(screen.getByText('2')).toBeTruthy();
  });

  it('does not decrease quantity below 1', () => {
    render(<ProductCard product={product as any} />);

    fireEvent.press(screen.getByText('-'));

    expect(screen.getByText('1')).toBeTruthy();
  });

  it('does not increase quantity above stock', () => {
    render(<ProductCard product={product as any} />);

    fireEvent.press(screen.getByText('+'));
    fireEvent.press(screen.getByText('+'));
    fireEvent.press(screen.getByText('+'));
    fireEvent.press(screen.getByText('+'));

    expect(screen.getByText('3')).toBeTruthy();
  });

  it('calls onAddToCart with product id and selected quantity', () => {
    const onAddToCart = jest.fn();

    render(<ProductCard product={product as any} onAddToCart={onAddToCart} />);

    fireEvent.press(screen.getByText('+'));
    fireEvent.press(screen.getByText('Add to cart'));

    expect(onAddToCart).toHaveBeenCalledWith(1, 2);
  });

  it('shows out of stock message when stock is 0', () => {
    render(
      <ProductCard
        product={{ ...product, stock: 0 } as any}
        onAddToCart={jest.fn()}
      />
    );

    expect(screen.getByText('Out of stock')).toBeTruthy();
  });
});