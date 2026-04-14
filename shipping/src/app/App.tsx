import 'react-native-gesture-handler';
import '../../global.css';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Alert } from 'react-native';
import { AppProvider } from '@providers/AppProvider';
import { RootNavigator } from '@navigation/RootNavigator';
import { useAuthStore } from '@features/auth/store';
import {
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
  onTokenRefresh,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@core/services/firebaseMessaging';
import { notificationService } from '@/features/notifications/service/notification.service';
import { notifeeService } from '@core/services/notifeeService';


function useFCMSetup() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let unsubForeground: (() => void) | undefined;
    let unsubOpenedApp: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;

    async function initFCM() {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.log('[FCM] Notification permission denied');
        return;
      }

      const token = await getFCMToken();
      if (token) {
        await notificationService.subscribe(token);
        console.log('[FCM] Token ready to send to server:', token);
      }

      // 3. Kiểm tra nếu app được mở từ notification (khi app bị kill)
      const initialNotification = await getInitialNotification();
      if (initialNotification) {
        // TODO: Deep link đến màn hình tương ứng dựa trên data
        console.log('[FCM] App opened from quit state via notification');
      }

      // 2. Initialize Notifee
      await notifeeService.setupChannel();

      unsubForeground = onForegroundMessage(async (message) => {
        await notifeeService.displayNotification(message);
      });

      // 5. Lắng nghe khi user tap notification (app đang background)
      unsubOpenedApp = onNotificationOpenedApp((message) => {
        // TODO: Điều hướng đến màn hình Notifications hoặc chi tiết đơn
        console.log('[FCM] User tapped notification:', message.data);
      });

      unsubTokenRefresh = onTokenRefresh(async (newToken) => {
        await notificationService.subscribe(newToken);
        console.log('[FCM] Token refreshed, update server:', newToken);
      });
    }

    initFCM();

    return () => {
      unsubForeground?.();
      unsubOpenedApp?.();
      unsubTokenRefresh?.();
    };
  }, [isAuthenticated]);
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';

  useFCMSetup();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

