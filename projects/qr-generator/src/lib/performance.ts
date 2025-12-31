// Performance optimization utilities

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Lazy load images
 */
export const lazyLoadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Measure Core Web Vitals
 */
export interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
}

export const measureWebVitals = (): Promise<WebVitals> => {
  return new Promise((resolve) => {
    const vitals: WebVitals = {};
    
    // Measure FCP
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitals.FCP = entry.startTime;
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }

    // Simple fallback measurements
    setTimeout(() => {
      resolve(vitals);
    }, 1000);
  });
};

/**
 * Optimize QR code generation performance
 */
export const optimizeQRGeneration = {
  // Cache generated QR codes to avoid regeneration
  cache: new Map<string, string>(),
  
  getCached(text: string, options: any): string | null {
    const key = `${text}-${JSON.stringify(options)}`;
    return this.cache.get(key) || null;
  },
  
  setCached(text: string, options: any, dataURL: string): void {
    const key = `${text}-${JSON.stringify(options)}`;
    this.cache.set(key, dataURL);
    
    // Limit cache size to prevent memory issues
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  },
  
  clearCache(): void {
    this.cache.clear();
  }
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload QR code library if not already loaded
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = '/qrcode.min.js';
    document.head.appendChild(link);
  }
};

/**
 * Monitor performance metrics
 */
export const performanceMonitor = {
  startTime: 0,
  
  start(): void {
    this.startTime = performance.now();
  },
  
  end(label: string): number {
    const duration = performance.now() - this.startTime;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  },
  
  measure<T>(label: string, fn: () => T): T {
    this.start();
    const result = fn();
    this.end(label);
    return result;
  },
  
  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start();
    const result = await fn();
    this.end(label);
    return result;
  }
};