import type { NextConfig } from 'next';

// Uploaded photos (avatars, person/item photos) are served from the API
// host, which varies by environment (prod domain, localhost in dev).
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'https://api.retrouve-moi.com/api');

const nextConfig: NextConfig = {
  output: 'standalone',
  // Share-image routes read these TTFs at runtime (Satori can't use woff2).
  outputFileTracingIncludes: {
    '/**': ['./assets/fonts/**'],
  },
  compress: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
        port: '8000',
      },
    ],
  },
};

export default nextConfig;
