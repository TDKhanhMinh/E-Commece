import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useAppNavigation, navigationRef } from '@navigation/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Typography } from '@components/ui/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationFilter, NotificationType } from '../components/NotificationFilter';
import { NotificationItem } from '../components/NotificationItem';
import { useAllNotifications, useMarkAllRead } from '../hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';

export function NotificationsScreen() {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');

  // Fetch real data from API with activeFilter as part of the query key
  const { data: notifications = [], isLoading, isError, refetch } = useAllNotifications(activeFilter);
  const markAllRead = useMarkAllRead();
  console.log("notification", notifications);


  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllRead.mutateAsync();
      setSnackbar({
        visible: true,
        message: 'Đã đánh dấu đọc tất cả thông báo',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to mark all read:', error);
      setSnackbar({
        visible: true,
        message: 'Có lỗi xảy ra khi đánh dấu đọc thông báo',
        type: 'error'
      });
    }
  }, [markAllRead]);

  const handleGoBack = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  const headerStyle = useMemo(() => ({ paddingTop: insets.top + 12 }), [insets.top]);
  const contentContainerStyle = useMemo(() => ({
    paddingBottom: insets.bottom + 24,
    paddingHorizontal: 16
  }), [insets.bottom]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0f766e" />
          <Typography variant="body2" className="text-gray-400 mt-2">
            Đang tải thông báo...
          </Typography>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center px-10">
          <Icon name="alert-circle-outline" size={64} color="#ef4444" />
          <Typography variant="body1" className="text-gray-500 mt-4 text-center">
            Đã xảy ra lỗi khi tải thông báo. Vui lòng thử lại.
          </Typography>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-4 bg-[#0f766e] px-6 py-2 rounded-full"
          >
            <Typography variant="body2" className="text-white font-bold">Thử lại</Typography>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId.toString()}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => console.log('Notification pressed:', item.notificationId)}
          />
        )}
        contentContainerStyle={contentContainerStyle}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#0f766e" />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Icon name="bell-off-outline" size={64} color="#d1d5db" />
            <Typography variant="body1" className="text-gray-400 mt-4">
              Không có thông báo nào
            </Typography>
          </View>
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={headerStyle} className="bg-white border-b border-gray-100">
        <View className="px-4 pb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleGoBack}
              className="w-10 h-10 items-center justify-center -ml-2"
            >
              <Icon name="chevron-left" size={28} color="#1f2937" />
            </TouchableOpacity>
            <Typography variant="h6" className="font-bold ml-1 text-[#0f766e]">
              TẤT CẢ THÔNG BÁO
            </Typography>
          </View>

          <TouchableOpacity
            onPress={handleMarkAllRead}
            disabled={markAllRead.isPending}
          >
            <Typography variant="body2" className="text-[#0f766e] font-semibold">
              Đọc tất cả
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <NotificationFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Main Content */}
      <View className="flex-1">
        {renderContent()}
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
        duration={3000}
        style={{
          backgroundColor: snackbar.type === 'success' ? '#0f766e' : '#ef4444',
          marginBottom: insets.bottom + 16,
        }}
        action={{
          label: 'Đóng',
          onPress: () => setSnackbar(prev => ({ ...prev, visible: false })),
          textColor: '#fff'
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
