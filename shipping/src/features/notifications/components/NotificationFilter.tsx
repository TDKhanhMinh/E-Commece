import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Typography } from '@components/ui/Typography';

export type NotificationType = 'all' | 'ORDER_UPDATE' | 'OUTBOUND' | 'SYSTEM';

interface NotificationFilterProps {
  activeFilter: NotificationType;
  onFilterChange: (filter: NotificationType) => void;
}

const FILTERS: { key: NotificationType; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'ORDER_UPDATE', label: 'Đơn hàng' },
  { key: 'OUTBOUND', label: 'Cập nhật' },
  { key: 'SYSTEM', label: 'Hệ thống' },
];

export function NotificationFilter({ activeFilter, onFilterChange }: NotificationFilterProps) {
  return (
    <View className="py-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="flex-row gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => onFilterChange(filter.key)}
                className={`px-6 py-2 rounded-full border ${
                  isActive
                    ? 'bg-[#0f766e] border-[#0f766e]'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <Typography
                  variant="caption"
                  className={`font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}
                >
                  {filter.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
