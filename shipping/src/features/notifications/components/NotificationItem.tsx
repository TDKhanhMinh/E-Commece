import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@components/ui/Typography';
import { Card } from '@components/ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'orders' | 'updates' | 'system';
  icon: string;
  iconColor: string;
  isUnread: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <Card
      variant="elevated"
      className="mb-3 mx-4 p-4 bg-white rounded-2xl shadow-sm"
      onPress={onPress}
    >
      <View className="flex-row items-start relative">
        {/* Type Icon */}
        <View 
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: `${notification.iconColor}15` }}
        >
          <Icon name={notification.icon} size={24} color={notification.iconColor} />
        </View>

        {/* Content */}
        <View className="flex-1 ml-4 pr-4">
          <Typography variant="body2" className="font-bold text-gray-900 mb-1">
            {notification.title.toUpperCase()}
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-2 leading-5">
            {notification.body}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {notification.timestamp}
          </Typography>
        </View>

        {/* Unread Dot */}
        {notification.isUnread && (
          <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#0f766e] rounded-full" />
        )}
      </View>
    </Card>
  );
}
