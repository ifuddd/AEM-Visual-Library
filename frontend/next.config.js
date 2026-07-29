/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Deliberately not using output: 'standalone', that mode is for self-hosted
  // Docker/Node deployments, and Next 14.0.x's file-trace copier breaks in this
  // npm-workspaces monorepo layout (hoisted node_modules) regardless of
  // outputFileTracingRoot. This project deploys via Vercel / Azure Static Web
  // Apps, neither of which needs or benefits from standalone output.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      ...(process.env.NODE_ENV === 'development'
        ? [{ protocol: 'http', hostname: 'localhost', port: '3000' }]
        : []),
      // TODO: replace with your specific storage account hostname before production deployment
      // e.g. hostname: 'myaccount.blob.core.windows.net'
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
