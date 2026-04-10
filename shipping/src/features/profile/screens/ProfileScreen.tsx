import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { Button } from '@components/ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileHeader } from '../components/ProfileHeader';
import { PerformanceMetrics } from '../components/PerformanceMetrics';
import { ProfileMenu } from '../components/ProfileMenu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@features/auth/hooks/useAuth';
import { ActivityIndicator } from 'react-native-paper';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { logout, isLoggingOut } = useAuth();

  if (isLoggingOut) {
    return (
      <View className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F44336" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 40
        }}
      >
        <ProfileHeader />

        <PerformanceMetrics />

        <ProfileMenu />

        <View className="px-4 mt-8">
          <Button
            variant="outline"
            title="ĐĂNG XUẤT"
            leftIcon={<Icon name="logout" size={20} color="#F44336" />}
            className="border-error text-error"
            onPress={() => logout()}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}
