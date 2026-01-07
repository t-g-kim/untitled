// Cloudflare Pages Functions - Middleware
// manifest.json에 대한 올바른 Content-Type 헤더 설정

export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // manifest.json 요청에 대한 헤더 설정
  if (url.pathname === '/manifest.json') {
    const response = await next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Content-Type', 'application/manifest+json');
    newHeaders.set('Cache-Control', 'public, max-age=3600');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
  
  return next();
}

