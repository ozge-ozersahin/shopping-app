import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { addItemToCart, createCart } from '@/src/api/cart';
import { getProducts } from '@/src/api/products';
import ProductCard from '@/src/components/ProductCard';
import { useCartContext } from '@/src/context/CartContext';
import type { Product } from '@/src/types/product';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { cartId, setCartId, clearCart } = useCartContext();

  useFocusEffect(
    useCallback(() => {
      async function loadInitialData() {
        try {
          setLoading(true);
          setError('');
  
          const productsData = await getProducts();
          setProducts(productsData);
        } catch (err) {
          console.log('PRODUCTS FETCH ERROR', err);
          setError('Could not load products.');
          setLoading(false);
          return;
        }
  
        try {
          if (!cartId) {
            const cartData = await createCart();
            setCartId(cartData.id);
          }
        } catch (err) {
          console.log('CREATE CART ERROR', err);
          setError('Could not create cart session.');
        } finally {
          setLoading(false);
        }
      }
  
      loadInitialData();
    }, [cartId, setCartId])
  );

  const handleAddToCart = async (productId: number, quantity: number) => {
    try {
      let currentCartId = cartId;
  
      if (!currentCartId) {
        const newCart = await createCart();
        currentCartId = newCart.id;
        setCartId(newCart.id);
      }
  
      await addItemToCart(currentCartId, productId, quantity);
  
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
  
      setError('');
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase();
  
      if (message.includes('expired')) {
        clearCart();
        setError('Your session has expired. Please start again.');
      } else if (message.includes('stock')) {
        setError('There is no more stock for this product.');
      } else {
        setError('Could not add item to cart.');
      }
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return <ProductCard product={item} onAddToCart={handleAddToCart} />;
  };

  const getProductKey = (item: Product) => item.id.toString();

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text style={styles.message}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <FlatList
        data={products}
        keyExtractor={getProductKey}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>No products found.</Text>}
        contentContainerStyle={products.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  message: {
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});