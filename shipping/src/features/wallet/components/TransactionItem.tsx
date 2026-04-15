import React from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';

import { WalletTransaction } from '../types/wallet.types';

interface TransactionItemProps {
  transaction: WalletTransaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncoming = transaction.type === 'CREDIT';

  return (
    <Card
      variant="outlined"
      className={`mb-3 border-l-4 ${isIncoming ? 'border-l-success' : 'border-l-error'} py-3 px-4 bg-white shadow-sm`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Typography variant="body2" className="font-bold text-gray-800 mb-1">
            {transaction.description}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {new Date(transaction.createdAt).toLocaleString('vi-VN')}
          </Typography>
        </View>

        <View className="items-end">
          <Typography
            variant="body1"
            className={`font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}
          >
            {isIncoming ? '+' : '-'}{Math.abs(parseFloat(transaction.amount)).toLocaleString('vi-VN')} đ
          </Typography>
        </View>
      </View>
    </Card>
  );
}
