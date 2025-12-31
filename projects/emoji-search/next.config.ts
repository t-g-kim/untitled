import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Turbopack 설정 (CI 환경에서는 비활성화)
  ...(process.env.CI ? {} : {
    turbopack: {
      root: path.resolve(process.cwd(), '../../')
    }
  }),
};

export default nextConfig;
