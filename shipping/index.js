/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Đăng ký FCM background handler — PHẢI ở top-level, trước registerComponent
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[FCM] Background message:', JSON.stringify(remoteMessage, null, 2));
});

AppRegistry.registerComponent(appName, () => App);
