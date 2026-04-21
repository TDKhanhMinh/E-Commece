import Providers from "@/app/provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: "T7M Online Tech Store",
    description: "High-quality technology products and accessories store.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "T7M Online",
    },
    icons: {
        icon: [
            {
                url: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                url: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        apple: [
            {
                url: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning>
            <body>
                <Providers>
                    <Toaster richColors position="top-right" />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
