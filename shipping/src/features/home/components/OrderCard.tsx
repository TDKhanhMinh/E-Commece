import React, { useState } from 'react';
import { View, TouchableOpacity, Modal as RNModal } from 'react-native';
import { Text, Surface, useTheme, Portal, Modal, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius } from '@styles/index';
import type { Order, CargoType } from '../types/home.types';
import { formatCurrency } from '@/shared';
import { useAcceptOrder } from '../hooks';
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
  const [visible, setVisible] = useState(false);

  const feeFormatted = formatCurrency(order.codAmount);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleAccept = () => {
    hideDialog();
    acceptOrderMutation.mutate(order.deliveryId);
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
        {/* Modal xác nhận nhận đơn */}
        <RNModal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideDialog}
          statusBarTranslucent
        >
          <View className="flex-1 bg-black/50 justify-center px-6">
            <View className="bg-white rounded-[24px] p-6 shadow-2xl">
              <View
                className="w-16 h-16 rounded-full items-center justify-center self-center mb-5"
                style={[{ backgroundColor: theme.colors.primaryContainer }]}
              >
                <Icon name="truck-fast" size={32} color={theme.colors.primary} />
              </View>
              <Text variant="titleLarge" className="text-center font-bold text-gray-900 mb-2">
                Nhận chuyến hàng?
              </Text>
              <Text variant="bodyMedium" className="text-center text-gray-500 mb-6 px-2">
                Bạn sẽ là tài xế phụ trách việc lấy và giao đơn hàng này.
              </Text>

              <View className="bg-gray-50 p-4 rounded-2xl items-center mb-6 border border-gray-100">
                <Text variant="labelMedium" className="text-gray-500 mb-1 font-medium">Tổng phí thu</Text>
                <Text variant="headlineSmall" className="text-emerald-600 font-black tracking-tight">
                  {feeFormatted}
                </Text>
                <View className="bg-gray-200/60 px-3 py-1 rounded-full mt-3">
                  <Text variant="labelSmall" className="text-gray-600 font-bold">
                    Mã: #{order.orderId}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 py-4 rounded-xl items-center justify-center"
                  onPress={hideDialog}
                  activeOpacity={0.7}
                >
                  <Text variant="titleSmall" className="text-gray-600 font-bold">Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-4 rounded-xl items-center justify-center"
                  style={[{ backgroundColor: theme.colors.primary }]}
                  onPress={handleAccept}
                  activeOpacity={0.7}
                  disabled={acceptOrderMutation.isPending}
                >
                  <Text variant="titleSmall" className="text-white font-bold text-base">
                    {acceptOrderMutation.isPending ? 'Đang xử lý...' : 'Đồng ý nhận'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RNModal>

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
              <Text variant="bodyMedium" className="text-white font-bold ml-2">
                {acceptOrderMutation.isPending ? 'Đang nhận đơn...' : 'Nhận đơn'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Surface>
  );
}

