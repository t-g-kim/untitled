const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  basePath: '',
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig