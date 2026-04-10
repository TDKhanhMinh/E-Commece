import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { HistoryOrder } from '../types';

interface OrderHistoryCardProps {
  order: HistoryOrder;
  onPress: () => void;
}

export const OrderHistoryCard = ({ order, onPress }: OrderHistoryCardProps) => {
  const theme = useTheme();

  // Format date and time
  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('vi-VN', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      }),
      time: d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const { date, time } = formatDateTime(order.deliveredAt);

  // Get status color and label
  const getStatusStyles = () => {
    switch (order.status) {
      case 'completed':
        return {
          color: '#4CAF50',
          label: 'Hoàn thành',
          backgroundColor: '#E8F5E9',
        };
      case 'cancelled':
        return {
          color: '#F44336',
          label: 'Đã hủy',
          backgroundColor: '#FFEBEE',
        };
      case 'returned':
        return {
          color: '#FF9800',
          label: 'Trả lại',
          backgroundColor: '#FFF3E0',
        };
      default:
        return {
          color: '#757575',
          label: 'Không xác định',
          backgroundColor: '#F5F5F5',
        };
    }
  };

  const statusStyle = getStatusStyles();

  // Get item type icon
  const getItemIcon = () => {
    switch (order.itemType) {
      case 'food':
        return 'pizza';
      case 'document':
        return 'file-document';
      case 'goods':
      default:
        return 'package-variant';
    }
  };

  const startDistrict = order.sender.district;
  const endDistrict = order.receiver.district;

  return (
    <Card
      className="mx-3 my-2 rounded-xl shadow-sm"
      style={{ backgroundColor: theme.colors.surface, elevation: 2 }}
      onPress={onPress}
    >
      <View className="p-3">
        {/* Header: Order ID and Status */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center flex-1">
            <Icon
              name={getItemIcon()}
              size={20}
              color={theme.colors.primary}
              className="mr-2"
            />
            <Text variant="titleSmall" className="font-semibold flex-1">
              {order.trackingNumber}
            </Text>
          </View>
          <View
            className="px-2.5 py-1 rounded-md"
            style={{ backgroundColor: statusStyle.backgroundColor }}
          >
            <Text
              variant="labelSmall"
              style={{
                color: statusStyle.color,
                fontWeight: '600',
              }}
            >
              {statusStyle.label}
            </Text>
          </View>
        </View>

        {/* Date and Time */}
        <View className="flex-row items-center mb-2.5">
          <Icon
            name="clock-outline"
            size={14}
            color={theme.colors.outline}
          />
          <Text
            variant="bodySmall"
            className="ml-1.5"
            style={{ color: theme.colors.outline }}
          >
            {date} • {time}
          </Text>
        </View>

        {/* Route Information */}
        <View className="my-2.5">
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                flex: 1,
                marginLeft: 8,
              }}
              numberOfLines={1}
            >
              {startDistrict}
            </Text>
          </View>
          <View
            className="h-3 w-0.5 ml-[3px] my-0.5"
            style={{ backgroundColor: theme.colors.outlineVariant }}
          />
          <View className="flex-row items-center">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.tertiary }}
            />
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                flex: 1,
                marginLeft: 8,
              }}
              numberOfLines={1}
            >
              {endDistrict}
            </Text>
          </View>
        </View>

        {/* Income Information */}
        <View className="flex-row justify-between items-center my-2 pt-2 border-t border-[#E0E0E0]">
          <View className="flex-1">
            <Text
              variant="labelSmall"
              style={{ color: theme.colors.outline }}
            >
              Thu nhập
            </Text>
            <Text
              variant="titleSmall"
              style={{
                color: theme.colors.primary,
                fontWeight: '700',
                marginTop: 4,
              }}
            >
              +{order.driverIncome.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          <Pressable
            className="px-3 py-1.5 border rounded-md justify-center items-center"
            style={{ borderColor: theme.colors.outline }}
            onPress={onPress}
          >
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.primary,
                fontWeight: '600',
              }}
            >
              Xem chi tiết
            </Text>
          </Pressable>
        </View>

        {/* Customer Rating (if available) */}
        {order.customerRating && (
          <View className="flex-row items-center mt-2 pt-2 border-t border-[#E0E0E0]">
            <View className="flex-row gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name={
                    i < order.customerRating!.rating
                      ? 'star'
                      : 'star-outline'
                  }
                  size={14}
                  color={
                    i < order.customerRating!.rating
                      ? '#FFB800'
                      : theme.colors.outline
                  }
                />
              ))}
            </View>
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginLeft: 8,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {order.customerRating.comment || 'Chưa có nhận xét'}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

