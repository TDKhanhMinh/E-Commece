import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { OrderConfirmModal } from './OrderConfirmModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius } from '@styles/index';
import type { Order, CargoType } from '../types/home.types';
import { formatCurrency } from '@/shared';
import { useAcceptOrder, useCancelOrder, useDeliveryOrder } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/core';

// ── Masked phone ─────────────────────────────────────────────────────────────
function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-3);
}

// ── Main component ───────────────────────────────────────────────────────────
interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const acceptOrderMutation = useAcceptOrder();
  const deliveryOrderMutation = useDeliveryOrder();
  const cancelOrderMutation = useCancelOrder();

  const [visible, setVisible] = useState(false);

  const feeFormatted = formatCurrency(order.codAmount);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const isPickup = order.deliveryStatus === 'PICKED_UP';
  const modalTitle = isPickup ? 'Xác nhận đã lấy hàng?' : 'Nhận chuyến hàng?';
  const modalDescription = isPickup
    ? 'Bạn xác nhận đã nhận hàng từ người gửi và bắt đầu quá trình giao hàng.'
    : 'Bạn sẽ là tài xế phụ trách việc lấy và giao đơn hàng này.';
  const modalConfirmText = isPickup ? 'Xác nhận lấy hàng' : 'Đồng ý nhận';

  const handleConfirm = () => {
    hideDialog();
    if (isPickup) {
      deliveryOrderMutation.mutate(String(order.deliveryId));
    } else {
      acceptOrderMutation.mutate(String(order.deliveryId));
    }
  };

  const handleCardPress = () => {
    navigation.navigate('OrderDetail', { orderId: String(order.deliveryId) });
  };

  return (
    <Surface
      className="mx-4 mb-4 bg-white rounded-3xl overflow-hidden"
      style={[{
        elevation: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
      }]}
    >
      <TouchableOpacity activeOpacity={0.75} onPress={handleCardPress} className="p-4">
        <OrderConfirmModal
          visible={visible}
          onClose={hideDialog}
          onConfirm={handleConfirm}
          orderId={order.orderId}
          feeFormatted={feeFormatted}
          isLoading={isPickup ? deliveryOrderMutation.isPending : acceptOrderMutation.isPending}
          title={modalTitle}
          description={modalDescription}
          confirmText={modalConfirmText}
        />

        {/* ── Header: ID and Fee ── */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/50">
            <Text variant="labelSmall" className="text-gray-500 font-bold uppercase tracking-wider">
              #{order.orderId}
            </Text>
          </View>
          <View className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <Text variant="titleMedium" className="text-emerald-600 font-black tracking-tight leading-5">
              {feeFormatted}
            </Text>
          </View>
        </View>

        {/* ── Route ─── */}
        <View className="bg-gray-50/80 rounded-2xl p-3 mb-4 border border-gray-100/50">
          {/* Pickup */}
          <View className="flex-row items-center gap-3">
            <View className="w-[34px] h-[34px] rounded-full bg-blue-100 items-center justify-center">
              <Icon name="package-up" size={18} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text variant="labelSmall" className="text-blue-600 font-bold mb-0.5 uppercase">Điểm lấy hàng</Text>
              <Text variant="bodyMedium" className="text-gray-800 font-semibold leading-5" numberOfLines={1}>
                {order.pickupAddress || 'Chưa cập nhật'}
              </Text>
            </View>
          </View>

          {/* Connect Line */}
          <View className="h-[18px] border-l-[2px] border-dashed border-gray-300 ml-[16px] my-1" />

          {/* Dropoff */}
          <View className="flex-row items-center gap-3">
            <View className="w-[34px] h-[34px] rounded-full bg-rose-100 items-center justify-center">
              <Icon name="map-marker-down" size={18} color="#E11D48" />
            </View>
            <View className="flex-1">
              <Text variant="labelSmall" className="text-rose-600 font-bold mb-0.5 uppercase">Điểm giao hàng</Text>
              <Text variant="bodyMedium" className="text-gray-800 font-semibold leading-5" numberOfLines={1}>
                {order.destination}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Customer & Meta ── */}
        <View className="flex-row items-center justify-between mb-1 px-1">
          <View className="flex-row items-center gap-2.5">
            <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center border border-gray-200">
              <Icon name="account" size={18} color="#4B5563" />
            </View>
            <View>
              <Text variant="labelLarge" className="text-gray-900 font-bold">
                {order.customerName}
              </Text>
              <Text variant="bodySmall" className="text-gray-500 font-medium">
                {maskPhone(order.customerPhone)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Note ── */}
        {order.note ? (
          <View className="flex-row items-start gap-2 bg-amber-50/80 p-3 rounded-[14px] border border-amber-100 mt-3">
            <Icon name="information-outline" size={16} color="#D97706" className="mt-0.5" />
            <Text variant="bodySmall" className="text-amber-700 flex-1 font-medium leading-5">
              {order.note}
            </Text>
          </View>
        ) : null}

        {order.deliveryStatus === 'PICKED_UP' && (
          <View className="mt-4 border-t border-gray-100 pt-3">
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-[14px] py-3.5 shadow-sm"
              style={[
                { backgroundColor: theme.colors.primary },
                deliveryOrderMutation.isPending && { opacity: 0.7 }
              ]}
              onPress={showDialog}
              activeOpacity={0.85}
              disabled={deliveryOrderMutation.isPending}
            >
              <Icon name={deliveryOrderMutation.isPending ? "loading" : "truck-fast"} size={20} color="#FFF" />
              <Text style={{ color: "#FFFFFF" }} variant="bodyMedium" className="text-white font-bold ml-2">
                {deliveryOrderMutation.isPending ? 'Đang xử lý...' : 'Đã lấy hàng'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* ── Action Button ── */}
        {order.deliveryStatus === 'PENDING' && (
          <View className="mt-4 border-t border-gray-100 pt-3">
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-[14px] py-3.5 shadow-sm"
              style={[
                { backgroundColor: theme.colors.primary },
                acceptOrderMutation.isPending && { opacity: 0.7 }
              ]}
              onPress={showDialog}
              activeOpacity={0.85}
              disabled={acceptOrderMutation.isPending}
            >
              <Icon name={acceptOrderMutation.isPending ? "loading" : "truck-fast"} size={20} color="#FFF" />
              <Text style={{ color: "#FFFFFF" }} variant="bodyMedium" className="text-white font-bold ml-2">
                {acceptOrderMutation.isPending ? 'Đang nhận đơn...' : 'Nhận đơn'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Surface>
  );
}

