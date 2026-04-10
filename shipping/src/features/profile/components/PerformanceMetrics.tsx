import React from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function PerformanceMetrics() {
  return (
    <View className="flex-row gap-2 px-4 mb-6">
      <MetricCard 
        label="Tỉ lệ nhận đơn" 
        value="95%" 
        status="good" 
        icon="check-circle"
      />
      <MetricCard 
        label="Tỉ lệ hoàn thành" 
        value="98%" 
        status="good" 
        icon="check-circle"
      />
      <MetricCard 
        label="Tỉ lệ hủy đơn" 
        value="2%" 
        status="warning" 
        icon="alert"
      />
    </View>
  );
}

function MetricCard({ label, value, status, icon }: { label: string, value: string, status: 'good' | 'warning' | 'error', icon: string }) {
  const colorClass = status === 'good' ? 'text-success' : status === 'warning' ? 'text-amber-500' : 'text-error';
  const bgColorClass = status === 'good' ? 'bg-success/5' : status === 'warning' ? 'bg-amber-500/5' : 'bg-error/5';
  
  return (
    <Card variant="outlined" className={`flex-1 items-center p-3 bg-white`}>
      <View className="flex-row items-center mb-1">
        <Icon name={icon} size={14} color={status === 'good' ? '#4CAF50' : status === 'warning' ? '#F59E0B' : '#F44336'} />
      </View>
      <Typography variant="overline" className="text-gray-500 text-center text-[8px]" numberOfLines={1}>
        {label}
      </Typography>
      <Typography variant="h5" className={`font-bold ${colorClass}`}>
        {value}
      </Typography>
    </Card>
  );
}
