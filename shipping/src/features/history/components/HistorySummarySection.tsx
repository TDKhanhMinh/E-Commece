import React from 'react';
import { View, StyleSheet } from 'react-native';
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
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
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
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Main Stats */}
      <View style={styles.statsGrid}>
        {/* Total Orders */}
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <View style={styles.statIconWrapper}>
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
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <View style={styles.statIconWrapper}>
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
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <View style={styles.statIconWrapper}>
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
        style={[
          styles.breakdownContainer,
          {
            backgroundColor: theme.colors.primary + '10',
            borderLeftColor: theme.colors.primary,
          },
        ]}
      >
        <View style={styles.breakdownItem}>
          <View
            style={[
              styles.breakdownDot,
              { backgroundColor: '#4CAF50' },
            ]}
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

        <View style={styles.divider} />

        <View style={styles.breakdownItem}>
          <View
            style={[
              styles.breakdownDot,
              { backgroundColor: '#F44336' },
            ]}
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

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  breakdownContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    gap: 4,
  },
  breakdownItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
});
