import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Typography } from '@components/ui/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationFilter, NotificationType } from '../components/NotificationFilter';
import { NotificationItem, Notification } from '../components/NotificationItem';

const MOCK_NOTIFICATIONS: Notification[] = [
  // ... (giữ nguyên dữ liệu mock)
  {
    id: '1',
    title: 'Đơn hàng mới đến',
    body: 'Đơn #2411-005 | Q.1 -> Q.3 | +25.000 đ',
    timestamp: '10:30, 24/10/2023',
    type: 'orders',
    icon: 'truck-fast',
    iconColor: '#0f766e',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Đơn hàng hoàn thành',
    body: 'Khách Nguyễn Văn A nhận đơn #2411-001',
    timestamp: '08:15, 23/10/2023',
    type: 'orders',
    icon: 'package-variant-closed',
    iconColor: '#10b981',
    isUnread: true,
  },
  {
    id: '3',
    title: 'Đơn hàng bị hủy',
    body: 'Đơn #2410-099 bởi khách hàng',
    timestamp: '16:45, 22/10/2023',
    type: 'orders',
    icon: 'truck-remove',
    iconColor: '#ef4444',
    isUnread: false,
  },
  {
    id: '4',
    title: 'Cập nhật ứng dụng',
    body: 'v2.1.0 mới với tối ưu bản đồ',
    timestamp: '09:00, 21/10/2023',
    type: 'system',
    icon: 'cog-outline',
    iconColor: '#6b7280',
    isUnread: false,
  },
  {
    id: '5',
    title: 'Cập nhật số dư',
    body: 'Phí dịch vụ đơn #2411-001 (+22.500 đ)',
    timestamp: '12:00, 20/10/2023',
    type: 'updates',
    icon: 'cash-multiple',
    iconColor: '#f59e0b',
    isUnread: false,
  },
];

export function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');

  const filteredNotifications = MOCK_NOTIFICATIONS.filter(notif =>
    activeFilter === 'all' || notif.type === activeFilter
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with Safe Area Top */}
      <View 
        className="bg-white px-4 pb-3 flex-row items-center border-b border-gray-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Icon name="chevron-left" size={28} color="#1f2937" />
        </TouchableOpacity>
        <Typography variant="h6" className="font-bold ml-1 text-[#0f766e]">
          TẤT CẢ THÔNG BÁO
        </Typography>
      </View>

      {/* Filters */}
      <NotificationFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* List with Safe Area Bottom */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => console.log('Notification pressed:', item.id)}
          />
        )}
        contentContainerStyle={{ 
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16 
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Icon name="bell-off-outline" size={64} color="#d1d5db" />
            <Typography variant="body1" className="text-gray-400 mt-4">
              Không có thông báo nào
            </Typography>
          </View>
        }
      />
    </View>
  );
}
