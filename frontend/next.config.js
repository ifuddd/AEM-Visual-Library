/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Disable optimization for placehold.co to avoid 400 errors
    unoptimized: false,
  },
  // Rewrites removed - using Next.js API routes instead of external backend
};

module.exports = nextConfig;
