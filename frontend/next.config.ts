import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are served from Cloudflare R2's public dev domain
    // (pub-<hash>.r2.dev) — the hash varies per bucket/environment. If this
    // is ever pointed at a custom R2 domain instead, add that hostname here
    // too (see the image performance audit notes on why a custom domain is
    // recommended).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
    // R2 keys are immutable (see config/r2.ts) and now send a matching
    // long-lived Cache-Control, so Next's own optimizer cache (used whenever
    // an image isn't served `unoptimized`) can safely hold onto resized
    // variants for just as long instead of the 60s default.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
