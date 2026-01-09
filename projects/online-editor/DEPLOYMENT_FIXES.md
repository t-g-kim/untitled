# 🔧 Cloudflare 배포 문제 해결 가이드

## 🚨 발견된 문제점들

### 1. 보안 헤더 설정 문제
- **문제**: 너무 엄격한 CORS 정책으로 인한 사이트 로딩 실패
- **해결**: `_headers` 파일의 보안 정책을 완화하여 호환성 개선

### 2. 정적 자산 서빙 문제
- **문제**: `_redirects` 파일의 순서 및 누락된 파일 타입
- **해결**: 정적 자산 우선순위 조정 및 CSS, JS 파일 타입 추가

### 3. Manifest.json 404 에러
- **문제**: HTML에서 manifest.json 링크가 제거되었지만 여전히 404 에러 발생
- **해결**: Cloudflare Functions 미들웨어로 동적 manifest.json 제공

## 🛠️ 적용된 해결책

### 1. _headers 파일 최적화
```
# 완화된 보안 정책
/*
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; ...
```

### 2. _redirects 파일 개선
```
# 정적 자산 우선 처리
/_next/*  /_next/:splat  200
/manifest.json  /manifest.json  200
/*.css  /:splat.css  200
/*.js  /:splat.js  200
```

### 3. Cloudflare Functions 미들웨어
- manifest.json 요청을 동적으로 처리
- 404 에러 시 기본 manifest 반환
- 올바른 Content-Type 헤더 설정

### 4. HTML 최적화
- DOCTYPE 선언 추가
- Content-Type 메타 태그 명시
- 조건부 manifest.json 로딩

## 📋 배포 체크리스트

### ✅ 완료된 작업
- [x] 보안 헤더 완화
- [x] 정적 자산 서빙 최적화
- [x] Manifest.json 동적 처리
- [x] HTML 구조 최적화
- [x] Cloudflare Functions 설정
- [x] wrangler.toml 설정 파일 생성

### 🔄 배포 단계
1. **코드 푸시**
   ```bash
   git add .
   git commit -m "Fix Cloudflare deployment issues"
   git push origin main
   ```

2. **Cloudflare Pages 설정**
   - Root directory: `projects/online-editor`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: `18`

3. **환경 변수 설정**
   ```
   NODE_VERSION = 18
   NPM_FLAGS = --production=false
   ```

## 🔍 문제 진단 방법

### 1. 브라우저 개발자 도구 확인
- Network 탭에서 실패한 요청 확인
- Console 탭에서 JavaScript 에러 확인
- Security 탭에서 CORS 에러 확인

### 2. Cloudflare 로그 확인
- Functions 로그에서 에러 메시지 확인
- Real-time logs에서 요청 처리 상태 확인

### 3. 일반적인 문제들
- **빈 화면**: CSP 정책이 너무 엄격
- **404 에러**: _redirects 순서 문제
- **JavaScript 에러**: 정적 자산 로딩 실패
- **Manifest 에러**: 동적 처리 미설정

## 🚀 성능 최적화

### 1. 캐싱 전략
- 정적 자산: 1년 캐싱
- HTML: 캐싱 비활성화
- Manifest: 1시간 캐싱

### 2. 압축 설정
- Cloudflare Auto Minify 활성화
- Brotli 압축 활성화

### 3. 모니터링
- Web Vitals 추적
- Error tracking 설정
- Performance monitoring

## 📞 추가 지원

문제가 지속되는 경우:
1. Cloudflare Community 포럼 확인
2. GitHub Issues에 문제 보고
3. 로그 파일과 함께 상세한 에러 메시지 제공

---

**마지막 업데이트**: 2024년 1월
**상태**: 배포 준비 완료 ✅