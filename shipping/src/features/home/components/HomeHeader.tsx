import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@styles/index';
import { useDriverStore } from '../store/useDriverStore';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export function HomeHeader({ onNotificationPress, onAvatarPress }: HomeHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { status, toggleStatus } = useDriverStore();

  const isOnline = status === 'online';

  return (
    <View
      className="px-4 pb-3 bg-white border-b border-gray-100"
      style={{
        paddingTop: insets.top + spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        {/* Brand Section */}
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: '#1E40AF' }}
          >
            <Icon name="truck-fast" size={22} color="#FFFFFF" />
          </View>
          <View className="ml-3">
            <Text className="text-[17px] font-black text-slate-900 tracking-tight leading-tight">
              Giao Hàng Việt
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View className="px-1.5 py-0.5 rounded bg-blue-50 mr-2 border border-blue-100/50">
                <Text className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
                  PRO
                </Text>
              </View>
              <Text className="text-[11px] text-slate-400 font-medium">Đối tác vận chuyển</Text>
            </View>
          </View>
        </View>

        {/* Action Section */}
        <View className="flex-row items-center gap-2">
          {/* Status Pill */}
          <TouchableOpacity
            onPress={toggleStatus}
            activeOpacity={0.85}
            className={`flex-row items-center px-3 py-1.5 rounded-full border ${isOnline
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-slate-50 border-slate-100'
              }`}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full mr-2 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            <Text
              className={`text-[10px] font-bold tracking-wider uppercase ${isOnline ? 'text-emerald-700' : 'text-slate-500'
                }`}
            >
              {isOnline ? 'Bật' : 'Tắt'}
            </Text>
          </TouchableOpacity>

          {/* Notification */}
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center"
          >
            <Icon name="bell-outline" size={20} color="#334155" />
            <View className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white items-center justify-center">
              <Text className="text-white text-[7px] font-black">2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

