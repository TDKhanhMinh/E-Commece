import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
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
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        {/* Header: Order ID and Status */}
        <View style={styles.header}>
          <View style={styles.orderIdSection}>
            <Icon
              name={getItemIcon()}
              size={20}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text variant="titleSmall" style={styles.orderId}>
              {order.trackingNumber}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
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
        <View style={styles.timeRow}>
          <Icon
            name="clock-outline"
            size={14}
            color={theme.colors.outline}
          />
          <Text
            variant="bodySmall"
            style={[styles.timeText, { color: theme.colors.outline }]}
          >
            {date} • {time}
          </Text>
        </View>

        {/* Route Information */}
        <View style={styles.routeSection}>
          <View style={styles.routePoint}>
            <View
              style={[
                styles.routeDot,
                { backgroundColor: theme.colors.primary },
              ]}
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
            style={[
              styles.routeLine,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />
          <View style={styles.routePoint}>
            <View
              style={[
                styles.routeDot,
                { backgroundColor: theme.colors.tertiary },
              ]}
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
        <View style={styles.incomeRow}>
          <View style={styles.incomeLeft}>
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
            style={[
              styles.detailButton,
              { borderColor: theme.colors.outline },
            ]}
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
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
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

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderIdSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  orderId: {
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    marginLeft: 6,
  },
  routeSection: {
    marginVertical: 10,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    height: 12,
    width: 2,
    marginLeft: 3,
    marginVertical: 2,
  },
  incomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  incomeLeft: {
    flex: 1,
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
});
