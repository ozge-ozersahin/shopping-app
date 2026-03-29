import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';

import { getCart } from '@/src/api/cart';
import { useCartContext } from '@/src/context/CartContext';
import type { Cart, CartItem } from '@/src/types/cart';
import {
  updateCartItem,
  removeCartItem,
  checkoutCart,
  applyDiscount,
} from '@/src/api/cart';

export default function CartScreen() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const { cartId, clearCart, setLastOrder } = useCartContext();

  useFocusEffect(
    useCallback(() => {
      async function loadCart() {
        try {
          setLoading(true);
          setError('');

          // If there is no active cart yet, show empty cart state
          if (!cartId) {
            setCart(null);
            return;
          }

          // Load the latest cart data whenever this screen becomes active
          const cartData = await getCart(cartId);
          setCart(cartData);
        } catch (err: any) {
          const message = String(err?.message || '').toLowerCase();

            // If the backend says the cart expired, clear local cart state too
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

  const handleUpdate = async (productId: number, quantity: number) => {
    // Prevent invalid quantity updates
    if (!cartId || quantity < 1) return;

    try {
      const updated = await updateCartItem(cartId, productId, quantity);
      setCart(updated);
      setError('');

      // Reset discount UI after cart changes
      setDiscountApplied(false);
      setDiscountCode('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (productId: number) => {
    if (!cartId) return;

    try {
      const updated = await removeCartItem(cartId, productId);
      setCart(updated);
      setError('');

      // Reset discount UI after cart changes
      setDiscountApplied(false);
      setDiscountCode('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    if (!cartId) return;

    try {
      const result = await checkoutCart(cartId);

      // Store the completed order so it can be shown on the summary screen
      setLastOrder(result.order);

       // Clear active cart after successful checkout
      clearCart();
      setCart(null);
      setError('');
      setDiscountApplied(false);
      setDiscountCode('');
      router.push('/order-summary');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApplyDiscount = async () => {
    if (!cartId || !discountCode.trim()) return;

    try {
      const updatedCart = await applyDiscount(cartId, discountCode.trim());
      setCart(updatedCart);
      setError('');
      setDiscountApplied(true);
    } catch (err: any) {
      setDiscountApplied(false);
      setError(err.message);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.itemCard}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>£{item.price.toFixed(2)}</Text>
        <Text style={styles.itemText}>Qty: {item.quantity}</Text>

        <View style={styles.itemActions}>
          <Text onPress={() => handleUpdate(item.productId, item.quantity - 1)}>
            -
          </Text>
          <Text onPress={() => handleUpdate(item.productId, item.quantity + 1)}>
            +
          </Text>
          <Text onPress={() => handleRemove(item.productId)}>Remove</Text>
        </View>
      </View>
    );
  };

  // Show loading state while cart data is being fetched
  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text>Loading cart...</Text>
      </View>
    );
  }

  // Show full-page error only when there is no cart to display
  if (error && !cart) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Show empty state when cart does not exist or has no items
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

      <View style={styles.discountBanner}>
        <Text style={styles.discountBannerText}>
          Apply SAVE10 for 10% off orders over £100
        </Text>
      </View>
      {/* Simple hint to make the seeded discount easier to discover */}
      <View style={styles.discountSection}>
        <Text>Discount code</Text>

        <TextInput
          value={discountCode}
          onChangeText={(text) => {
            setDiscountCode(text);
            setDiscountApplied(false);
          }}
          placeholder="Enter code"
          style={styles.input}
        />

        <Pressable
          style={({ pressed }) => [
            styles.applyButton,
            pressed && styles.applyButtonPressed,
          ]}
          onPress={handleApplyDiscount}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </Pressable>

        {discountApplied && (
          <Text style={styles.successText}>Your discount has been applied.</Text>
        )}
      </View>

      <Text>Subtotal: £{cart.subtotal.toFixed(2)}</Text>

      {cart.discount > 0 && (
        <Text>Discount: £{cart.discount.toFixed(2)}</Text>
      )}

      <Text style={styles.totalText}>Total: £{cart.total.toFixed(2)}</Text>

      <Text onPress={handleCheckout} style={styles.checkoutText}>
        Checkout
      </Text>
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
  itemActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
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
  discountBanner: {
    backgroundColor: '#f2f8ff',
    borderWidth: 1,
    borderColor: '#cfe3ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  discountBannerText: {
    color: '#1d4ed8',
    fontWeight: '500',
    textAlign: 'center',
  },
  discountSection: {
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonPressed: {
    opacity: 0.8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  successText: {
    color: 'green',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  totalText: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  checkoutText: {
    marginTop: 20,
  },
});