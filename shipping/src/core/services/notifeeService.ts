import notifee, { AndroidImportance, FirebaseMessagingTypes } from '@notifee/react-native';

/**
 * Notifee Service
 * Handles displaying native system notification banners when the app is in the foreground.
 */
class NotifeeService {
  private channelId: string = 'default';

  /**
   * Initialize a default channel for Android.
   * Channels are mandatory for showing notifications on Android 8.0+.
   */
  async setupChannel() {
    this.channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  }

  /**
   * Show a system notification banner.
   * @param message The remote message received from FCM.
   */
  async displayNotification(message: FirebaseMessagingTypes.RemoteMessage) {
    // Ensure channel is ready (safety)
    await this.setupChannel();

    await notifee.displayNotification({
      title: message.notification?.title || 'Thông báo mới',
      body: message.notification?.body || '',
      android: {
        channelId: this.channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  }
}

export const notifeeService = new NotifeeService();
