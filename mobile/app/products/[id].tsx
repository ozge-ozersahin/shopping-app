import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { addItemToCart, createCart } from '@/src/api/cart';
import { getProductById } from '@/src/api/products';
import { useCartContext } from '@/src/context/CartContext';
import type { Product } from '@/src/types/product';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addPressed, setAddPressed] = useState(false);

  const { cartId, setCartId, clearCart } = useCartContext();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        // Load the selected product details
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
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    // Prevent selecting more than available stock
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setError('');

      let currentCartId = cartId;

      // Create a cart session first if one does not already exist
      if (!currentCartId) {
        const cartData = await createCart();
        currentCartId = cartData.id;
        setCartId(cartData.id);
      }

      await addItemToCart(currentCartId, product.id, quantity);

      Alert.alert('Success', 'Product added to cart.');
      setQuantity(1);
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase();

      if (message.includes('expired')) {
        clearCart();
        setError('Your session has expired. Please start again.');
      } else if (message.includes('stock')) {
        setError('There is not enough stock for this product.');
      } else {
        setError('Could not add to cart.');
      }
    }
  };

  // Full-page loading state while product details are being fetched
  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator />
        <Text style={styles.message}>Loading product...</Text>
      </View>
    );
  }

  // Full-page error only when product details could not be loaded
  if (!loading && error && !product) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.message}>Product not found.</Text>
      </View>
    );
  }

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
      <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
      <Text style={styles.stockText}>In stock: {product.stock}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Keep the screen visible and show cart/session errors inline */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.quantityContainer}>
        <Pressable style={styles.qButton} onPress={handleDecrease}>
          <Text>-</Text>
        </Pressable>

        <Text style={styles.qty}>{quantity}</Text>

        <Pressable style={styles.qButton} onPress={handleIncrease}>
          <Text>+</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.addButton, addPressed && styles.addButtonPressed]}
        onPressIn={() => setAddPressed(true)}
        onPressOut={() => setAddPressed(false)}
        onPress={handleAddToCart}
      >
        <Text style={styles.addText}>Add to cart</Text>
      </Pressable>
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
  image: {
    width: '100%',
    height: 240,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    marginBottom: 8,
  },
  stockText: {
    marginBottom: 8,
    color: '#444',
  },
  description: {
    marginBottom: 20,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
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
  addButtonPressed: {
    opacity: 0.8,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
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
});