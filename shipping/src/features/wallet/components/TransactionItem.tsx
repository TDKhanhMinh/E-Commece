import React from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';

export interface Transaction {
  id: string;
  title: string;
  time: string;
  amount: number;
  type: 'in' | 'out';
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncoming = transaction.type === 'in';

  return (
    <Card
      variant="outlined"
      className={`mb-3 border-l-4 ${isIncoming ? 'border-l-success' : 'border-l-error'} py-3 px-4 bg-white shadow-sm`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Typography variant="body2" className="font-bold text-gray-800 mb-1">
            {transaction.title}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {transaction.time}
          </Typography>
        </View>

        <View className="items-end">
          <Typography
            variant="body1"
            className={`font-bold ${isIncoming ? 'text-success' : 'text-error'}`}
          >
            {isIncoming ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString('vi-VN')} đ
          </Typography>
        </View>
      </View>
    </Card>
  );
}
