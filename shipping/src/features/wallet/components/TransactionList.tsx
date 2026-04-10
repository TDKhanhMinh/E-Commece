import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { TransactionItem, Transaction } from './TransactionItem';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Nhận phí đơn #2410-001', time: 'Hôm nay, 14:20', amount: 22500, type: 'in' },
  { id: '2', title: 'Rút tiền về Vietcombank', time: 'Hôm nay, 09:15', amount: 500000, type: 'out' },
  { id: '3', title: 'Hoàn trả ví Thu Hộ (COD)', time: 'Hôm qua, 18:45', amount: 120000, type: 'out' },
  { id: '4', title: 'Thanh toán đơn #2410-098', time: 'Hôm qua, 10:30', amount: 45000, type: 'in' },
  { id: '5', title: 'Thưởng hiệu suất tuần', time: '07/04/2026, 17:00', amount: 150000, type: 'in' },
];

export function TransactionList() {
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

  const filteredData = MOCK_TRANSACTIONS.filter(item => 
    filter === 'all' ? true : item.type === filter
  );

  return (
    <View className="px-4 mt-6">
      <Typography variant="h4" className="mb-4 font-bold text-gray-900">
        LỊCH SỬ GIAO DỊCH
      </Typography>

      <View className="flex-row gap-2 mb-6">
        <FilterTab active={filter === 'all'} label="Tất cả" onPress={() => setFilter('all')} />
        <FilterTab active={filter === 'in'} label="Tiền vào" onPress={() => setFilter('in')} />
        <FilterTab active={filter === 'out'} label="Tiền ra" onPress={() => setFilter('out')} />
      </View>

      <View>
        {filteredData.map(item => (
          <TransactionItem key={item.id} transaction={item} />
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
