import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on the client side
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
};

export const requestForToken = async () => {
    try {
        const msg = await messaging();
        if (!msg) return null;

        // Ensure Service Worker is ready before getting token
        const registration = await navigator.serviceWorker.ready;
        
        const currentToken = await getToken(msg, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        if (currentToken) {
            console.log("Current token for client: ", currentToken);
            // TODO: Send the token to the backend server (Spring Boot) here
            return currentToken;
        } else {
            console.log("No registration token available. Request permission to generate one.");
            return null;
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
        return null;
    }
};

export const setupFCMListener = async (callback: (payload: any) => void) => {
    const msg = await messaging();
    if (!msg) return null;

    return onMessage(msg, (payload) => {
        console.log("Foreground message received:", payload);
        callback(payload);
    });
};

export { app, messaging };
