import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  // proxy /api/* dan /sanctum/* ke backend Laravel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://hobbyco-be.ronzzyt.id/api/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: 'https://hobbyco-be.ronzzyt.id/sanctum/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'z-cdn.chatglm.cn',
        pathname: '/image-search-mcp/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
