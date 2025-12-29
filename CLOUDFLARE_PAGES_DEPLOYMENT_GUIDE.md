# 🚀 Online Editor - Cloudflare Pages 배포 가이드

이 가이드는 온라인 코드 에디터를 Cloudflare Pages에 배포하는 전체 과정을 단계별로 안내합니다.

## ⚠️ 중요: Pages vs Workers

현재 **Workers** 화면에 있으시는 것 같습니다. 온라인 에디터는 **Pages**로 배포해야 합니다!

- **Workers**: 서버리스 함수 (API, 백엔드 로직)
- **Pages**: 정적 사이트 호스팅 (React, Next.js 앱)

## ✅ 사전 준비 확인

### 1. 프로젝트 빌드 테스트
```bash
cd projects/online-editor
npm run build
```
✅ **확인됨**: 빌드가 성공적으로 완료되고 `out/` 폴더가 생성됨

### 2. 필요한 정보
- GitHub 저장소 URL
- Cloudflare 계정 (무료 계정 가능)

---

## 🌐 Step 1: Cloudflare Pages 접속 (중요!)

1. **Cloudflare Dashboard 접속**
   - [https://dash.cloudflare.com/](https://dash.cloudflare.com/) 방문

2. **Pages 섹션으로 이동** ⚠️ **Workers가 아닙니다!**
   - 왼쪽 사이드바에서 **"Pages"** 클릭
   - 또는 직접 [https://dash.cloudflare.com/pages](https://dash.cloudflare.com/pages) 접속
   - **"Workers and Pages"** 탭에서 **"Pages"** 탭 선택

---

## 🔗 Step 2: GitHub 저장소 연결

1. **새 프로젝트 생성**
   - **"Create a project"** 버튼 클릭
   - **"Connect to Git"** 선택

2. **GitHub 연결**
   - **"GitHub"** 선택
   - GitHub 계정 인증 (처음이라면)
   - 저장소 접근 권한 승인

3. **저장소 선택**
   - 모노레포 저장소 선택 (예: `web-tools-monorepo`)
   - **"Begin setup"** 클릭

---

## ⚙️ Step 3: 빌드 설정 구성 (중요!)

### 프로젝트 설정

```
Project name: online-code-editor
Production branch: master
```

### 빌드 설정 (정확히 입력하세요!)

```
Framework preset: Next.js (Static HTML Export)
Root directory: projects/online-editor
Build command: npm install && npm run build
Build output directory: out
```

### 환경 변수 (Advanced settings에서)

**Environment variables** 섹션에서 다음 추가:

```
Variable name: NODE_VERSION
Variable value: 20

Variable name: NPM_FLAGS  
Variable value: --production=false
```

---

## 🚀 Step 4: 배포 실행

1. **설정 확인**
   - 모든 설정이 올바른지 다시 한 번 확인
   - 특히 **Root directory**가 `projects/online-editor`인지 확인

2. **배포 시작**
   - **"Save and Deploy"** 클릭
   - 첫 번째 배포가 시작됨 (약 2-5분 소요)

3. **배포 진행 상황 확인**
   - 실시간으로 빌드 로그 확인 가능
   - 오류 발생 시 로그에서 원인 파악

---

## 🔧 Step 5: 배포 후 설정

### 1. 도메인 설정

**기본 도메인:**
- `online-code-editor.pages.dev` (자동 생성)

**커스텀 도메인 (선택사항):**
1. **Custom domains** 탭 클릭
2. **"Set up a custom domain"** 클릭
3. 도메인 입력 (예: `editor.yourdomain.com`)
4. DNS 설정 안내에 따라 CNAME 레코드 추가

### 2. 보안 헤더 설정

**Functions** → **Custom Headers**에서 다음 추가:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
```

### 3. 캐싱 최적화

**Caching** 섹션에서:
- **Browser Cache TTL**: 4 hours
- **Edge Cache TTL**: 1 month

---

## 🧪 Step 6: 배포 확인 및 테스트

### 1. 기본 기능 테스트

배포된 사이트에서 다음 기능들을 테스트:

- [ ] **페이지 로딩**: 사이트가 정상적으로 로드되는지
- [ ] **언어 선택**: 드롭다운에서 언어 변경 가능한지
- [ ] **코드 에디터**: Monaco 에디터가 정상 작동하는지
- [ ] **JavaScript 실행**: 간단한 JS 코드 실행 테스트
- [ ] **Python 실행**: Pyodide 로딩 및 Python 코드 실행
- [ ] **HTML 미리보기**: HTML 코드의 라이브 프리뷰
- [ ] **로컬 스토리지**: 코드 자동 저장 기능
- [ ] **반응형 디자인**: 모바일/태블릿에서 정상 작동

### 2. 성능 테스트

```bash
# Lighthouse 점수 확인
npx lighthouse https://your-domain.pages.dev --view
```

**목표 점수:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## 🔄 Step 7: 자동 배포 설정

### GitHub Actions 연동 (이미 설정됨)

모노레포에 이미 GitHub Actions가 설정되어 있어서:

1. **자동 빌드**: `projects/online-editor/` 폴더 변경 시 자동 빌드
2. **자동 배포**: main 브랜치에 푸시 시 Cloudflare Pages 자동 배포
3. **프리뷰 배포**: Pull Request 생성 시 미리보기 환경 자동 생성

### 배포 워크플로우

```
코드 변경 → GitHub 푸시 → GitHub Actions 빌드 → Cloudflare Pages 배포
```

---

## 🚨 문제 해결

### 일반적인 문제들

#### 1. package-lock.json 오류
**증상**: "The `npm ci` command can only install with an existing package-lock.json"
**원인**: Cloudflare Pages가 잘못된 디렉토리에서 npm ci를 실행
**해결책**:
1. **Root directory**가 `projects/online-editor`로 정확히 설정되었는지 확인
2. **Build command**를 `npm install && npm run build`로 설정
3. 설정 변경 후 **"Retry deployment"** 클릭

#### 2. 빌드 실패
**증상**: "Build failed" 오류
**해결책**:
```bash
# 로컬에서 빌드 테스트
cd projects/online-editor
npm install
npm run build

# 성공하면 GitHub에 푸시
git add .
git commit -m "Fix build issues"
git push
```

#### 2. Pyodide 로딩 실패
**증상**: Python 코드 실행 시 오류
**해결책**: 보안 헤더가 올바르게 설정되었는지 확인
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

#### 3. 정적 파일 404 오류
**증상**: CSS/JS 파일 로드 실패
**해결책**: `next.config.ts`에서 `trailingSlash: true` 설정 확인

#### 4. 라우팅 문제
**증상**: 새로고침 시 404 오류
**해결책**: `public/_redirects` 파일이 있는지 확인
```
/*    /index.html   200
```

---

## 📊 모니터링 및 분석

### 1. Cloudflare Analytics
- **Real User Monitoring (RUM)**: 실제 사용자 성능 데이터
- **Page Views**: 페이지 조회수 및 트래픽 패턴
- **Geographic Distribution**: 지역별 사용자 분포

### 2. 외부 모니터링 도구

**Google Analytics 4 추가 (선택사항):**
```typescript
// src/app/layout.tsx에 추가
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

---

## 🎯 성능 최적화 팁

### 1. Cloudflare 기능 활용
- **Auto Minify**: HTML, CSS, JS 자동 압축
- **Brotli Compression**: 더 나은 압축률
- **Image Optimization**: 이미지 자동 최적화

### 2. 캐싱 전략
```
# 정적 자산 (1년)
/_next/static/* → Cache Everything, 1 year

# HTML 파일 (1시간)  
/*.html → Cache Everything, 1 hour

# API 응답 (무캐시)
/api/* → Bypass Cache
```

---

## ✅ 배포 완료 체크리스트

- [ ] Cloudflare Pages 프로젝트 생성 완료
- [ ] GitHub 저장소 연결 완료
- [ ] 빌드 설정 올바르게 구성
- [ ] 첫 번째 배포 성공
- [ ] 기본 기능 테스트 완료
- [ ] 보안 헤더 설정 완료
- [ ] 성능 최적화 설정 완료
- [ ] 모니터링 도구 설정 (선택사항)
- [ ] 커스텀 도메인 설정 (선택사항)

---

## 🎉 배포 완료!

축하합니다! 온라인 코드 에디터가 성공적으로 배포되었습니다.

**접속 URL**: `https://online-code-editor.pages.dev`

### 다음 단계
1. **다른 프로젝트 배포**: QR Generator, Emoji Search 등
2. **기능 개선**: 사용자 피드백 반영
3. **성능 모니터링**: 지속적인 최적화

---

## 📞 지원

문제가 발생하면:
1. **Cloudflare 문서**: [https://developers.cloudflare.com/pages/](https://developers.cloudflare.com/pages/)
2. **GitHub Issues**: 프로젝트 저장소에서 이슈 생성
3. **Cloudflare Community**: [https://community.cloudflare.com/](https://community.cloudflare.com/)

**Happy Coding! 🚀**