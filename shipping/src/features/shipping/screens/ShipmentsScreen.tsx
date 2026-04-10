import React, { useCallback, useState } from 'react';
import { View, FlatList, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing } from '@styles/index';
import { useAllShipments } from '../hooks/useShipments';
import { OrderCard } from '@features/home/components/OrderCard';
import type { Order } from '@features/home/types/home.types';

// Các trạng thái đơn hàng phổ biến
const SHIPMENT_STATUSES = [
  { id: 'PICKED_UP', label: 'Đang lấy hàng', icon: 'package-up' },
  { id: 'DELIVERING', label: 'Đang giao', icon: 'truck-delivery' },
  { id: 'SUCCESS', label: 'Hoàn thành', icon: 'check-circle' },
  { id: 'CANCELLED', label: 'Đã hủy', icon: 'close-circle' },
];

export function ShipmentsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // State quản lý tab trạng thái hiện tại
  const [activeStatus, setActiveStatus] = useState<string>('PICKED_UP');

  // Lấy dữ liệu với hook
  const { data: shipmentsPayload, isPending, refetch, isRefetching } = useAllShipments(activeStatus);

  // @ts-ignore
  const orders: Order[] = shipmentsPayload?.data?.content || [];

  const renderItem = useCallback(
    ({ item }: { item: Order }) => {
      // Tái sử dụng OrderCard hiện đại
      return <OrderCard order={item} />;
    },
    []
  );

  const keyExtractor = useCallback((item: Order) => item.orderId.toString(), []);

  // Giao diện khi danh sách trống
  const renderEmptyComponent = useCallback(() => (
    <View className="items-center justify-center py-[72px] px-6">
      <View className="w-[100px] h-[100px] rounded-full items-center justify-center mb-6" style={[{ backgroundColor: theme.colors.surfaceVariant }]}>
        <Icon
          name="package-variant-closed"
          size={56}
          color={theme.colors.primary}
        />
      </View>
      <Text variant="titleLarge" className="font-bold mb-1" style={[{ color: theme.colors.onSurface }]}>
        Chưa có đơn hàng
      </Text>
      <Text
        variant="bodyMedium"
        className="text-center leading-[22px]"
        style={[{ color: theme.colors.onSurfaceVariant }]}
      >
        Bạn chưa có chuyến hàng nào đang ở trạng thái này.
      </Text>
    </View>
  ), [theme.colors]);

  return (
    <View className="flex-1" style={[{ backgroundColor: theme.colors.background }]}>
      {/* ── HEADER ── */}
      <View
        className="px-5 pb-5 bg-white"
        style={{ paddingTop: insets.top + spacing.xs }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <View className="flex-row items-center mb-1">
              <View className="w-1.5 h-6 bg-indigo-600 rounded-full mr-2" />
              <Text className="text-[26px] font-black text-slate-900 tracking-tight">
                Đơn hàng
              </Text>
            </View>
            <Text className="text-[14px] text-slate-500 font-medium leading-5">
              Quản lý và theo dõi lộ trình các chuyến đi của bạn
            </Text>
          </View>

          <View className="w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center border border-indigo-100/50">
            <Icon name="package-variant" size={32} color="#4F46E5" />
          </View>
        </View>
      </View>

      {/* ── STATUS FILTER (TABS) ── */}
      <View className="pb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
        >
          {SHIPMENT_STATUSES.map((status) => {
            const isActive = activeStatus === status.id;
            return (
              <TouchableOpacity
                key={status.id}
                onPress={() => setActiveStatus(status.id)}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-2 rounded-full border gap-1.5"
                style={[
                  {
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                    borderColor: isActive ? theme.colors.primary : theme.colors.outlineVariant,
                  }
                ]}
              >
                <Icon
                  name={status.icon}
                  size={16}
                  color={isActive ? '#ffffff' : theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="labelMedium"
                  style={{
                    color: isActive ? '#ffffff' : theme.colors.onSurfaceVariant,
                    fontWeight: isActive ? '700' : '500',
                  }}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── LIST CONTENT ── */}
      {isPending && orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: spacing.md, color: theme.colors.outline }}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          className="px-0"
          contentContainerStyle={[
            { flexGrow: 1, paddingHorizontal: 0, paddingTop: 4 },
            { paddingBottom: insets.bottom + spacing.xl },
            orders.length === 0 && { justifyContent: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

