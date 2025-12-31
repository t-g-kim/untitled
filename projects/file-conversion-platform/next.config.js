const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Cloudflare Pages용
  },
  output: 'export',
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Turbopack 설정 (CI 환경에서는 비활성화)
  ...(process.env.CI ? {} : {
    turbopack: {
      root: path.resolve(__dirname, '../../')
    }
  }),
};

module.exports = nextConfig;