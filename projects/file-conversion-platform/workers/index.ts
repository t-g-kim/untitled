/**
 * Cloudflare Workers - 파일 변환 API
 * 
 * 주요 기능:
 * - 파일 업로드 Signed URL 생성
 * - 파일 변환 처리
 * - 다운로드 URL 생성
 */

import { RateLimiter, getClientIP, RATE_LIMIT_CONFIGS } from './rate-limiter';

export interface Env {
  FILE_BUCKET: R2Bucket;
  CACHE: KVNamespace;
  MAX_FILE_SIZE: string;
  FILE_TTL_HOURS: string;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const clientIP = getClientIP(request);

    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Rate Limiting 적용
      let rateLimiter: RateLimiter | null = null;
      
      if (env.CACHE) {
        switch (path) {
          case '/api/upload-url':
            rateLimiter = new RateLimiter(env.CACHE, RATE_LIMIT_CONFIGS.UPLOAD);
            break;
          case '/api/convert':
            rateLimiter = new RateLimiter(env.CACHE, RATE_LIMIT_CONFIGS.CONVERT);
            break;
          case '/api/download':
            rateLimiter = new RateLimiter(env.CACHE, RATE_LIMIT_CONFIGS.DOWNLOAD);
            break;
          default:
            rateLimiter = new RateLimiter(env.CACHE, RATE_LIMIT_CONFIGS.API);
        }

        const rateLimitResult = await rateLimiter.checkLimit(clientIP);
        
        if (!rateLimitResult.allowed) {
          return rateLimiter.createRateLimitResponse(rateLimitResult, corsHeaders);
        }

        // Rate Limit 헤더를 모든 응답에 추가
        Object.assign(corsHeaders, rateLimiter.getRateLimitHeaders(rateLimitResult));
      }

