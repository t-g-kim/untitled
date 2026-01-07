'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const NoSSRWrapper = ({ children, fallback }: NoSSRProps) => {
  return <>{children}</>;
};

const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading Code Playground...</p>
        <p className="text-sm text-gray-500 mt-2">If this takes too long, please refresh the page</p>
      </div>
    </div>
  ),
});

export default NoSSR;