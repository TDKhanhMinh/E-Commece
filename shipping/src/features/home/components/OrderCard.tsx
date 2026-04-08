import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius } from '@styles/index';
import type { Order, CargoType } from '../types/home.types';
import { useDriverStore } from '../store/useDriverStore';

// ── Cargo config ────────────────────────────────────────────────────────────
const cargoConfig: Record<CargoType, { icon: string; label: string; color: string }> = {
  food: { icon: 'food', label: 'Đồ ăn', color: '#FF5722' },
  document: { icon: 'file-document', label: 'Tài liệu', color: '#2196F3' },
  package: { icon: 'package-variant', label: 'Hàng hoá', color: '#9C27B0' },
  fragile: { icon: 'glass-fragile', label: 'Dễ vỡ', color: '#F44336' },
  bulky: { icon: 'archive', label: 'Hàng cồng kềnh', color: '#795548' },
};

// ── Masked phone ─────────────────────────────────────────────────────────────
function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-3);
}

// ── Info row helper ──────────────────────────────────────────────────────────
function InfoRow({
  icon,
  iconColor,
  text,
  bold,
}: {
  icon: string;
  iconColor: string;
  text: string;
  bold?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={infoStyles.row}>
      <Icon name={icon} size={14} color={iconColor} />
      <Text
        variant="bodySmall"
        style={[
          { color: bold ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
          bold && { fontWeight: '600' },
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
});

// ── Main component ───────────────────────────────────────────────────────────
interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const theme = useTheme();
  const acceptOrder = useDriverStore((s) => s.acceptOrder);
  const cargo = cargoConfig[order.cargoType];

  const feeFormatted = new Intl.NumberFormat('vi-VN').format(order.fee) + 'đ';

  const handleAccept = () => {
    Alert.alert(
      'Nhận đơn hàng?',
      `Xác nhận nhận đơn ${order.id} - Phí: ${feeFormatted}`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => acceptOrder(order.id),
        },
      ],
    );
  };

  return (
    <Surface
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      {/* ── Header: cargo badge + fee ── */}
      <View style={styles.cardHeader}>
        <View style={[styles.cargoBadge, { backgroundColor: cargo.color + '18' }]}>
          <Icon name={cargo.icon} size={14} color={cargo.color} />
          <Text
            variant="labelSmall"
            style={{ color: cargo.color, fontWeight: '700' }}
          >
            {cargo.label}
          </Text>
        </View>
        <Text
          variant="titleMedium"
          style={{ color: '#4CAF50', fontWeight: '800' }}
        >
          {feeFormatted}
        </Text>
      </View>

      {/* ── Route ─── */}
      <View style={styles.routeSection}>
        {/* Pickup */}
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: theme.colors.primary }]} />
          <View style={styles.routeTextBlock}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
              LẤY HÀNG
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurface }}
              numberOfLines={1}
            >
              {order.pickupAddress}
            </Text>
          </View>
        </View>

        {/* Dashed connector */}
        <View style={styles.connector}>
          <View style={[styles.connectorLine, { borderColor: theme.colors.outlineVariant }]} />
        </View>

        {/* Dropoff */}
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#F44336' }]} />
          <View style={styles.routeTextBlock}>
            <Text variant="labelSmall" style={{ color: '#F44336', fontWeight: '600' }}>
              GIAO HÀNG
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurface }}
              numberOfLines={1}
            >
              {order.dropoffAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Meta info ── */}
      <View style={styles.metaRow}>
        <InfoRow
          icon="map-marker-distance"
          iconColor={theme.colors.primary}
          text={`${order.pickupDistanceKm}km → ${order.deliveryDistanceKm}km`}
        />
        <InfoRow
          icon="clock-outline"
          iconColor="#FF9800"
          text={`~${order.estimatedMinutes} phút`}
        />
      </View>

      {/* ── Customer ── */}
      <View style={styles.customerRow}>
        <View style={[styles.customerAvatar, { backgroundColor: theme.colors.primaryContainer }]}>
          <Icon name="account" size={14} color={theme.colors.primary} />
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          {order.customerName}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          •
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {maskPhone(order.customerPhone)}
        </Text>
      </View>

      {/* ── Note ── */}
      {order.note ? (
        <View style={[styles.noteRow, { backgroundColor: '#FFF8E1' }]}>
          <Icon name="note-text-outline" size={13} color="#FF9800" />
          <Text
            variant="bodySmall"
            style={{ color: '#795548', flex: 1 }}
            numberOfLines={2}
          >
            {order.note}
          </Text>
        </View>
      ) : null}

      {/* ── Accept button ── */}
      <TouchableOpacity
        style={[styles.acceptBtn, { backgroundColor: theme.colors.primary }]}
        onPress={handleAccept}
        activeOpacity={0.85}
      >
        <Icon name="check-bold" size={16} color="#FFF" />
        <Text variant="labelLarge" style={{ color: '#FFF', fontWeight: '700' }}>
          Nhận đơn
        </Text>
      </TouchableOpacity>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cargoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  routeSection: {
    marginBottom: spacing.sm,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 3,
  },
  routeTextBlock: {
    flex: 1,
  },
  connector: {
    paddingLeft: 4,
    paddingVertical: 2,
  },
  connectorLine: {
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    height: 12,
    marginLeft: 0,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  customerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
