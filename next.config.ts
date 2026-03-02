import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lovespotapp.com' },
    ],
  },
};

export default nextConfig;
