import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HomeStackParamList } from '@navigation/types';
import { spacing } from '@styles/index';
import { HomeHeader } from '../components/HomeHeader';
import { StatsWidget } from '../components/StatsWidget';
import { SearchBar } from '../components/SearchBar';
import { OrderCard, OrderSkeleton } from '../components';
import type { Order } from '../types/home.types';
import { useUnsignDelivery } from '../hooks/useHome';


// ── Sort options ─────────────────────────────────────────────────────────────
type SortKey = 'all' | 'distance' | 'time';
const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: 'clock-outline' },
  { key: 'distance', label: 'Khoảng cách', icon: 'map-marker-distance' },
  { key: 'time', label: 'Thời gian', icon: 'cash-multiple' },
];

// ── List header ──────────────────────────────────────────────────────────────
interface ListHeaderProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  sortKey: SortKey;
  onSort: (k: SortKey) => void;
  count: number | undefined;
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
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center gap-2 mb-3">
          <Icon name="package-variant" size={18} color={theme.colors.primary} />
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            Đơn hàng chờ nhận
          </Text>
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: theme.colors.primary }}>
            <Text style={{ color: theme.colors.onPrimary }} className="text-white text-[11px] font-bold">{count}</Text>
          </View>
        </View>

        {/* Sort chips */}
        <View className="flex-row gap-2">
          {SORT_OPTIONS.map((opt) => {
            const active = opt.key === sortKey;
            return (
              <View
                key={opt.key}
                className="px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: active ? theme.colors.primary : theme.colors.surfaceVariant,
                  borderColor: active ? theme.colors.primary : theme.colors.outlineVariant,
                }}
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

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyOrders() {
  const theme = useTheme();
  return (
    <View className="items-center justify-center p-8">
      <Icon name="package-variant-closed" size={56} color={theme.colors.outlineVariant} />
      <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
        Không có đơn hàng nào
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 4 }}>
        Chuyển sang trạng thái Online để nhận đơn
      </Text>
    </View>
  );
}

// ── Footer loader ─────────────────────────────────────────────────────────────
function FooterLoader() {
  const theme = useTheme();
  return (
    <View className="items-center py-4">
      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useUnsignDelivery();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('time');

  // Flatten all pages from Spring Boot Pageable into a single array
  const orders = useMemo<Order[]>(
    () => data?.pages.flatMap((page) => page.content as Order[]) ?? [],
    [data],
  );

  const totalElements = data?.pages[0]?.totalElements;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Order>) => {
    if (isLoading) return <OrderSkeleton key={item.orderId} />;
    return <OrderCard order={item} key={item.orderId} />;
  }, [isLoading]);

  const keyExtractor = useCallback((item: Order, index: number) => {
    return (item?.orderId ?? index).toString();
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.surface}
        translucent={false}
      />

      {/* Sticky top header */}
      <HomeHeader
        onNotificationPress={() => navigation.navigate('Notifications')}
        onAvatarPress={() => console.log('Avatar pressed')}
      />

      {/* Scrollable body */}
      <FlatList
        data={isLoading ? ([1, 2, 3] as unknown as Order[]) : orders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <ListHeader
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            sortKey={sortKey}
            onSort={setSortKey}
            count={totalElements}
          />
        }
        ListEmptyComponent={isLoading ? null : <EmptyOrders />}
        ListFooterComponent={isFetchingNextPage ? <FooterLoader /> : null}
        contentContainerStyle={[
          { flexGrow: 1 },
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}
