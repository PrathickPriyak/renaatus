import type { NextConfig } from "next";
import {
  IMAGE_OPTIMIZATION_CACHE_TTL_SECONDS,
  PUBLIC_ASSET_CACHE_CONTROL,
} from "./src/lib/performance/cache-headers";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  serverExternalPackages: ["@prisma/client", "pg", "exceljs", "argon2"],
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    minimumCacheTTL: IMAGE_OPTIMIZATION_CACHE_TTL_SECONDS,
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.cloudflarestorage.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/realty", destination: "/projects?type=realty", permanent: false },
      {
        source: "/infrastructure",
        destination: "/projects?type=infrastructure",
        permanent: false,
      },
      { source: "/journal", destination: "/blog", permanent: false },
      { source: "/journal/:path*", destination: "/blog/:path*", permanent: false },
    ];
  },
  async headers() {
    const privateRobots = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      { source: "/admin", headers: privateRobots },
      { source: "/admin/:path*", headers: privateRobots },
      { source: "/login", headers: privateRobots },
      { source: "/api/:path*", headers: privateRobots },
      { source: "/private", headers: privateRobots },
      { source: "/private/:path*", headers: privateRobots },
      { source: "/design-system", headers: privateRobots },
      { source: "/design-system/:path*", headers: privateRobots },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE_CONTROL }],
      },
    ];
  },
};

export default nextConfig;
