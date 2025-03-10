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
    },
    distDir: "out",  // Fuerza a Next.js a usar "out"
};

export default nextConfig;
