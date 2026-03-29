import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import CategoryCard from '@/src/components/CategoryCard';
import { categories, type CategoryOption } from '@/src/constants/categories';

export default function CategoriesScreen() {
  const renderCategory = ({ item }: { item: CategoryOption }) => {
    return (
      <CategoryCard
        category={item}
        onPress={() =>
          router.push({
            pathname: '/products/category/[category]',
            params: { category: item.id },
          })
        }
      />
    );
  };

  const getCategoryKey = (item: CategoryOption) => item.id;
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>

      <FlatList<CategoryOption>
        data={categories}
        keyExtractor={getCategoryKey}
        renderItem={renderCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
});