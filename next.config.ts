import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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
        ],
    },
};

export default withNextIntl(nextConfig);
