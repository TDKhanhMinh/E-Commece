import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { HistoryOrder } from '../types';

interface OrderDetailSectionProps {
  order: HistoryOrder;
}

export const OrderDetailSection = ({ order }: OrderDetailSectionProps) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'returned':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = () => {
    switch (order.status) {
      case 'completed':
        return 'HOÀN THÀNH';
      case 'cancelled':
        return 'ĐÃ HỦY';
      case 'returned':
        return 'TRẢ LẠI';
      default:
        return 'KHÔNG XÁC ĐỊNH';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: '700',
              color: theme.colors.onSurface,
            }}
          >
            {order.trackingNumber}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() + '20' },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{
                color: getStatusColor(),
                fontWeight: '700',
              }}
            >
              {getStatusLabel()}
            </Text>
          </View>
        </View>
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.outline,
            marginTop: 8,
          }}
        >
          {formatDate(order.deliveredAt)}
        </Text>
      </View>

      <Divider style={{ marginVertical: 12 }} />

      {/* Items Section */}
      <View style={styles.section}>
        <Text
          variant="titleSmall"
          style={{
            fontWeight: '700',
            color: theme.colors.onSurface,
            marginBottom: 12,
          }}
        >
          HÀNGHỈ GIAO
        </Text>
        {order.items.map((item, index) => (
          <View key={item.id || index} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text
                variant="bodySmall"
                style={{
                  fontWeight: '600',
                  color: theme.colors.onSurface,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: theme.colors.outline,
                  marginLeft: 8,
                }}
              >
                x{item.quantity}
              </Text>
            </View>
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.outline,
                marginTop: 4,
              }}
            >
              Giá trị: {item.value.toLocaleString('vi-VN')} đ | Cân nặng: {item.weight}g
            </Text>
          </View>
        ))}
      </View>

      <Divider style={{ marginVertical: 12 }} />

      {/* Payment Details Section */}
      <View style={styles.section}>
        <Text
          variant="titleSmall"
          style={{
            fontWeight: '700',
            color: theme.colors.onSurface,
            marginBottom: 12,
          }}
        >
          CHI TIẾT THANH TOÁN
        </Text>

        {/* Payment rows */}
        <View style={styles.paymentRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            Phí vận chuyển
          </Text>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
            }}
          >
            {order.shippingFee.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        {order.insuranceFee > 0 && (
          <View style={styles.paymentRow}>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              Bảo hiểm
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
              }}
            >
              {order.insuranceFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        )}

        {order.serviceFee > 0 && (
          <View style={styles.paymentRow}>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              Phí dịch vụ
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
              }}
            >
              {order.serviceFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        )}

        <Divider style={{ marginVertical: 8 }} />

        <View style={styles.paymentRow}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
            }}
          >
            Tổng tiền
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: theme.colors.primary,
              fontWeight: '700',
            }}
          >
            {order.totalAmount.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        <Divider style={{ marginVertical: 8 }} />

        <View style={styles.paymentRow}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
            }}
          >
            Thu nhập của bạn
          </Text>
          <Text
            variant="titleSmall"
            style={{
              color: theme.colors.tertiary,
              fontWeight: '700',
            }}
          >
            +{order.driverIncome.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </View>

      <Divider style={{ marginVertical: 12 }} />

      {/* Customer Rating Section */}
      {order.customerRating && (
        <>
          <View style={styles.section}>
            <Text
              variant="titleSmall"
              style={{
                fontWeight: '700',
                color: theme.colors.onSurface,
                marginBottom: 12,
              }}
            >
              ĐÁNH GIÁ KHÁCH HÀNG
            </Text>

            <View style={styles.ratingContainer}>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={
                      i < order.customerRating!.rating
                        ? 'star'
                        : 'star-outline'
                    }
                    size={24}
                    color={
                      i < order.customerRating!.rating
                        ? '#FFB800'
                        : theme.colors.outline
                    }
                  />
                ))}
              </View>

              <Text
                variant="headlineSmall"
                style={{
                  fontWeight: '700',
                  color: theme.colors.onSurface,
                  marginTop: 8,
                }}
              >
                {order.customerRating.rating} / 5 sao
              </Text>

              {order.customerRating.comment && (
                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 8,
                    fontStyle: 'italic',
                  }}
                >
                  "{order.customerRating.comment}"
                </Text>
              )}

              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.outline,
                  marginTop: 8,
                }}
              >
                Từ: {order.customerRating.ratedBy}
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 12 }} />
        </>
      )}

      {/* Action Buttons - Reserved for future */}
      <View style={styles.section}>
        <Text
          variant="titleSmall"
          style={{
            fontWeight: '700',
            color: theme.colors.onSurface,
            marginBottom: 12,
          }}
        >
          HÀNH ĐỘNG
        </Text>

        <View
          style={[
            styles.actionItem,
            { borderColor: theme.colors.outline },
          ]}
        >
          <Icon
            name="information-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.primary,
              fontWeight: '600',
              marginLeft: 12,
              flex: 1,
            }}
          >
            Xem lại đánh giá
          </Text>
          <Icon name="chevron-right" size={20} color={theme.colors.outline} />
        </View>

        <View
          style={[
            styles.actionItem,
            { borderColor: theme.colors.outline, borderTopWidth: 0 },
          ]}
        >
          <Icon
            name="alert-circle-outline"
            size={20}
            color="#F44336"
          />
          <Text
            variant="bodySmall"
            style={{
              color: '#F44336',
              fontWeight: '600',
              marginLeft: 12,
              flex: 1,
            }}
          >
            Báo cáo vấn đề
          </Text>
          <Icon name="chevron-right" size={20} color={theme.colors.outline} />
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  itemCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  ratingContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderTopWidth: 1,
  },
});
