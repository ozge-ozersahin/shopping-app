import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Category } from '../types/category';

type CategoryCardProps = {
  category: {
    id: Category;
    title: string;
    image: string;
  };
  onPress: () => void;
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: category.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{category.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});