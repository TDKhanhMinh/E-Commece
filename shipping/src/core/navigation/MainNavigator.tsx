import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackNavigator } from '@features/home/navigators/HomeStackNavigator';
import { ShipmentsScreen } from '@features/shipping';
import { HistoryStackNavigator } from '@features/history/navigators';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ── Placeholder screens ──────────────────────────────────────────────────────
function EarningsScreen() {
  const theme = useTheme();
  return (
    <View style={placeholderStyles.container}>
      <Icon name="chart-bar" size={56} color={theme.colors.outlineVariant} />
      <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
        Thu nhập
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
        Tính năng đang phát triển
      </Text>
    </View>
  );
}

function WalletScreen() {
  const theme = useTheme();
  return (
    <View style={placeholderStyles.container}>
      <Icon name="wallet" size={56} color={theme.colors.outlineVariant} />
      <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
        Ví của tôi
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
        Tính năng đang phát triển
      </Text>
    </View>
  );
}

function SettingsScreen() {
  const theme = useTheme();
  return (
    <View style={placeholderStyles.container}>
      <Icon name="cog-outline" size={56} color={theme.colors.outlineVariant} />
      <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
        Cài đặt
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
        Tính năng đang phát triển
      </Text>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ── Tab bar icon helper ──────────────────────────────────────────────────────
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
        component={ShipmentsScreen}
        options={{
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="package-variant" color={color} size={size} />
          ),
          tabBarBadge: 2,
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
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: 'Thu nhập',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Ví',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
