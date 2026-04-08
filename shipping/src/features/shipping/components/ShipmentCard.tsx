import React, { memo, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing } from '@styles/index';
import { formatDate, formatCurrency } from '@utils/helpers';
import type { Shipment, ShipmentStatus } from '../types/shipping.types';

interface ShipmentCardProps {
  shipment: Shipment;
  onPress?: (shipment: Shipment) => void;
}

const statusConfig: Record<
  ShipmentStatus,
  { icon: string; color: string; label: string }
> = {
  pending: { icon: 'clock-outline', color: '#FF9800', label: 'Pending' },
  confirmed: { icon: 'check-circle-outline', color: '#2196F3', label: 'Confirmed' },
  picked_up: { icon: 'package-up', color: '#4CAF50', label: 'Picked Up' },
  in_transit: { icon: 'truck-delivery', color: '#9C27B0', label: 'In Transit' },
  out_for_delivery: { icon: 'map-marker', color: '#E91E63', label: 'Out for Delivery' },
  delivered: { icon: 'check-all', color: '#4CAF50', label: 'Delivered' },
  cancelled: { icon: 'close-circle', color: '#F44336', label: 'Cancelled' },
  returned: { icon: 'keyboard-return', color: '#795548', label: 'Returned' },
};

function ShipmentCardComponent({ shipment, onPress }: ShipmentCardProps) {
  const theme = useTheme();
  const status = statusConfig[shipment.status];

  const handlePress = useCallback(() => {
    onPress?.(shipment);
  }, [onPress, shipment]);

  return (
    <Card style={styles.card} onPress={onPress ? handlePress : undefined}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={{ fontWeight: '600' }}>
            {shipment.trackingNumber}
          </Text>
          <Chip
            icon={() => (
              <Icon name={status.icon} size={16} color={status.color} />
            )}
            textStyle={{ color: status.color, fontSize: 12 }}
            style={[styles.statusChip, { backgroundColor: status.color + '15' }]}>
            {status.label}
          </Chip>
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            <View style={styles.addressContent}>
              <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                From
              </Text>
              <Text variant="bodyMedium" numberOfLines={1}>
                {shipment.sender.fullName} - {shipment.sender.city}
              </Text>
            </View>
          </View>

          <View style={[styles.line, { backgroundColor: theme.colors.outlineVariant }]} />

          <View style={styles.addressRow}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <View style={styles.addressContent}>
              <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                To
              </Text>
              <Text variant="bodyMedium" numberOfLines={1}>
                {shipment.receiver.fullName} - {shipment.receiver.city}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
              Items
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
              {shipment.items.length}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
              Weight
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
              {shipment.totalWeight} kg
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
              Amount
            </Text>
            <Text
              variant="bodyMedium"
              style={{ fontWeight: '600', color: theme.colors.primary }}>
              {formatCurrency(shipment.totalAmount)}
            </Text>
          </View>
        </View>

        {shipment.estimatedDelivery && (
          <Text
            variant="bodySmall"
            style={[styles.deliveryDate, { color: theme.colors.outline }]}>
            Est. delivery: {formatDate(shipment.estimatedDelivery)}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusChip: {
    height: 28,
  },
  addressContainer: {
    marginBottom: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  line: {
    width: 2,
    height: 16,
    marginLeft: 4,
    marginVertical: 2,
  },
  addressContent: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  footerItem: {
    alignItems: 'center',
  },
  deliveryDate: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export const ShipmentCard = memo(ShipmentCardComponent);
