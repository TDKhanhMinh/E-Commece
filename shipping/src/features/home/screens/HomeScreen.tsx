import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  StatusBar,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@styles/index';
import { useDriverStore } from '../store/useDriverStore';
import { HomeHeader } from '../components/HomeHeader';
import { StatsWidget } from '../components/StatsWidget';
import { SearchBar } from '../components/SearchBar';
import { OrderCard } from '../components/OrderCard';
import type { Order } from '../types/home.types';

// ── Sort options ─────────────────────────────────────────────────────────────
type SortKey = 'time' | 'distance' | 'fee';
const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'time',     label: 'Thời gian', icon: 'clock-outline' },
  { key: 'distance', label: 'Khoảng cách', icon: 'map-marker-distance' },
  { key: 'fee',      label: 'Phí cao nhất', icon: 'cash-multiple' },
];

function sortOrders(orders: Order[], key: SortKey): Order[] {
  return [...orders].sort((a, b) => {
    if (key === 'fee')      return b.fee - a.fee;
    if (key === 'distance') return (a.pickupDistanceKm + a.deliveryDistanceKm) - (b.pickupDistanceKm + b.deliveryDistanceKm);
    return a.estimatedMinutes - b.estimatedMinutes;
  });
}

// ── List header ──────────────────────────────────────────────────────────────
interface ListHeaderProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  sortKey: SortKey;
  onSort: (k: SortKey) => void;
  count: number;
}

function ListHeader({ searchQuery, onSearch, sortKey, onSort, count }: ListHeaderProps) {
  const theme = useTheme();

  return (
    <>
      {/* Stats */}
      <StatsWidget />

      {/* Search */}
      <SearchBar onSearch={onSearch} />

      {/* Section header */}
      <View style={headerStyles.section}>
        <View style={headerStyles.titleRow}>
          <Icon name="package-variant" size={18} color={theme.colors.primary} />
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Đơn hàng chờ nhận
          </Text>
          <View style={[headerStyles.countBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={headerStyles.countText}>{count}</Text>
          </View>
        </View>

        {/* Sort chips */}
        <View style={headerStyles.sortRow}>
          {SORT_OPTIONS.map((opt) => {
            const active = opt.key === sortKey;
            return (
              <View
                key={opt.key}
                style={[
                  headerStyles.chip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.surfaceVariant,
                    borderColor: active ? theme.colors.primary : theme.colors.outlineVariant,
                  },
                ]}
              >
                <Text
                  onPress={() => onSort(opt.key)}
                  variant="labelSmall"
                  style={{ color: active ? '#FFF' : theme.colors.onSurfaceVariant, fontWeight: '600' }}
                >
                  {opt.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
}

const headerStyles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  countBadge: {
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
});

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyOrders() {
  const theme = useTheme();
  return (
    <View style={emptyStyles.container}>
      <Icon name="package-variant-closed" size={56} color={theme.colors.outlineVariant} />
      <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.sm }}>
        Không có đơn hàng nào
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4 }}>
        Chuyển sang trạng thái Online để nhận đơn
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
});

// ── Screen ───────────────────────────────────────────────────────────────────
export function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const availableOrders = useDriverStore((s) => s.availableOrders);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('time');

  const filteredOrders = useCallback(() => {
    const q = searchQuery.toLowerCase();
    const filtered = q
      ? availableOrders.filter(
          (o) =>
            o.pickupAddress.toLowerCase().includes(q) ||
            o.dropoffAddress.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q),
        )
      : availableOrders;
    return sortOrders(filtered, sortKey);
  }, [availableOrders, searchQuery, sortKey]);

  const orders = filteredOrders();

  const renderItem = ({ item }: ListRenderItemInfo<Order>) => (
    <OrderCard order={item} />
  );

  const keyExtractor = (item: Order) => item.id;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.surface}
        translucent={false}
      />

      {/* Sticky top header */}
      <HomeHeader />

      {/* Scrollable body */}
      <FlatList
        data={orders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <ListHeader
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            sortKey={sortKey}
            onSort={setSortKey}
            count={orders.length}
          />
        }
        ListEmptyComponent={<EmptyOrders />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
});
