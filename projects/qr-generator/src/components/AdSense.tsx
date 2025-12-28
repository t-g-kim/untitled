'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = ''
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ad to AdSense queue
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle as any[]).push({});
      }
    } catch (error) {
      console.error('AdSense loading error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// Placeholder AdSense component for development
export function AdSensePlaceholder({ 
  width = '100%', 
  height = '250px',
  className = '',
  label = '광고'
}: {
  width?: string;
  height?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div 
      className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="text-gray-400 text-sm font-medium">{label}</div>
        <div className="text-gray-300 text-xs mt-1">{width} × {height}</div>
      </div>
    </div>
  );
}

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}