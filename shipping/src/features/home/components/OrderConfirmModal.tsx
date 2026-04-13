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
        <View className="bg-white rounded-[24px] p-6 shadow-2xl">
          <View
            className="w-16 h-16 rounded-full items-center justify-center self-center mb-5"
            style={[{ backgroundColor: theme.colors.primaryContainer }]}
          >
            <Icon name="truck-fast" size={32} color={theme.colors.primary} />
          </View>
          <Text variant="titleLarge" className="text-center font-bold text-gray-900 mb-2">
            {title}
          </Text>
          <Text variant="bodyMedium" className="text-center text-gray-500 mb-6 px-2">
            {description}
          </Text>

          <View className="bg-gray-50 p-4 rounded-2xl items-center mb-6 border border-gray-100">
            <Text variant="labelMedium" className="text-gray-500 mb-1 font-medium">Tổng phí thu</Text>
            <Text variant="headlineSmall" className="text-emerald-600 font-black tracking-tight">
              {feeFormatted}
            </Text>
            <View className="bg-gray-200/60 px-3 py-1 rounded-full mt-3">
              <Text variant="labelSmall" className="text-gray-600 font-bold">
                Mã: #{orderId}
              </Text>
            </View>
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
