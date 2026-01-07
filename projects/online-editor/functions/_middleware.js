// Cloudflare Pages Functions - Middleware
// manifest.json에 대한 올바른 Content-Type 헤더 설정 및 파일 존재 확인

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // manifest.json 요청 처리
  if (url.pathname === '/manifest.json' || url.pathname === '/manifest.json/') {
    try {
      const response = await next();
      
      // 404인 경우 직접 manifest.json 파일을 반환
      if (response.status === 404) {
        const manifestContent = {
          "name": "Code Playground - Multi-Language Online Editor",
          "short_name": "Code Playground",
          "description": "Write, run, and share code in multiple languages in your browser",
          "start_url": "/",
          "display": "standalone",
          "background_color": "#111827",
          "theme_color": "#1F2937",
          "orientation": "landscape-primary",
          "categories": ["developer", "productivity", "education"],
          "icons": [
            {
              "src": "/favicon.svg",
              "sizes": "any",
              "type": "image/svg+xml",
              "purpose": "any maskable"
            },
            {
              "src": "/icon.svg",
              "sizes": "32x32",
              "type": "image/svg+xml"
            },
            {
              "src": "/apple-touch-icon.svg",
              "sizes": "180x180",
              "type": "image/svg+xml"
            },
            {
              "src": "/icon-192.svg",
              "sizes": "192x192",
              "type": "image/svg+xml"
            },
            {
              "src": "/icon-512.svg",
              "sizes": "512x512",
              "type": "image/svg+xml"
            }
          ],
          "shortcuts": [
            {
              "name": "Python Editor",
              "short_name": "Python",
              "description": "Open Python code editor",
              "url": "/?lang=python",
              "icons": [{ "src": "/icon.svg", "sizes": "32x32" }]
            },
            {
              "name": "JavaScript Editor",
              "short_name": "JavaScript",
              "description": "Open JavaScript code editor",
              "url": "/?lang=javascript",
              "icons": [{ "src": "/icon.svg", "sizes": "32x32" }]
            }
          ]
        };
        
        return new Response(JSON.stringify(manifestContent, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
      
      // 파일이 존재하는 경우 헤더만 수정
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Content-Type', 'application/manifest+json');
      newHeaders.set('Cache-Control', 'public, max-age=3600');
      newHeaders.set('X-Content-Type-Options', 'nosniff');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (error) {
      // 에러 발생 시 기본 manifest 반환
      const manifestContent = {
        "name": "Code Playground - Multi-Language Online Editor",
        "short_name": "Code Playground",
        "description": "Write, run, and share code in multiple languages in your browser",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#111827",
        "theme_color": "#1F2937",
        "icons": [
          {
            "src": "/favicon.svg",
            "sizes": "any",
            "type": "image/svg+xml"
          }
        ]
      };
      
      return new Response(JSON.stringify(manifestContent, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/manifest+json',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  }
  
  return next();
}

