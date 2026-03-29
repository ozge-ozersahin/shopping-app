import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { addItemToCart, createCart } from '@/src/api/cart';
import { getProducts } from '@/src/api/products';
import ProductCard from '@/src/components/ProductCard';
import { useCartContext } from '@/src/context/CartContext';
import type { Product } from '@/src/types/product';

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

          // Load the latest product list whenever the screen becomes active
          const productsData = await getProducts();
          setProducts(productsData);

          // Create a cart session if the user does not already have one
          if (!cartId) {
            const cartData = await createCart();
            setCartId(cartData.id);
          }
        } catch (err: any) {
          const message = String(err?.message || '').toLowerCase();

          if (message.includes('cart')) {
            setError('Could not create cart session.');
          } else {
            setError('Could not load products.');
          }
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

      // If there is no active cart, create one before adding the item
      if (!currentCartId) {
        const newCart = await createCart();
        currentCartId = newCart.id;
        setCartId(newCart.id);
      }

      await addItemToCart(currentCartId, productId, quantity);

      // Refresh products so stock values stay up to date in the UI
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

  // Use product id as a stable key for the list
  const getProductKey = (item: Product) => item.id.toString();

  // Full-page loading state while products are being fetched
  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text style={styles.message}>Loading products...</Text>
      </View>
    );
  }

  // Full-page error only when products could not be loaded at all
  if (!loading && error && products.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      {/* Keep products visible and show inline feedback for cart/add errors */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={products}
        keyExtractor={getProductKey}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={styles.message}>No products found.</Text>}
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
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});