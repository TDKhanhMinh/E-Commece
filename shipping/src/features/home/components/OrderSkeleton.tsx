import React from 'react';
import { View } from 'react-native';
import { Surface } from 'react-native-paper';
import { Skeleton } from '@components/ui/Skeleton';

export function OrderSkeleton() {
  return (
    <Surface
      className="mx-4 mb-4 bg-white rounded-3xl overflow-hidden p-4"
      style={{
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)'
      }}
    >
      {/* Header: ID and Fee */}
      <View className="flex-row justify-between items-center mb-4">
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={100} height={24} borderRadius={12} />
      </View>

      {/* Route Section */}
      <View className="bg-gray-50/80 rounded-2xl p-3 mb-4 border border-gray-100/50">
        <View className="flex-row items-center gap-3">
          <Skeleton width={34} height={34} borderRadius={17} />
          <View className="flex-1">
            <Skeleton width={80} height={12} borderRadius={4} className="mb-1" />
            <Skeleton width="90%" height={16} borderRadius={4} />
          </View>
        </View>
        
        <View className="h-[18px] border-l-[2px] border-dashed border-gray-200 ml-[16px] my-1" />

        <View className="flex-row items-center gap-3">
          <Skeleton width={34} height={34} borderRadius={17} />
          <View className="flex-1">
            <Skeleton width={80} height={12} borderRadius={4} className="mb-1" />
            <Skeleton width="85%" height={16} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* Customer Info */}
      <View className="flex-row items-center gap-3 mb-1 px-1">
        <Skeleton width={36} height={36} borderRadius={18} />
        <View>
          <Skeleton width={120} height={16} borderRadius={4} className="mb-1" />
          <Skeleton width={80} height={14} borderRadius={4} />
        </View>
      </View>

      {/* Action Button */}
      <View className="mt-4 border-t border-gray-100 pt-3">
        <Skeleton width="100%" height={48} borderRadius={14} />
      </View>
    </Surface>
  );
}
