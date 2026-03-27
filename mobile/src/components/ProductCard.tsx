import {
  Pressable,
  StyleSheet,
  Text,
  type PressableStateCallbackType,
} from 'react-native';

import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
};

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const getPressableStyle = ({ pressed }: PressableStateCallbackType) => [
    styles.card,
    pressed && styles.cardPressed,
  ];

  return (
    <Pressable style={getPressableStyle} onPress={onPress}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text>Price: £{product.price}</Text>
      <Text>Category: {product.category}</Text>
      <Text>Stock: {product.stock}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.5,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});