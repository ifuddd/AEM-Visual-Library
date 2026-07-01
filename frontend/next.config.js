/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      // Add your Azure Blob Storage domain
      // e.g., 'yourstorageaccount.blob.core.windows.net'
    ],
  },
  // Rewrites removed - using Next.js API routes instead of external backend
};

module.exports = nextConfig;
