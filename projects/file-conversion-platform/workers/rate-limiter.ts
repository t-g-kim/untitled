/**
 * Rate Limiting 유틸리티
 * 
 * IP 기반으로 요청 제한을 구현합니다.
 */

export interface RateLimitConfig {
  windowMs: number; // 시간 윈도우 (밀리초)
  maxRequests: number; // 최대 요청 수
  keyPrefix?: string; // KV 키 접두사
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

export class RateLimiter {
  private kv: KVNamespace;
  private config: RateLimitConfig;

  constructor(kv: KVNamespace, config: RateLimitConfig) {
    this.kv = kv;
    this.config = {
      keyPrefix: 'rate_limit',
      ...config
    };
  }

  /**
   * IP 주소에서 Rate Limit 확인
   */
  async checkLimit(ip: string): Promise<RateLimitResult> {
    const key = `${this.config.keyPrefix}:${ip}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // 현재 요청 기록 조회
      const existingData = await this.kv.get(key);
      let requests: number[] = [];

      if (existingData) {
        const parsed = JSON.parse(existingData);
        requests = parsed.requests || [];
      }

      // 윈도우 밖의 오래된 요청 제거
      requests = requests.filter(timestamp => timestamp > windowStart);

      // 현재 요청 추가
      requests.push(now);

      const totalHits = requests.length;
      const allowed = totalHits <= this.config.maxRequests;
      const remaining = Math.max(0, this.config.maxRequests - totalHits);
      const resetTime = now + this.config.windowMs;

      // KV에 업데이트된 요청 기록 저장
      await this.kv.put(key, JSON.stringify({
        requests,
        lastUpdated: now
      }), {
        expirationTtl: Math.ceil(this.config.windowMs / 1000) + 60 // 여유분 추가
      });

      return {
        allowed,
        remaining,
        resetTime,
        totalHits
      };

    } catch (error) {
      console.error('Rate limiting error:', error);
      // 에러 발생 시 요청 허용 (fail-open)
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
        totalHits: 1
      };
    }
  }

  /**
   * Rate Limit 헤더 생성
   */
  getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
      'X-RateLimit-Limit': this.config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
      'X-RateLimit-Window': Math.ceil(this.config.windowMs / 1000).toString()
    };
  }

  /**
   * Rate Limit 초과 응답 생성
   */
  createRateLimitResponse(result: RateLimitResult, corsHeaders: Record<string, string>): Response {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Try again in ${retryAfter} seconds.`,
      retryAfter,
      limit: this.config.maxRequests,
      windowMs: this.config.windowMs
    }), {
      status: 429,
      headers: {
        ...corsHeaders,
        ...this.getRateLimitHeaders(result),
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString()
      }
    });
  }
}

/**
 * IP 주소 추출 유틸리티
 */
export function getClientIP(request: Request): string {
  // Cloudflare에서 제공하는 실제 클라이언트 IP
  const cfConnectingIP = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // 다른 프록시 헤더들 확인
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = request.headers.get('X-Real-IP');
  if (xRealIP) {
    return xRealIP;
  }

  // 기본값 (실제로는 발생하지 않아야 함)
  return '0.0.0.0';
}

/**
 * 사전 정의된 Rate Limit 설정들
 */
export const RATE_LIMIT_CONFIGS = {
  // 파일 업로드: 시간당 10회
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1시간
    maxRequests: 10,
    keyPrefix: 'upload_limit'
  },

  // 변환 요청: 시간당 20회
  CONVERT: {
    windowMs: 60 * 60 * 1000, // 1시간
    maxRequests: 20,
    keyPrefix: 'convert_limit'
  },

  // 일반 API: 분당 60회
  API: {
    windowMs: 60 * 1000, // 1분
    maxRequests: 60,
    keyPrefix: 'api_limit'
  },

  // 다운로드: 시간당 50회
  DOWNLOAD: {
    windowMs: 60 * 60 * 1000, // 1시간
    maxRequests: 50,
    keyPrefix: 'download_limit'
  }
} as const;