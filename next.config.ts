import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    basePath: "/docshield",
    assetPrefix: "/docshield/",
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

export default nextConfig;
