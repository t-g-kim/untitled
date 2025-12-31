# 🚀 모든 프로젝트 - Cloudflare Pages 배포 가이드

이 가이드는 모든 프로젝트를 Cloudflare Pages에 배포하는 전체 과정을 단계별로 안내합니다.

## 📋 프로젝트 목록

| 프로젝트 | 설명 | 도메인 예시 | Node.js 버전 |
|---------|------|------------|-------------|
| **emoji-search** | 이모지 검색 도구 | emoji-search.pages.dev | 20 |
| **file-conversion-platform** | PDF/Word 변환 플랫폼 | file-conversion.pages.dev | 18 |
| **online-editor** | 다중 언어 코드 에디터 | code-playground.pages.dev | 20 |
| **qr-generator** | QR 코드 생성기 | qr-generator.pages.dev | 18 |

---

## ✅ 사전 준비 확인

### 1. 모든 프로젝트 빌드 테스트 완료 ✅
```bash
# 각 프로젝트에서 빌드 테스트 완료
cd projects/emoji-search && npm run build
cd projects/file-conversion-platform && npm run build  
cd projects/online-editor && npm run build
cd projects/qr-generator && npm run build
```

### 2. SEO 설정 완료 ✅
- ✅ robots.ts, sitemap.ts 파일 생성
- ✅ Open Graph, Twitter Cards 설정
- ✅ manifest.json (PWA 지원)
- ✅ 정적 자산 (favicon, icons) 생성
- ✅ _headers, _redirects 파일 생성

### 3. 필요한 정보
- GitHub 저장소 URL
- Cloudflare 계정 (무료 계정 가능)

---

## 🌐 Step 1: Cloudflare Pages 접속

1. **Cloudflare Dashboard 접속**
   - [https://dash.cloudflare.com/](https://dash.cloudflare.com/) 방문

2. **Pages 섹션으로 이동** ⚠️ **Workers가 아닙니다!**
   - 왼쪽 사이드바에서 **"Pages"** 클릭
   - 또는 직접 [https://dash.cloudflare.com/pages](https://dash.cloudflare.com/pages) 접속

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
   - 모노레포 저장소 선택
   - **"Begin setup"** 클릭

---

## ⚙️ Step 3: 각 프로젝트별 배포 설정

### 🎯 Emoji Search 프로젝트

```
Project name: emoji-search
Production branch: master
Framework preset: Next.js (Static HTML Export)
Root directory: projects/emoji-search
Build command: npm install && npm run build
Build output directory: out
Node.js version: 20
```

**환경 변수:**
```
NODE_VERSION = 20
NPM_FLAGS = --production=false
NEXT_PUBLIC_SITE_URL = https://emoji-search.pages.dev
```

---

### 📄 File Conversion Platform 프로젝트

```
Project name: file-conversion-platform
Production branch: master
Framework preset: Next.js (Static HTML Export)
Root directory: projects/file-conversion-platform
Build command: npm install && npm run build
Build output directory: out
Node.js version: 18
```

**환경 변수:**
```
NODE_VERSION = 18
NPM_FLAGS = --production=false
NEXT_PUBLIC_SITE_URL = https://file-conversion.pages.dev
```

---

### 💻 Online Editor 프로젝트

```
Project name: code-playground
Production branch: master
Framework preset: Next.js (Static HTML Export)
Root directory: projects/online-editor
Build command: npm install && npm run build
Build output directory: out
Node.js version: 20
```

**환경 변수:**
```
NODE_VERSION = 20
NPM_FLAGS = --production=false
NEXT_PUBLIC_SITE_URL = https://code-playground.pages.dev
```

---

### 📱 QR Generator 프로젝트

```
Project name: qr-generator
Production branch: master
Framework preset: Next.js (Static HTML Export)
Root directory: projects/qr-generator
Build command: npm install && npm run build
Build output directory: out
Node.js version: 18
```

**환경 변수:**
```
NODE_VERSION = 18
NPM_FLAGS = --production=false
NEXT_PUBLIC_SITE_URL = https://qr-generator.pages.dev
```

---

## 🚀 Step 4: 배포 실행

1. **설정 확인**
   - 모든 설정이 올바른지 다시 한 번 확인
   - 특히 **Root directory**가 정확한지 확인

2. **배포 시작**
   - **"Save and Deploy"** 클릭
   - 첫 번째 배포가 시작됨 (약 2-5분 소요)

3. **배포 진행 상황 확인**
   - 실시간으로 빌드 로그 확인 가능
   - 오류 발생 시 로그에서 원인 파악

---

## 🔧 Step 5: 배포 후 설정

### 1. 커스텀 도메인 설정 (선택사항)
- **"Custom domains"** 탭에서 도메인 추가
- DNS 설정 업데이트

### 2. 환경 변수 추가
각 프로젝트의 `.env.example` 파일을 참고하여 필요한 환경 변수 추가:

**공통 환경 변수:**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
NEXT_PUBLIC_NAVER_VERIFICATION=your-verification-code
```

### 3. 빌드 훅 설정 (선택사항)
- **"Settings"** > **"Builds & deployments"**
- GitHub 푸시 시 자동 배포 설정

---

## 📊 배포 상태 확인

### 성공적인 배포 확인사항:
- ✅ 빌드 로그에 에러 없음
- ✅ 사이트 접속 가능
- ✅ robots.txt 접속 가능 (`/robots.txt`)
- ✅ sitemap.xml 접속 가능 (`/sitemap.xml`)
- ✅ manifest.json 접속 가능 (`/manifest.json`)
- ✅ 모든 정적 자산 로드 확인

### 각 프로젝트별 테스트 URL:
```
https://emoji-search.pages.dev
https://file-conversion.pages.dev  
https://code-playground.pages.dev
https://qr-generator.pages.dev
```

---

## 🐛 문제 해결

### 빌드 실패 시:
1. **Node.js 버전 확인**
   - emoji-search, online-editor: Node.js 20
   - file-conversion-platform, qr-generator: Node.js 18

2. **Root directory 확인**
   - 정확한 프로젝트 경로 설정 확인

3. **빌드 명령어 확인**
   - `npm install && npm run build` 사용

### 404 에러 시:
1. **_redirects 파일 확인**
   - SPA 라우팅 설정 확인

2. **Build output directory 확인**
   - `out` 폴더 설정 확인

### SEO 문제 시:
1. **robots.txt, sitemap.xml 확인**
   - 각각 `/robots.txt`, `/sitemap.xml`로 접속 테스트

2. **Open Graph 메타데이터 확인**
   - 소셜 미디어 공유 테스트

---

## 🎉 배포 완료!

모든 프로젝트가 성공적으로 배포되면:

1. **SEO 최적화 완료** ✅
   - robots.txt, sitemap.xml 자동 생성
   - Open Graph, Twitter Cards 설정
   - 구조화된 데이터 (일부 프로젝트)

2. **PWA 지원** ✅
   - manifest.json 설정
   - 서비스 워커 (일부 프로젝트)

3. **성능 최적화** ✅
   - 정적 자산 캐싱
   - 이미지 최적화
   - 코드 압축

4. **보안 헤더** ✅
   - CSP, HSTS 등 보안 설정
   - XSS 보호

각 프로젝트는 독립적으로 운영되며, 개별적으로 업데이트 및 관리가 가능합니다.