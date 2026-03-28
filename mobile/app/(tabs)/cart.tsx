import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { getCart } from '@/src/api/cart';
import { useCartContext } from '@/src/context/CartContext';
import type { Cart, CartItem } from '@/src/types/cart';

export default function CartScreen() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { cartId, clearCart } = useCartContext();

  useFocusEffect(
    useCallback(() => {
      async function loadCart() {
        try {
          setLoading(true);
          setError('');

          if (!cartId) {
            setCart(null);
            return;
          }

          const cartData = await getCart(cartId);
          setCart(cartData);
        } catch (err: any) {
          const message = String(err?.message || '').toLowerCase();

          if (message.includes('expired')) {
            clearCart();
            setCart(null);
            setError('Your session has expired.');
          } else {
            setError('Could not load cart.');
          }
        } finally {
          setLoading(false);
        }
      }

      loadCart();
    }, [cartId, clearCart])
  );

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.itemCard}>
        <Text style={styles.itemText}>Product ID: {item.productId}</Text>
        <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (error && !cart) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add some products to get started.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={renderCartItem}
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
  itemCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
});