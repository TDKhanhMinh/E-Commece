import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { TransactionItem } from './TransactionItem';
import { WalletTransaction } from '../types/wallet.types';

interface TransactionListProps {
  transactions: WalletTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'CREDIT' | 'DEBIT'>('all');

  const filteredData = transactions.filter(item =>
    filter === 'all' ? true : item.type === filter
  );

  return (
    <View className="px-4 mt-6">
      <Typography variant="h4" className="mb-4 font-bold text-gray-900">
        LỊCH SỬ GIAO DỊCH
      </Typography>

      <View className="flex-row gap-2 mb-6">
        <FilterTab active={filter === 'all'} label="Tất cả" onPress={() => setFilter('all')} />
        <FilterTab active={filter === 'CREDIT'} label="Tiền vào" onPress={() => setFilter('CREDIT')} />
        <FilterTab active={filter === 'DEBIT'} label="Tiền ra" onPress={() => setFilter('DEBIT')} />
      </View>

      <View>
        {filteredData.map(item => (
          <TransactionItem key={item.transactionId} transaction={item} />
        ))}
        {filteredData.length === 0 && (
          <Typography variant="body2" className="text-center text-gray-400 py-10 italic">
            Không có giao dịch nào
          </Typography>
        )}
      </View>
    </View>
  );
}

function FilterTab({ active, label, onPress }: { active: boolean, label: string, onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-6 py-2 rounded-full border ${active ? 'bg-[#1e40af] border-[#1e40af]' : 'bg-gray-100 border-gray-100'}`}
    >
      <Typography
        variant="caption"
        className={`font-semibold ${active ? 'text-white' : 'text-gray-500'}`}
      >
        {label}
      </Typography>
    </Pressable>
  );
}
