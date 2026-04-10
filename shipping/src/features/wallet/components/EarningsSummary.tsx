import React from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';

export function EarningsSummary() {
  return (
    <View className="flex-row gap-4 px-4 py-2">
      <Card variant="outlined" className="flex-1 items-center py-4 bg-white">
        <Typography variant="caption" className="text-gray-500 mb-1">
          Thu nhập hôm nay:
        </Typography>
        <Typography variant="h5" className="text-gray-900 font-bold">
          320.000 đ
        </Typography>
      </Card>
      
      <Card variant="outlined" className="flex-1 items-center py-4 bg-white">
        <Typography variant="caption" className="text-gray-500 mb-1">
          Thu nhập tuần này:
        </Typography>
        <Typography variant="h5" className="text-gray-900 font-bold">
          1.800.000 đ
        </Typography>
      </Card>
    </View>
  );
}
