import React from 'react';
import { View } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { HistorySummary } from '../types';

interface HistorySummarySectionProps {
  summary: HistorySummary | null;
  isLoading: boolean;
}

export const HistorySummarySection = ({
  summary,
  isLoading,
}: HistorySummarySectionProps) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View className="p-3 border-b border-[#E0E0E0]" style={{ backgroundColor: theme.colors.surface }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!summary) {
    return null;
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 3.5) return '#2196F3';
    if (rating >= 2.5) return '#FF9800';
    return '#F44336';
  };

  return (
    <View className="p-3 border-b border-[#E0E0E0]" style={{ backgroundColor: theme.colors.surface }}>
      {/* Main Stats */}
      <View className="flex-row justify-between mb-3 gap-2">
        {/* Total Orders */}
        <View
          className="flex-1 px-3 py-3 rounded-[10px] items-center"
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        >
          <View className="w-10 h-10 rounded-full justify-center items-center bg-[#F5F5F5]">
            <Icon
              name="package-variant"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.outline,
              marginTop: 8,
            }}
          >
            Tổng đơn
          </Text>
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: '700',
              color: theme.colors.onSurface,
              marginTop: 4,
            }}
          >
            {summary.totalOrders}
          </Text>
        </View>

        {/* Total Income */}
        <View
          className="flex-1 px-3 py-3 rounded-[10px] items-center"
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        >
          <View className="w-10 h-10 rounded-full justify-center items-center bg-[#F5F5F5]">
            <Icon
              name="cash-multiple"
              size={24}
              color={theme.colors.tertiary}
            />
          </View>
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.outline,
              marginTop: 8,
            }}
          >
            Tổng thu nhập
          </Text>
          <Text
            variant="titleSmall"
            style={{
              fontWeight: '700',
              color: theme.colors.tertiary,
              marginTop: 4,
            }}
          >
            {summary.totalIncome.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        {/* Average Rating */}
        <View
          className="flex-1 px-3 py-3 rounded-[10px] items-center"
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        >
          <View className="w-10 h-10 rounded-full justify-center items-center bg-[#F5F5F5]">
            <Icon
              name="star"
              size={24}
              color={getRatingColor(summary.averageRating)}
            />
          </View>
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.outline,
              marginTop: 8,
            }}
          >
            Đánh giá
          </Text>
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: '700',
              color: getRatingColor(summary.averageRating),
              marginTop: 4,
            }}
          >
            {summary.averageRating.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Order Status Breakdown */}
      <View
        className="flex-row px-3 py-2.5 rounded-lg border-l-[3px] gap-1"
        style={{
          backgroundColor: theme.colors.primary + '10',
          borderLeftColor: theme.colors.primary,
        }}
      >
        <View className="flex-1 flex-row items-center justify-center">
          <View
            className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#4CAF50]"
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
            Hoàn thành:
          </Text>
          <Text
            variant="bodySmall"
            style={{
              fontWeight: '600',
              color: theme.colors.onSurface,
              marginLeft: 4,
            }}
          >
            {summary.completedOrders}
          </Text>
        </View>

        <View className="w-[1px] bg-[#E0E0E0]" />

        <View className="flex-1 flex-row items-center justify-center">
          <View
            className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#F44336]"
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
            Đã hủy:
          </Text>
          <Text
            variant="bodySmall"
            style={{
              fontWeight: '600',
              color: theme.colors.onSurface,
              marginLeft: 4,
            }}
          >
            {summary.cancelledOrders}
          </Text>
        </View>
      </View>
    </View>
  );
};

