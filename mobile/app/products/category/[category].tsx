import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { addItemToCart, createCart } from '@/src/api/cart';
import { getProducts } from '@/src/api/products';
import ProductCard from '@/src/components/ProductCard';
import { useCartContext } from '@/src/context/CartContext';
import type { Category } from '@/src/types/category';
import type { Product } from '@/src/types/product';

export default function CategoryProductsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { cartId, setCartId, clearCart } = useCartContext();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        // Load products for the selected category
        const data = await getProducts(category as Category);
        setProducts(data);
      } catch (err) {
        setError('Could not load products for this category.');
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      loadProducts();
    }
  }, [category]);

  const handleAddToCart = async (productId: number, quantity: number): Promise<boolean> => {
    try {
      let currentCartId = cartId;

      if (!currentCartId) {
        const cartData = await createCart();
        currentCartId = cartData.id;
        setCartId(cartData.id);
      }

      await addItemToCart(currentCartId, productId, quantity);

      const updatedProducts = await getProducts(category as Category);
      setProducts(updatedProducts);

      setError('');
      return true; 
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

      return false; 
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return <ProductCard product={item} onAddToCart={handleAddToCart} />;
  };

  // Use product id as a stable key for the list
  const getProductKey = (item: Product) => item.id.toString();

  // Full-page loading state while category products are being fetched
  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text style={styles.message}>Loading products...</Text>
      </View>
    );
  }

  // Full-page error only when category products could not be loaded at all
  if (!loading && error && products.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `${category} Products` }} />

      <View style={styles.container}>
        <Text style={styles.title}>{category} products</Text>

        {/* Keep the list visible and show action errors inline */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <FlatList
          data={products}
          keyExtractor={getProductKey}
          renderItem={renderProduct}
          ListEmptyComponent={
            <Text style={styles.message}>No products found for this category.</Text>
          }
          contentContainerStyle={
            products.length === 0 ? styles.emptyList : styles.listContent
          }
        />
      </View>
    </>
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
    textTransform: 'capitalize',
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
  listContent: {
    paddingBottom: 24,
  },
});