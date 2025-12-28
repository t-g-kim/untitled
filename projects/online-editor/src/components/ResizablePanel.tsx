'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizablePanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number; // percentage (0-100)
  minLeftWidth?: number; // percentage
  maxLeftWidth?: number; // percentage
  className?: string;
  storageKey?: string; // localStorage key to persist panel size
}

export default function ResizablePanel({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 70,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  className = '',
  storageKey
}: ResizablePanelProps) {
  const [leftWidth, setLeftWidth] = useState(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedWidth = parseFloat(saved);
        if (!isNaN(parsedWidth) && parsedWidth >= minLeftWidth && parsedWidth <= maxLeftWidth) {
          return parsedWidth;
        }
      }
    }
    return defaultLeftWidth;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Save to localStorage when width changes
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, leftWidth.toString());
    }
  }, [leftWidth, storageKey]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Clamp the width between min and max
      const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDoubleClick = () => {
    // Double-click to reset to default width
    setLeftWidth(defaultLeftWidth);
  };

  return (
    <div ref={containerRef} className={`flex h-full ${className}`}>
      {/* Left Panel */}
      <div 
        style={{ width: `${leftWidth}%` }}
        className="flex-shrink-0 overflow-hidden"
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 flex-shrink-0 relative group ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize, double-click to reset"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Resize indicator */}
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
            {Math.round(leftWidth)}% | {Math.round(100 - leftWidth)}%
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div 
        style={{ width: `${100 - leftWidth}%` }}
        className="flex-shrink-0 overflow-hidden"
      >
        {rightPanel}
      </div>
    </div>
  );
}