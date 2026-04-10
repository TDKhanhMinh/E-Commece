import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ActivityIndicator, Text, Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteMapSection, OrderDetailSection } from '../components';
import type { HistoryStackParamList } from '../navigators';
import { useDeliveryDetails } from '../hooks/useOrderHistory';

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
  const { data, isLoading, error } = useDeliveryDetails(orderId);

  const order = data?.data || data || null;

  useEffect(() => {
    if (order) {
      navigation.setOptions({
        title: order.trackingNumber || `Đơn hàng #${order.orderId || order.deliveryId}`,
      });
    }
  }, [order, navigation]);

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Text>{error instanceof Error ? error.message : 'Không tìm thấy đơn hàng'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView className="flex-1">
        <View className="items-start px-2 pt-2">
          <Button
            icon="arrow-left"
            mode="text"
            onPress={() => navigation.goBack()}
          >
            Quay lại
          </Button>
        </View>


        <OrderDetailSection order={order} />
      </ScrollView>
    </SafeAreaView>
  );
};

