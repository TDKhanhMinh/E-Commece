import React from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing } from '@styles/index';

export function BalanceCard() {
  return (
    <Card className="bg-[#0f766e] p-6 rounded-[24px] shadow-lg overflow-hidden">
      {/* Background decoration */}
      <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      <View className="absolute -bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />

      <View className="items-center">
        <Typography variant="body2" className="text-teal-100 font-medium mb-1">
          Số dư khả dụng:
        </Typography>
        <Typography variant="h2" className="text-white font-bold text-4xl mb-2">
          2.500.000 đ
        </Typography>
        <Typography variant="caption" className="text-teal-50 font-medium">
          Ví Thu Hộ (COD): 550.000 đ
        </Typography>
      </View>

      <View className="flex-row justify-around mt-8 pt-6 border-t border-white/10">
        <View className="items-center">
          <View className="w-12 h-12 bg-white/15 rounded-full items-center justify-center mb-2">
            <Icon name="wallet-plus" size={24} color="#FFF" />
          </View>
          <Typography variant="caption" className="text-white font-semibold">
            [Nạp tiền]
          </Typography>
        </View>

        <View className="items-center">
          <View className="w-12 h-12 bg-white/15 rounded-full items-center justify-center mb-2">
            <Icon name="bank-transfer-out" size={24} color="#FFF" />
          </View>
          <Typography variant="caption" className="text-white font-semibold">
            [Rút tiền]
          </Typography>
        </View>
      </View>
    </Card>
  );
}
