import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteMapSection, OrderDetailSection } from '../components';
import { historyService } from '../services';
import type { HistoryOrder } from '../types';
import type { HistoryStackParamList } from '../navigators';

type OrderDetailScreenProps = NativeStackScreenProps<
  HistoryStackParamList,
  'OrderDetail'
>;

export const OrderDetailScreen = ({
  route,
  navigation,
}: OrderDetailScreenProps) => {
  const theme = useTheme();
  const { orderId } = route.params;
  const [order, setOrder] = useState<HistoryOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orderData = await historyService.getOrderDetail(orderId);
        setOrder(orderData);
        
        // Update header with order ID
        navigation.setOptions({
          title: orderData.trackingNumber,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigation]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text>{error || 'Không tìm thấy đơn hàng'}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Route Map Section */}
      <RouteMapSection order={order} />

      {/* Order Details Section */}
      <OrderDetailSection order={order} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
