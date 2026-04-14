import React from 'react';
import { View, TouchableOpacity, Modal as RNModal } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OrderConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string | number;
  feeFormatted: string;
  codFormatted?: string;
  isLoading: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function OrderConfirmModal({
  visible,
  onClose,
  onConfirm,
  orderId,
  feeFormatted,
  codFormatted,
  isLoading,
  title,
  description,
  confirmText = 'Đồng ý nhận',
  cancelText = 'Quay lại',
}: OrderConfirmModalProps) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-center px-6">
        <View className="bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100">
          <View
            className="w-20 h-20 rounded-full items-center justify-center self-center mb-6 shadow-sm"
            style={[{ backgroundColor: theme.colors.primaryContainer }]}
          >
            <Icon name="truck-delivery" size={40} color={theme.colors.primary} />
          </View>

          <Text variant="headlineSmall" className="text-center font-black text-slate-900 mb-2">
            {title}
          </Text>
          <Text variant="bodyMedium" className="text-center text-slate-500 mb-8 px-4 leading-5">
            {description}
          </Text>

          <View className="bg-slate-50 p-5 rounded-[24px] mb-8 border border-slate-100">
            <View className="flex-row justify-between items-center mb-2 border-b border-slate-200/50 pb-3">
              <Text variant="labelLarge" className="text-slate-500 font-bold">Mã đơn hàng</Text>
              <Text variant="titleSmall" className="text-slate-900 font-black">#{orderId}</Text>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <Text variant="bodyMedium" className="text-slate-600 font-medium">Thu nhập nhận được</Text>
              <Text variant="titleMedium" className="text-emerald-600 font-black">{feeFormatted}</Text>
            </View>

            {codFormatted && (
              <View className="flex-row justify-between items-center">
                <Text variant="bodyMedium" className="text-slate-600 font-medium">Thu hộ (COD)</Text>
                <Text variant="titleMedium" className="text-amber-600 font-black">{codFormatted}</Text>
              </View>
            )}
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text variant="titleSmall" className="text-gray-600 font-bold">{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-4 rounded-xl items-center justify-center"
              style={[{ backgroundColor: theme.colors.primary }]}
              onPress={onConfirm}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={{ color: "#FFFFFF" }} variant="titleSmall" className="text-white font-bold text-base">
                {isLoading ? 'Đang xử lý...' : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
