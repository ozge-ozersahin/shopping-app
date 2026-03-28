import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { addItemToCart, createCart } from '@/src/api/cart';
import { getProductById } from '@/src/api/products';
import type { Product } from '@/src/types/product';
import { useCartContext } from '@/src/context/CartContext';
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);

  const { cartId, setCartId, clearCart } = useCartContext();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const productData = await getProductById(Number(id));
        setProduct(productData);

      } catch (err) {
        setError('Could not load product.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setError('');

      let currentCartId = cartId;

      if (!currentCartId) {
        const cartData = await createCart();
        currentCartId = cartData.id;
        setCartId(cartData.id);
      }

      await addItemToCart(currentCartId, product.id, quantity);
      setQuantity(1);
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase();

      if (message.includes('expired')) {
        clearCart();
        setError('Your session has expired. Please start again.');
      } else {
        setError('Could not add to cart.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!product) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            product.imageUrl ||
            'https://via.placeholder.com/400x300.png?text=Product',
        }}
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>£{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.quantityContainer}>
        <Pressable style={styles.qButton} onPress={handleDecrease}>
          <Text>-</Text>
        </Pressable>

        <Text style={styles.qty}>{quantity}</Text>

        <Pressable style={styles.qButton} onPress={handleIncrease}>
          <Text>+</Text>
        </Pressable>
      </View>

      <Pressable style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addText}>Add to cart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 240, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '600' },
  price: { fontSize: 18, marginBottom: 8 },
  description: { marginBottom: 20 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
  qty: {
    marginHorizontal: 20,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
  },
});