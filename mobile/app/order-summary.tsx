import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useCartContext } from '@/src/context/CartContext';

export default function OrderSummaryScreen() {
  const { lastOrder } = useCartContext();

  // Show fallback state if the user opens this screen without completing checkout
  if (!lastOrder) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.emptyText}>No completed order found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <Text style={styles.successText}>Your order was placed successfully.</Text>

      <FlatList
        data={lastOrder.items}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>Price: £{item.price.toFixed(2)}</Text>
            <Text style={styles.itemText}>Qty: {item.quantity}</Text>
            <Text style={styles.itemText}>
              Line total: £{item.lineTotal.toFixed(2)}
            </Text>
          </View>
        )}
      />

      {/* Show final order totals after checkout */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Subtotal: £{lastOrder.subtotal.toFixed(2)}
        </Text>

        {lastOrder.discount > 0 && (
          <Text style={styles.summaryText}>
            Discount: £{lastOrder.discount.toFixed(2)}
          </Text>
        )}

        <Text style={styles.totalText}>
          Total paid: £{lastOrder.total.toFixed(2)}
        </Text>
      </View>
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  summaryBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 6,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  successText: {
    color: 'green',
    marginBottom: 12,
    fontWeight: '500',
  },
});