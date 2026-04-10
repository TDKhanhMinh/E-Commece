import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { IconButton } from '@components/ui/IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BalanceCard } from '../components/BalanceCard';
import { EarningsSummary } from '../components/EarningsSummary';
import { TransactionList } from '../components/TransactionList';

export function WalletScreen() {
  const insets = useSafeAreaInsets();

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
      >
        <View className="p-4">
          <BalanceCard />
        </View>
        
        <EarningsSummary />
        
        <TransactionList />
      </ScrollView>
    </View>
  );
}
