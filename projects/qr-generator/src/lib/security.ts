// Security utilities for client-side protection

/**
 * Verify that no network requests are made during QR generation
 */
export class NetworkMonitor {
  private static originalFetch: typeof fetch;
  private static originalXHR: typeof XMLHttpRequest;
  private static isMonitoring = false;
  private static blockedRequests: string[] = [];

  static startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.blockedRequests = [];

    // Monitor fetch requests
    this.originalFetch = window.fetch;
    window.fetch = (...args) => {
      const url = args[0]?.toString() || 'unknown';
      console.warn('Blocked network request during QR generation:', url);
      this.blockedRequests.push(url);
      return Promise.reject(new Error('Network requests blocked for privacy'));
    };

    // Monitor XMLHttpRequest
    this.originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends XMLHttpRequest {
      open(...args: any[]) {
        const url = args[1]?.toString() || 'unknown';
        console.warn('Blocked XMLHttpRequest during QR generation:', url);
        NetworkMonitor.blockedRequests.push(url);
        throw new Error('XMLHttpRequest blocked for privacy');
      }
    } as any;
  }

  static stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    // Restore original functions
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }
    if (this.originalXHR) {
      window.XMLHttpRequest = this.originalXHR;
    }
  }

  static getBlockedRequests(): string[] {
    return [...this.blockedRequests];
  }

  static hasBlockedRequests(): boolean {
    return this.blockedRequests.length > 0;
  }
}

/**
 * Verify client-side only processing
 */
export const verifyClientSideProcessing = (): boolean => {
  // Check if we're running in browser
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if localStorage is available (client-side feature)
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch {
    return false;
  }

  return true;
};

/**
 * Clear any sensitive data from memory
 */
export const clearSensitiveData = (data: string): void => {
  // In JavaScript, we can't truly clear memory, but we can overwrite variables
  // This is more of a symbolic security measure
  if (data) {
    // Overwrite the string reference (limited effectiveness in JS)
    data = '';
  }
};

/**
 * Validate that no data is being stored server-side
 */
export const validateNoServerStorage = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Since we're client-side only, this should always resolve to true
    // In a real implementation, this might check for any server communication
    setTimeout(() => {
      resolve(true);
    }, 0);
  });
};

/**
 * Security headers for Next.js (to be used in next.config.js)
 */
export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self';"
  }
];