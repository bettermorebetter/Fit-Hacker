import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Cloudflare Workers edge runtime via @opennextjs/cloudflare
  // Server components that use the Node.js runtime need to be adapted
  reactStrictMode: true,
};

export default nextConfig;
