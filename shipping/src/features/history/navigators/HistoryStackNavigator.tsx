import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { HistoryListScreen, OrderDetailScreen } from '../screens';
import type { HistoryStackParamList } from './types';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export const HistoryStackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
          borderBottomWidth: 1,
          elevation: 0,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 16,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="HistoryList"
        component={HistoryListScreen}
        options={{
          title: 'Lịch sử giao hàng',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: 'Chi tiết đơn hàng',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack.Navigator>
  );
};
