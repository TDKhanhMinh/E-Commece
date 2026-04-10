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
      className="px-5 pb-4 bg-white border-b border-gray-100"
      style={{
        paddingTop: insets.top + spacing.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        {/* Brand Section */}
        <View className="flex-row items-center">
          <View 
            className="w-11 h-11 rounded-2xl items-center justify-center shadow-lg"
            style={{ backgroundColor: '#1E40AF' }} // Indigo-800
          >
            <View className="absolute inset-0 bg-blue-500 opacity-20 rounded-2xl" />
            <Icon name="truck-fast" size={26} color="#FFFFFF" />
          </View>
          <View className="ml-3">
            <Text className="text-[18px] font-black text-slate-900 tracking-tight leading-tight">
              Giao Hàng Việt
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View className="px-1.5 py-0.5 rounded-md bg-slate-100 mr-2">
                <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                  Pro Driver
                </Text>
              </View>
              <Text className="text-[12px] text-slate-400 font-medium">Hành trình mới</Text>
            </View>
          </View>
        </View>

        {/* Action Section */}
        <View className="flex-row items-center gap-3">
          {/* Status Pill */}
          <TouchableOpacity
            onPress={toggleStatus}
            activeOpacity={0.85}
            className={`flex-row items-center px-3.5 py-2 rounded-2xl border ${
              isOnline 
                ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <View 
              className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`} 
            />
            <Text 
              className={`text-[11px] font-black tracking-widest uppercase ${
                isOnline ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            </Text>
          </TouchableOpacity>

          {/* Combined Avatar & Notification */}
          <View className="flex-row items-center ml-1">
            <TouchableOpacity 
              onPress={onNotificationPress}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 items-center justify-center z-10"
            >
              <Icon name="bell-ring-outline" size={20} color="#334155" />
              <View className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 border-2 border-white items-center justify-center">
                <Text className="text-white text-[8px] font-black">2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onAvatarPress}
              activeOpacity={0.7}
              className="-ml-3 w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white shadow-md shadow-black/20"
            >
              <View className="w-full h-full bg-indigo-100 items-center justify-center">
                <Icon name="account-circle" size={28} color="#1E40AF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

