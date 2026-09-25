import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are served from Cloudflare R2's public dev domain
    // (pub-<hash>.r2.dev) — the hash varies per bucket/environment.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
};

export default nextConfig;
