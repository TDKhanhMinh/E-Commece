import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Surface, useTheme, Snackbar } from 'react-native-paper';
import { OrderConfirmModal } from './OrderConfirmModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius } from '@styles/index';
import type { Order, CargoType } from '../types/home.types';
import { formatCurrency, formatDateTime } from '@/shared';
import { useAcceptOrder, useCancelOrder, useDeliveryOrder } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/core';

// ── Masked phone ─────────────────────────────────────────────────────────────
function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 3) + ' ••• ••• ' + phone.slice(-3); // Cách điệu lại format che số điện thoại
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
  const isAnyPending = acceptOrderMutation.isPending || deliveryOrderMutation.isPending || cancelOrderMutation.isPending;

  const [visible, setVisible] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const shippingFeeFormatted = order.shippingCost
    ? formatCurrency(parseFloat(order.shippingCost))
    : formatCurrency(0);
  const codFormatted = formatCurrency(order.codAmount);

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
    const mutation = isPickup ? deliveryOrderMutation : acceptOrderMutation;
    const successMsg = isPickup ? 'Đã xác nhận lấy hàng thành công' : 'Đã nhận đơn hàng thành công';

    mutation.mutate(String(order.deliveryId), {
      onSuccess: () => {
        setSnackbar({
          visible: true,
          message: successMsg,
          type: 'success'
        });
      },
      onError: (error: any) => {
        setSnackbar({
          visible: true,
          message: error?.message || 'Thao tác thất bại. Vui lòng thử lại.',
          type: 'error'
        });
      }
    });
  };

  const handleCardPress = () => {
    navigation.navigate('OrderDetail', { orderId: String(order.deliveryId) });
  };

  return (
    <Surface
      className="mx-4 mb-5 bg-white rounded-[32px]"
      style={[{
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      }]}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={handleCardPress} className="p-5">
        <OrderConfirmModal
          visible={visible}
          onClose={hideDialog}
          onConfirm={handleConfirm}
          orderId={order.orderId}
          feeFormatted={shippingFeeFormatted}
          codFormatted={codFormatted}
          isLoading={isAnyPending}
          title={modalTitle}
          description={modalDescription}
          confirmText={modalConfirmText}
        />

        {/* ── Header: ID & Time & Shipping Fee ── */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1 mr-3">
            <View className="bg-slate-100 px-3 py-1.5 rounded-xl self-start mb-2">
              <Text variant="labelSmall" className="text-slate-700 font-bold tracking-widest">
                #{order.orderId}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="clock-outline" size={14} color="#94A3B8" />
              <Text variant="labelMedium" className="text-slate-500 font-medium ml-1.5">
                {formatDateTime(order.createdAt)}
              </Text>
            </View>
          </View>


        </View>

        {/* ── Route Section (Timeline Style) ─── */}
        <View className="mb-6">
          {/* Lấy hàng */}
          <View className="flex-row items-start">
            <View className="w-10 items-center justify-center mt-1">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-blue-600" />
              </View>
            </View>
            <View className="flex-1 ml-3 bg-slate-50 rounded-2xl p-3">
              <Text variant="labelSmall" className="text-blue-600 font-bold uppercase tracking-wide mb-1">Lấy hàng tại</Text>
              <Text variant="bodyMedium" className="text-slate-800 font-semibold" numberOfLines={2}>
                {order.pickupLocation || 'Địa điểm lấy hàng'}
              </Text>
            </View>
          </View>

          {/* Connection Line & Distance */}
          <View className="flex-row items-center ml-5 my-1 h-8">
            <View className="w-[2px] h-full bg-slate-200 border-dashed" />
            {order.distanceText && (
              <View className="bg-white px-3 py-1 rounded-full border border-slate-100 ml-5 shadow-sm flex-row items-center">
                <Icon name="map-marker-distance" size={14} color="#64748B" />
                <Text variant="labelSmall" className="text-slate-600 font-bold ml-1">{order.distanceText}</Text>
              </View>
            )}
          </View>

          {/* Giao hàng */}
          <View className="flex-row items-start">
            <View className="w-10 items-center justify-center mt-1">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
                <Icon name="map-marker" size={16} color="#EA580C" />
              </View>
            </View>
            <View className="flex-1 ml-3 bg-slate-50 rounded-2xl p-3">
              <Text variant="labelSmall" className="text-orange-600 font-bold uppercase tracking-wide mb-1">Giao hàng đến</Text>
              <Text variant="bodyMedium" className="text-slate-800 font-semibold" numberOfLines={2}>
                {order.destination}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-slate-100 w-full mb-4" />

        {/* ── Footer Info: Customer & COD ── */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center">
              <Icon name="account-outline" size={24} color="#64748B" />
            </View>
            <View className="ml-3 flex-1">
              <Text variant="titleMedium" className="text-slate-900 font-bold mb-0.5" numberOfLines={1}>
                {order.customerName}
              </Text>
              <Text variant="bodyMedium" className="text-slate-500">
                {maskPhone(order.customerPhone)}
              </Text>
            </View>
          </View>

          <View className="items-end ml-2">
            <Text variant="labelSmall" className="text-slate-400 font-semibold mb-1">THU HỘ (COD)</Text>
            <Text variant="titleMedium" className="text-slate-800 font-black">
              {codFormatted}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-6 bg-emerald-50/60 py-4 rounded-[24px] border border-emerald-100/50">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center shadow-sm">
              <Icon name="wallet-outline" size={24} color="#059669" />
            </View>
            <View className="ml-3 flex-1">
              <Text variant="titleMedium" className="text-emerald-900 font-bold mb-0.5">
                Cước phí dịch vụ
              </Text>
              <Text variant="bodySmall" className="text-emerald-600 font-medium">
                Thu nhập của tài xế
              </Text>
            </View>
          </View>

          <View className="items-end ml-2">
            <Text variant="labelSmall" className="text-emerald-600/60 font-black mb-1 uppercase tracking-tighter">Số tiền nhận</Text>
            <Text variant="titleMedium" className="text-emerald-700 font-black tracking-tighter">
              {shippingFeeFormatted}
            </Text>
          </View>
        </View>
        {/* ── Note ── */}
        {order.note ? (
          <View className="bg-amber-50/50 p-3.5 rounded-xl flex-row items-start mt-3">
            <Icon name="message-text-outline" size={18} color="#D97706" style={{ marginTop: 2 }} />
            <Text variant="bodySmall" className="text-amber-800 flex-1 ml-2 font-medium leading-5">
              {order.note}
            </Text>
          </View>
        ) : null}

        {/* ── Action Buttons ── */}
        {(order.deliveryStatus === 'PENDING' || order.deliveryStatus === 'PICKED_UP') && (
          <View className="mt-6">
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-[20px] py-4"
              style={[
                { backgroundColor: theme.colors.primary },
                isAnyPending && { opacity: 0.7 }
              ]}
              onPress={showDialog}
              activeOpacity={0.8}
              disabled={isAnyPending}
            >
              <Icon
                name={isAnyPending ? "loading" : (isPickup ? "package-variant" : "moped")}
                size={24}
                color="#FFF"
                className={isAnyPending ? "animate-spin" : ""}
              />
              <Text style={{ color: "#FFFFFF" }} variant="titleMedium" className="text-white font-bold tracking-wide ml-2">
                {isAnyPending ? 'Đang xử lý...' : (isPickup ? 'Đã lấy hàng' : 'Nhận đơn ngay')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
        duration={3000}
        style={{
          backgroundColor: snackbar.type === 'success' ? '#10B981' : '#EF4444',
          borderRadius: 12,
        }}
        action={{
          label: 'Đóng',
          onPress: () => setSnackbar(prev => ({ ...prev, visible: false })),
          textColor: '#fff'
        }}
      >
        {snackbar.message}
      </Snackbar>
    </Surface>
  );
}