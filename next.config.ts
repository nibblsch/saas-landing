import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/auth/callback",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
