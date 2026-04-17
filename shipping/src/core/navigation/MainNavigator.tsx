import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackNavigator } from '@features/home/navigators/HomeStackNavigator';
import { ShipmentsScreen } from '@features/shipping';
import { HistoryStackNavigator } from '@features/history/navigators';
import { WalletStackNavigator } from '@features/wallet/navigators/WalletStackNavigator';
import { ProfileScreen, ProfileStackNavigator } from '@features/profile';
import { OrderDetailScreen } from '@features/history/screens/OrderDetailScreen';
import type { MainTabParamList } from './types';
import { useAllShipments } from '@/features/shipping/hooks/useShipments';
import { da } from 'zod/v4/locales';

const Tab = createBottomTabNavigator<MainTabParamList>();
const OrdersStack = createNativeStackNavigator();

function OrdersStackNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="ShipmentsList" component={ShipmentsScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}


function TabIcon({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) {
  return <Icon name={name} size={size} color={color} />;
}

// ── Navigator ────────────────────────────────────────────────────────────────
export function MainNavigator() {
  const theme = useTheme();
  const { data } = useAllShipments("PICKED_UP");
  // @ts-ignore
  const totalOrder = data?.data.totalElements;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStackNavigator}
        options={{
          tabBarLabel: 'Đơn hiện có',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="package-variant" color={color} size={size} />
          ),
          tabBarBadge: totalOrder == 0 ? null : totalOrder,
          tabBarBadgeStyle: { fontSize: 10 },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: 'Lịch sử',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletStackNavigator}
        options={{
          tabBarLabel: 'Ví',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
