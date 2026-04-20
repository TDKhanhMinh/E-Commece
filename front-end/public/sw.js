importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded');
  
  // 1. Map Tiles (Cache First)
  workbox.routing.registerRoute(
    ({url}) => url.hostname === 'api.mapbox.com' || 
               url.hostname.includes('goong.io') || 
               url.hostname.includes('tile.openstreetmap.org'),
    new workbox.strategies.CacheFirst({
      cacheName: 'map-tiles',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // 2. Spring Boot API (Network First) - ONLY GET
  workbox.routing.registerRoute(
    ({url, request}) => url.pathname.startsWith('/api/') && request.method === 'GET',
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-get-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        }),
      ],
    })
  );

  // 3. Static Assets (Stale While Revalidate)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'style' || 
                   request.destination === 'script' || 
                   request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // 4. Firebase Background Scripts
  importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

  // Khởi tạo Firebase trong Service Worker
  // (Người dùng cần điền thông tin thật ở đây vì process.env không hoạt động trực tiếp trong file static js)
  firebase.initializeApp({
      apiKey: 'AIzaSyBVpalpxZ2Vwo6YtkORs_HNnKPSbFPH_5c',
      authDomain: 'native-app-shipping.firebaseapp.com',
      projectId: 'native-app-shipping',
      storageBucket: 'native-app-shipping.firebasestorage.app',
      messagingSenderId: '534708810182',
      appId: '1:534708810182:web:373d5321e5f974dafd02c7'
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification?.title || 'New Notification';
      const notificationOptions = {
          body: payload.notification?.body,
          icon: '/icons/icon-192x192.png'
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // Sự kiện khi click vào thông báo đẩy
  self.addEventListener('notificationclick', function(event) {
      console.log('Notification click received.');
      event.notification.close();
      event.waitUntil(
          clients.openWindow('/')
      );
  });

} else {
  console.log('Workbox failed to load');
}
