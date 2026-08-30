import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'b.zmtcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'menu-ai.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'getrepeat-datastore.s3.ap-southeast-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
