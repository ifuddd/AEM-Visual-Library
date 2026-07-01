/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  images: {
    domains: [
      'localhost',
      'placehold.co',
      // Add your Azure Blob Storage domain
      // e.g., 'yourstorageaccount.blob.core.windows.net'
    ],
  },
  // Rewrites removed - using Next.js API routes instead of external backend
};

module.exports = nextConfig;
