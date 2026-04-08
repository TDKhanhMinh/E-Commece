import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  OrderHistoryCard,
  HistoryFilterHeader,
  HistorySummarySection,
} from '../components';
import { useOrderHistory, useHistorySummary } from '../hooks';
import { useAuth } from '@features/auth/hooks/useAuth';
import type { HistoryStackParamList } from '../navigators';

type HistoryListScreenProps = NativeStackScreenProps<
  HistoryStackParamList,
  'HistoryList'
>;

export const HistoryListScreen = ({ navigation }: HistoryListScreenProps) => {
  const theme = useTheme();
  const { user } = useAuth();
  const driverId = user?.id || 'default-driver';

  const {
    orders,
    isLoading,
    dateRange,
    refresh,
    handleSearch,
    handleChangeDateRange,
    loadMore,
    hasMore,
  } = useOrderHistory({
    driverId,
    limit: 30,
  });

  const { summary, isLoading: summaryLoading } = useHistorySummary({
    driverId,
    dateRange,
  });

  const handleNavigateToDetail = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="history"
        size={64}
        color={theme.colors.outlineVariant}
      />
      <Text
        variant="titleMedium"
        style={{
          color: theme.colors.onSurfaceVariant,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        Chưa có đơn hàng
      </Text>
      <Text
        variant="bodySmall"
        style={{
          color: theme.colors.outline,
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        Hoàn thành một số chuyến giao hàng để xem lịch sử
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading && hasMore) {
      return (
        <View style={styles.footerContainer}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.outline,
              marginBottom: 16,
            }}
          >
            Tải thêm
          </Text>
        </View>
      );
    }

    if (!hasMore && orders.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text
            variant="labelSmall"
            style={{
              color: theme.colors.outline,
              fontStyle: 'italic',
            }}
          >
            Đã tải toàn bộ lịch sử
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderHistoryCard
            order={item}
            onPress={() => handleNavigateToDetail(item.id)}
          />
        )}
        ListHeaderComponent={
          <>
            <HistoryFilterHeader
              onSearch={handleSearch}
              onDateRangeChange={handleChangeDateRange}
              currentDateRange={dateRange}
              isSearching={isLoading}
            />
            <HistorySummarySection
              summary={summary}
              isLoading={summaryLoading}
            />
          </>
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasMore && !isLoading) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && orders.length > 0}
            onRefresh={refresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        scrollIndicatorInsets={{ right: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: Dimensions.get('window').height / 2,
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
