# 🚀 Cloudflare Pages 배포 가이드

온라인 코드 에디터를 Cloudflare Pages에 배포하는 방법을 안내합니다.

## 📋 배포 전 준비사항

### 1. 프로젝트 빌드 테스트
```bash
cd projects/online-editor
npm install
npm run build
```

### 2. 정적 파일 생성 확인
빌드 후 `out` 폴더가 생성되는지 확인하세요. Next.js가 `output: 'export'` 설정으로 정적 파일을 생성합니다.

---

## 🌐 Cloudflare Pages 배포

### 방법 1: GitHub 연동 (추천)

1. **GitHub에 프로젝트 푸시**
   ```bash
   git add .
   git commit -m "Prepare for Cloudflare deployment"
   git push origin main
   ```

2. **Cloudflare Dashboard 설정**
   - [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
   - "Pages" 섹션으로 이동
   - "Create a project" 클릭
   - "Connect to Git" 선택
   - GitHub 저장소 연결

3. **빌드 설정**
   - **Project name**: `online-code-editor` (원하는 이름)
   - **Production branch**: `main`
   - **Root directory**: `projects/online-editor`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node.js version**: `18` (환경 변수에서 설정)

4. **환경 변수 설정**
   ```
   NODE_VERSION = 18
   NPM_FLAGS = --production=false
   ```

### 방법 2: Wrangler CLI 사용

1. **Wrangler 설치**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **프로젝트 빌드**
   ```bash
   cd projects/online-editor
   npm run build
   ```

3. **Cloudflare Pages에 배포**
   ```bash
   wrangler pages deploy out --project-name=online-code-editor
   ```

---

## ⚙️ Cloudflare 최적화 설정

### 1. 캐싱 규칙 설정

Cloudflare Dashboard에서 다음 캐싱 규칙을 설정하세요:

```
# 정적 자산 캐싱 (1년)
/_next/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 year

# 매니페스트 파일 (즉시 만료)
/manifest.json
Cache Level: Bypass
```

### 2. 보안 헤더 설정

Cloudflare Dashboard의 Pages 설정에서 다음 헤더를 추가하세요:

**Pages > 프로젝트 > Settings > Functions > Custom Headers**

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
```

> **참고**: Next.js의 `output: 'export'` 모드에서는 `headers` 설정이 작동하지 않으므로, Cloudflare에서 직접 설정해야 합니다.

### 3. 리다이렉트 규칙

SPA 라우팅을 위한 리다이렉트 설정:

```
# _redirects 파일 생성 (public 폴더에)
/*    /index.html   200
```

---

## 🔧 성능 최적화

### 1. Cloudflare 기능 활용

- **Auto Minify**: HTML, CSS, JS 자동 압축
- **Brotli Compression**: 더 나은 압축률
- **Rocket Loader**: JavaScript 로딩 최적화
- **Polish**: 이미지 최적화

### 2. CDN 설정

```javascript
// 정적 자산 URL 최적화
const CDN_URL = 'https://your-domain.pages.dev';
```

---

## 🚨 주의사항

### 1. Pyodide 로딩
Cloudflare Pages에서 Pyodide가 정상 작동하도록 CORS 헤더가 올바르게 설정되어 있는지 확인하세요.

### 2. 메모리 제한
Cloudflare Pages는 메모리 제한이 있으므로, 큰 파일 처리 시 주의가 필요합니다.

### 3. 빌드 시간
복잡한 빌드의 경우 Cloudflare의 빌드 시간 제한(20분)을 고려하세요.

---

## 📊 모니터링

### 1. Cloudflare Analytics
- 페이지 뷰 및 성능 메트릭
- 지역별 트래픽 분석
- 보안 이벤트 모니터링

### 2. Web Vitals 추적
```javascript
// Google Analytics 4 연동
// src/app/layout.tsx에 추가
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

---

## 🔐 보안 설정

### 1. WAF (Web Application Firewall)
Cloudflare의 WAF 규칙을 활용하여 악성 트래픽을 차단하세요.

### 2. Rate Limiting
API 엔드포인트에 대한 요청 제한을 설정하세요.

### 3. Bot Management
봇 트래픽을 관리하고 정당한 사용자만 접근하도록 설정하세요.

---

## 📝 배포 체크리스트

- [ ] GitHub 저장소 연결 완료
- [ ] 빌드 설정 올바르게 구성
- [ ] 환경 변수 설정 완료
- [ ] 도메인 연결 (선택사항)
- [ ] SSL 인증서 자동 설정 확인
- [ ] 캐싱 규칙 설정
- [ ] 보안 헤더 설정
- [ ] 리다이렉트 규칙 설정
- [ ] 성능 최적화 기능 활성화
- [ ] 모니터링 도구 설정

---

## 🎉 배포 완료

배포가 완료되면 `https://your-project-name.pages.dev` 또는 연결한 커스텀 도메인에서 온라인 코드 에디터를 사용할 수 있습니다!

### 추가 기능
- **자동 배포**: GitHub에 푸시할 때마다 자동으로 배포됩니다
- **프리뷰 배포**: Pull Request마다 미리보기 환경이 생성됩니다
- **롤백**: 이전 버전으로 쉽게 되돌릴 수 있습니다

Cloudflare Pages의 강력한 CDN과 보안 기능을 통해 빠르고 안전한 온라인 코드 에디터를 제공할 수 있습니다! 🚀