import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [process.env.CLOUDFRONT_DOMAIN || 'localhost'],

  }
};

export default nextConfig;
