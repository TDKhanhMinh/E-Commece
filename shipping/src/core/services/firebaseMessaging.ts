import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

/**
 * Firebase Cloud Messaging Service
 * Quản lý tập trung các tương tác với FCM:
 * - Xin quyền thông báo
 * - Lấy/theo dõi device token
 * - Xử lý tin nhắn foreground/background
 */

// ── Permission ───────────────────────────────────────────────────────────────

/**
 * Xin quyền gửi thông báo.
 * - Android 13+ (API 33): Cần xin quyền POST_NOTIFICATIONS rõ ràng.
 * - Android < 13: Tự động được cấp quyền.
 * @returns true nếu được cấp quyền, false nếu bị từ chối.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    // Android 13+ (API 33) cần xin quyền POST_NOTIFICATIONS
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      console.log('[FCM] Notification permission:', granted ? 'GRANTED' : 'DENIED');
      return granted;
    }
    // Android < 13: quyền tự động được cấp
    return true;
  }

  // iOS: sử dụng API riêng của Firebase messaging
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  console.log('[FCM] iOS permission:', enabled ? 'GRANTED' : 'DENIED');
  return enabled;
}

// ── Token ────────────────────────────────────────────────────────────────────

/**
 * Đăng ký thiết bị và lấy FCM token.
 * Token này cần được gửi lên server để server có thể push notification đến thiết bị cụ thể.
 * @returns FCM device token string.
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('[FCM] Device token:', token);
    return token;
  } catch (error) {
    console.error('[FCM] Failed to get token:', error);
    return null;
  }
}

/**
 * Lắng nghe khi FCM token thay đổi (ví dụ: user xóa data app, reinstall).
 * Khi token mới được tạo, cần gửi lên server để cập nhật.
 * @returns Hàm unsubscribe để hủy listener.
 */
export function onTokenRefresh(callback: (token: string) => void): () => void {
  return messaging().onTokenRefresh((token) => {
    console.log('[FCM] Token refreshed:', token);
    callback(token);
  });
}

// ── Message Handlers ─────────────────────────────────────────────────────────

/**
 * Xử lý tin nhắn khi app đang mở (foreground).
 * Thông báo FCM KHÔNG tự động hiển thị trên notification bar khi app foreground,
 * vì vậy chúng ta cần xử lý và hiển thị thủ công (ví dụ: Alert, Toast, In-app banner).
 * @returns Hàm unsubscribe để hủy listener.
 */
export function onForegroundMessage(
  callback?: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('[FCM] Foreground message:', JSON.stringify(remoteMessage, null, 2));

    if (callback) {
      callback(remoteMessage);
    } else {
      // Default: hiển thị Alert đơn giản
      const title = remoteMessage.notification?.title || 'Thông báo mới';
      const body = remoteMessage.notification?.body || '';
      Alert.alert(title, body);
    }
  });
}

/**
 * Đăng ký handler xử lý tin nhắn khi app ở background hoặc bị kill.
 * PHẢI được gọi ở top-level (index.js), TRƯỚC AppRegistry.registerComponent.
 */
export function setupBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('[FCM] Background message:', JSON.stringify(remoteMessage, null, 2));
    // Xử lý data payload ở đây nếu cần (ví dụ: cập nhật badge, lưu local DB)
  });
}

// ── Utilities ────────────────────────────────────────────────────────────────

/**
 * Kiểm tra xem app có được mở từ một notification không.
 * Hữu ích để deep link đến màn hình cụ thể khi user tap notification.
 * @returns RemoteMessage nếu app được mở từ notification, null nếu không.
 */
export async function getInitialNotification(): Promise<FirebaseMessagingTypes.RemoteMessage | null> {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('[FCM] App opened from notification:', JSON.stringify(remoteMessage, null, 2));
  }
  return remoteMessage;
}

/**
 * Lắng nghe khi user tap vào notification trong khi app đang ở background.
 * @returns Hàm unsubscribe.
 */
export function onNotificationOpenedApp(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('[FCM] Notification opened app:', JSON.stringify(remoteMessage, null, 2));
    callback(remoteMessage);
  });
}
