import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'], // Add your domains here
    },
  },
};

export default nextConfig;
