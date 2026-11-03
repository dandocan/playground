import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${(process.env.API_URL ?? "http://localhost:3001").replace(/\/+$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
