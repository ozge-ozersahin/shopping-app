import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { getProducts } from '@/src/api/products';
import ProductCard from '@/src/components/ProductCard';
import type { Category } from '@/src/types/category';
import type { Product } from '@/src/types/product';

export default function CategoryProductsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

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

  const renderProduct = ({ item }: { item: Product }) => {
    return <ProductCard product={item} />;
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
      <Text style={styles.title}>{category} products</Text>

      <FlatList
        data={products}
        keyExtractor={getProductKey}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>No products found for this category.</Text>}
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
    textTransform: 'capitalize',
  },
  message: {
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});