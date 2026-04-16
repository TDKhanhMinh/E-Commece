import React, { useCallback } from 'react';
import { View, ScrollView, StatusBar, RefreshControl } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { IconButton } from '@components/ui/IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BalanceCard } from '../components/BalanceCard';
import { EarningsSummary } from '../components/EarningsSummary';
import { TransactionList } from '../components/TransactionList';
import { useWalletTransaction } from '../hooks/useWallet';
import { ActivityIndicator } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';

export function WalletScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: transactionResponse, isLoading, isError, refetch, isRefetching } = useWalletTransaction();

  const transactions = transactionResponse?.content || [];

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['wallet'] });
  }, [queryClient]);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4 bg-white"
        style={{ paddingTop: insets.top + 10 }}
      >
        <Typography variant="h4" className="font-bold text-gray-900">
          VÍ CỦA TÔI
        </Typography>
        <IconButton
          icon="help-circle-outline"
          size="md"
          onPress={() => console.log('Help')}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#0f766e"
            colors={['#0f766e']}
          />
        }
      >
        <View className="p-4">
          <BalanceCard />
        </View>

        <EarningsSummary />

        {isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator color="#1e40af" />
          </View>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </ScrollView>
    </View>
  );
}
