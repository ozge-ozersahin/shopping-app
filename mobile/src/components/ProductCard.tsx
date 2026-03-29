import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  onAddToCart?: (productId: number, quantity: number) => Promise<boolean>;
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/products/${product.id}`);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      const success = await onAddToCart(product.id, quantity);
      if (success) {
        setQuantity(1);
        setAddedMessage(true);
        setTimeout(() => setAddedMessage(false), 2000);
      }
    }
  };

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.infoSection,
          pressed && styles.infoSectionPressed,
        ]}
        onPress={goToDetail}
      >
        <Image
          source={{
            uri:
              product.imageUrl ||
              'https://via.placeholder.com/150x100.png?text=Product',
          }}
          style={styles.image}
        />

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.stockText}>Stock: {product.stock}</Text>
      </Pressable>

      {product.stock === 0 ? (
        <Text style={styles.outOfStock}>Out of stock</Text>
      ) : (
        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleDecrease}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>

            <Text style={styles.quantityText}>{quantity}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleIncrease}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>Add to cart</Text>
          </Pressable>

          {addedMessage && (
            <Text style={styles.successText}>Added to cart.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  infoSection: {
    borderRadius: 8,
  },
  infoSectionPressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  outOfStock: {
    color: 'red',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  successText: {
    color: 'green',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});