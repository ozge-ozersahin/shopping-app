import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen
      name="categories"
      options={{
        title: "Categories"
      }}/> 
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />
    </Tabs>
  );
}