      // API 라우팅
      switch (path) {
        case '/api/upload-url':
          return handleUploadUrl(request, env, corsHeaders);
        
        case '/api/convert':
          return handleConvert(request, env, corsHeaders);
        
        case '/api/status':
          return handleStatus(request, env, corsHeaders);
        
        case '/api/download':
          return handleDownload(request, env, corsHeaders);
        
        case '/api/health':
          return handleHealth(request, env, corsHeaders);
        
        default:
          return new Response(JSON.stringify({ 
            error: 'Not Found',
            path,
            availableEndpoints: [
              '/api/upload-url',
              '/api/convert', 
              '/api/status',
              '/api/download',
              '/api/health'
            ]
          }), { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: env.ENVIRONMENT === 'development' ? error.message : 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

/**
 * 파일 업로드용 Signed URL 생성
 */
async function handleUploadUrl(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { fileName, fileSize, contentType } = await request.json();

    // 입력 검증
    if (!fileName || !fileSize || !contentType) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: fileName, fileSize, contentType' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 파일 크기 검증
    const maxSize = parseInt(env.MAX_FILE_SIZE || '52428800'); // 기본 50MB
    if (fileSize > maxSize) {
      return new Response(JSON.stringify({ 
        error: 'File too large',
        maxSize: maxSize,
        maxSizeMB: Math.round(maxSize / 1024 / 1024)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 파일 타입 검증
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(contentType)) {
      return new Response(JSON.stringify({ 
        error: 'Unsupported file type',
        allowedTypes,
        receivedType: contentType
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 파일명 안전성 검증
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExtension = sanitizedFileName.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !['pdf', 'doc', 'docx'].includes(fileExtension)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid file extension',
        allowedExtensions: ['pdf', 'doc', 'docx']
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 고유 파일 키 생성 (타임스탬프 + UUID + 원본 파일명)
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const fileKey = `uploads/${timestamp}-${uuid}-${sanitizedFileName}`;
    const sessionId = crypto.randomUUID();

    // R2 Signed URL 생성 (1시간 유효)
    try {
      // 실제 R2 signed URL 생성 (현재는 시뮬레이션)
      const uploadUrl = `https://your-bucket.r2.cloudflarestorage.com/${fileKey}?X-Amz-Expires=3600&X-Amz-Signature=...`;
      
      // 세션 정보를 KV에 저장 (선택적)
      if (env.CACHE) {
        await env.CACHE.put(`session:${sessionId}`, JSON.stringify({
          fileKey,
          fileName: sanitizedFileName,
          fileSize,
          contentType,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString() // 1시간 후
        }), { expirationTtl: 3600 });
      }

      return new Response(JSON.stringify({
        uploadUrl,
        fileKey,
        sessionId,
        expiresIn: 3600, // 초 단위
        maxFileSize: maxSize
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (r2Error) {
      console.error('R2 signed URL generation failed:', r2Error);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate upload URL',
        details: env.ENVIRONMENT === 'development' ? r2Error.message : undefined
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Upload URL request error:', error);
    return new Response(JSON.stringify({ 
      error: 'Invalid request format',
      details: env.ENVIRONMENT === 'development' ? error.message : undefined
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 파일 변환 처리
 */
async function handleConvert(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { fileKey, sourceFormat, targetFormat, sessionId, options } = await request.json();

    // 작업 ID 생성
    const jobId = crypto.randomUUID();

    // 변환 작업을 큐에 추가 (실제 구현에서는 Queue나 Durable Objects 사용)
    // 현재는 즉시 처리하는 것으로 시뮬레이션
    
    // 파일 다운로드
    const sourceFile = await env.FILE_BUCKET.get(fileKey);
    if (!sourceFile) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // TODO: 실제 변환 로직 구현
    // 현재는 시뮬레이션
    const resultKey = `results/${jobId}.${targetFormat}`;
    
    // 변환 결과를 R2에 저장 (24시간 TTL)
    await env.FILE_BUCKET.put(resultKey, sourceFile.body, {
      customMetadata: {
        'ttl': (Date.now() + 24 * 60 * 60 * 1000).toString(),
        'original-file': fileKey,
        'session-id': sessionId
      }
    });

    return new Response(JSON.stringify({
      jobId,
      status: 'completed', // 실제로는 'queued' 또는 'processing'
      estimatedTime: 30,
      resultKey
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Conversion failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 변환 상태 확인
 */
async function handleStatus(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const jobId = url.searchParams.get('jobId');

  if (!jobId) {
    return new Response(JSON.stringify({ error: 'Job ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 실제 구현에서는 KV나 Durable Objects에서 상태 조회
  return new Response(JSON.stringify({
    jobId,
    status: 'completed',
    progress: 100,
    downloadUrl: `/api/download?key=results/${jobId}.docx`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * 파일 다운로드
 */
async function handleDownload(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const fileKey = url.searchParams.get('key');

  if (!fileKey) {
    return new Response('File key required', { status: 400, headers: corsHeaders });
  }

  try {
    const file = await env.FILE_BUCKET.get(fileKey);
    if (!file) {
      return new Response('File not found', { status: 404, headers: corsHeaders });
    }

    // 파일 스트림 반환
    return new Response(file.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': file.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileKey.split('/').pop()}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return new Response('Download failed', { status: 500, headers: corsHeaders });
  }
}

/**
 * 헬스 체크 엔드포인트
 */
async function handleHealth(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT || 'unknown',
    version: '1.0.0',
    services: {
      r2: 'unknown',
      kv: 'unknown'
    }
  };

  // R2 연결 테스트
  try {
    await env.FILE_BUCKET.head('health-check-test');
    health.services.r2 = 'healthy';
  } catch (error) {
    // 파일이 없어도 연결은 정상
    if (error.message?.includes('NoSuchKey') || error.message?.includes('NotFound')) {
      health.services.r2 = 'healthy';
    } else {
      health.services.r2 = 'unhealthy';
      health.status = 'degraded';
    }
  }

  // KV 연결 테스트
  if (env.CACHE) {
    try {
      await env.CACHE.get('health-check-test');
      health.services.kv = 'healthy';
    } catch (error) {
      health.services.kv = 'unhealthy';
      health.status = 'degraded';
    }
  } else {
    health.services.kv = 'not_configured';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return new Response(JSON.stringify(health, null, 2), {
    status: statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}