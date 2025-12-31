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
  // Turbopack 설정으로 경고 제거
  turbopack: {
    root: require('path').resolve(__dirname, '../../')
  },
};

module.exports = nextConfig;