'use client';

import { useEffect, useRef } from 'react';

interface HTMLPreviewProps {
  htmlContent: string;
  isVisible: boolean;
}

export default function HTMLPreview({ htmlContent, isVisible }: HTMLPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent && isVisible) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="h-full bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="HTML Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}