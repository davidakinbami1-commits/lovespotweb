/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lovespotapp.com' },
    ],
  },
};

export default nextConfig;
