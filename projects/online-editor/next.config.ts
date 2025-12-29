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
  
  // Turbopack config with absolute root path
  turbopack: {
    root: path.resolve(__dirname, '../../')
  },
  
  webpack: (config, { isServer }) => {
    // Pyodide configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
      
      // Ignore pyodide package for client-side bundling
      config.externals = config.externals || [];
      config.externals.push('pyodide');
    }
    
    return config;
  },
};

export default nextConfig;
