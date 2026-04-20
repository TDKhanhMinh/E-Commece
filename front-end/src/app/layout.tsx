import Providers from "@/app/provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import type { Metadata, Viewport } from "next";
import PWARegistration from "@/components/pwa-registration";

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: "E-Commerce PWA",
    description: "Modern progressive web app with Next.js and Spring Boot",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "E-Commerce PWA",
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
                <PWARegistration />
                <Providers>
                    <Toaster richColors position="top-right" />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
