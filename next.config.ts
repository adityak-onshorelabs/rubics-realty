import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: { qualities: [75] },
  poweredByHeader: false,
  // Old static-site URLs (rubicsrealty.com before the rebuild) keep their search equity.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/beaumonte.html", destination: "/projects/beaumonte-tower-c", permanent: true },
      { source: "/media.html", destination: "/press", permanent: true },
      { source: "/media-detail.html", destination: "/press", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
