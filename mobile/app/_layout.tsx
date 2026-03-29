import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CartProvider } from '@/src/context/CartContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    // Provide cart state to the whole app
    <CartProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="products/[id]"
            options={{ title: 'Product Detail' }}
          />
          <Stack.Screen
            name="products/category/[category]"
            options={{ title: 'Category Products' }}
          />
          <Stack.Screen
            name="order-summary"
            options={{ title: 'Order Summary' }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}