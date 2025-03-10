import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    basePath: "/docshield",
    assetPrefix: "/docshield/",
};

export default nextConfig;
