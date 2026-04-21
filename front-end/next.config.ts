import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    customWorkerSrc: "worker",
    fallbacks: {
        document: "/offline",
    },
    workboxOptions: {
        skipWaiting: true,
        runtimeCaching: [
            {
                urlPattern:
                    /^https:\/\/(api\.mapbox\.com|.*\.goong\.io|tile\.openstreetmap\.org)/,
                handler: "CacheFirst",
                options: {
                    cacheName: "map-tiles",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    },
                },
            },
            {
                urlPattern: /^https?:\/\/.*\/api\/.*$/,
                handler: "NetworkFirst",
                method: "GET",
                options: {
                    cacheName: "api-get-cache",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 24 * 60 * 60, // 24 hours
                    },
                    networkTimeoutSeconds: 10,
                },
            },
        ],
    },
});

const nextConfig: NextConfig = {
    output: "standalone", // Bật lại để build Docker thành công
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "**",
            },
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "firebasestorage.googleapis.com" },
            { protocol: "https", hostname: "www.plug.tech" },
            { protocol: "https", hostname: "gemini.google.com" },
            { protocol: "https", hostname: "th.bing.com" },
            { protocol: "https", hostname: "static.vecteezy.com" },
            { protocol: "https", hostname: "tse3.mm.bing.net" },
            { protocol: "https", hostname: "shop.plug.tech" },
        ],
    },
};

export default withPWA(withNextIntl(nextConfig));
