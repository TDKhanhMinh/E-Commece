import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, useTheme, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing } from '@styles/index';
import { useShipments, usePrefetchShipment } from '../hooks/useShipments';
import { ShipmentCard } from '../components/ShipmentCard';
import type { Shipment } from '../types/shipping.types';

export function ShipmentsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const prefetchShipment = usePrefetchShipment();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useShipments();

  const shipments = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const handleShipmentPress = useCallback((shipment: Shipment) => {
    console.log('Navigate to shipment details:', shipment.id);
  }, []);

  const handleShipmentHover = useCallback(
    (shipment: Shipment) => {
      prefetchShipment(shipment.id);
    },
    [prefetchShipment],
  );

  const renderItem = useCallback(
    ({ item }: { item: Shipment }) => (
      <ShipmentCard
        shipment={item}
        onPress={handleShipmentPress}
      />
    ),
    [handleShipmentPress],
  );

  const keyExtractor = useCallback((item: Shipment) => item.id, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Icon
          name="package-variant"
          size={64}
          color={theme.colors.outlineVariant}
        />
        <Text variant="titleMedium" style={{ marginTop: spacing.md }}>
          No shipments yet
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.outline, textAlign: 'center' }}>
          Create your first shipment to get started
        </Text>
      </View>
    ),
    [theme.colors],
  );

  const renderFooterComponent = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading && shipments.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={{ marginTop: spacing.md }}>
          Loading shipments...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text variant="headlineMedium" style={{ fontWeight: '600' }}>
          My Shipments
        </Text>
      </View>

      <FlatList
        data={shipments}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
          shipments.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooterComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />

      <FAB
        icon="plus"
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            bottom: insets.bottom + spacing.md,
          },
        ]}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    flexGrow: 1,
  },
  emptyListContent: {
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
  },
});
