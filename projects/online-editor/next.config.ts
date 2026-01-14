import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Cloudflare Pages configuration
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Asset prefix for proper static file serving
  assetPrefix: '',
  
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
  
  // Webpack configuration for Monaco Editor
  webpack: (config, { isServer }) => {
    // Monaco Editor는 클라이언트 사이드에서만 작동
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Monaco Editor 리소스 처리
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });
    
    return config;
  },
};

export default nextConfig;
