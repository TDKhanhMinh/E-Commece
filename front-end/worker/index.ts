/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

// This is where Firebase Background Messaging code will be injected/run.
// When Next-PWA triggers, it will bundle this file along with the main service worker
// into `public/sw.js`.

self.addEventListener("push", (event) => {
    // Example Push Event listener to verify custom service worker integration
    console.log("[Custom Worker] push received:", event.data?.text());
    
    // Add real firebase code here:
    // importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js');
    // importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-messaging-compat.js');
    // firebase.initializeApp({...})
    // const messaging = firebase.messaging();
    // messaging.onBackgroundMessage((payload) => { ... })
});

self.addEventListener("notificationclick", (event) => {
    console.log("[Custom Worker] Notification clicked");
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === "/" && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow('/');
            }
        })
    );
});

export {};
