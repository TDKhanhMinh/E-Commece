import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Notification } from '../types/notifications.types';

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'OUTBOUND':
      return { icon: 'cash-multiple', color: '#10b981' }; // Emerald
    case 'INBOUND':
      return { icon: 'wallet-plus-outline', color: '#3b82f6' }; // Blue
    case 'ORDER_UPDATE':
      return { icon: 'truck-delivery-outline', color: '#f59e0b' }; // Amber
    case 'SYSTEM':
      return { icon: 'cog-outline', color: '#6b7280' }; // Gray
    default:
      return { icon: 'bell-outline', color: '#0f766e' }; // Default Teal
  }
};

const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' +
      date.toLocaleDateString('vi-VN');
  } catch (e) {
    return dateString;
  }
};

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { icon, color } = getNotificationConfig(notification.type);
  const formattedTime = formatTime(notification.createdAt);
  const iconContainerStyle = useMemo(() => ({ backgroundColor: `${color}15` }), [color]);

  return (
    <Card
      variant="elevated"
      className="mb-3 p-4 bg-white rounded-2xl shadow-sm"
      onPress={onPress}
    >
      <View className="flex-row items-start relative">
        {/* Type Icon */}
        <View
          style={iconContainerStyle}
          className="w-12 h-12 rounded-full items-center justify-center"
        >
          <Icon name={icon} size={24} color={color} />
        </View>

        {/* Content */}
        <View className="flex-1 ml-4">
          <Typography variant="body2" className="font-bold text-gray-900 mb-1" numberOfLines={1}>
            {notification.title}
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2 leading-5">
            {notification.message}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {formattedTime}
          </Typography>
        </View>

        {/* Unread Dot */}
        {!notification.isRead && (
          <View className="w-2.5 h-2.5 bg-[#0f766e] rounded-full mt-1 ml-1" />
        )}
      </View>
    </Card>
  );
}
