"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        workbox: any;
    }
}

export default function PWARegistration() {
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "serviceWorker" in navigator &&
            window.workbox === undefined
        ) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
                .catch((err) => console.error("Service Worker registration failed:", err));
        }
    }, []);

    return null;
}
