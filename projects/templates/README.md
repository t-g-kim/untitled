# 프로젝트 템플릿

새로운 양산형 프로젝트를 빠르게 시작할 수 있는 템플릿들을 제공합니다.

## 사용 가능한 템플릿

### 1. next-cloudflare-template
**용도**: Cloudflare Pages + Workers 기반 Next.js 프로젝트
**포함 기능**:
- Next.js 14 (App Router)
- TypeScript 설정
- Tailwind CSS
- Cloudflare Workers API
- 광고 통합 준비
- SEO 최적화

### 2. file-converter-template  
**용도**: 파일 변환 서비스 전용 템플릿
**포함 기능**:
- 파일 업로드/다운로드 UI
- Supabase 통합
- 변환 진행률 표시
- 광고 배치 영역
- 분석 추적

### 3. image-tool-template
**용도**: 이미지 처리 도구 전용 템플릿  
**포함 기능**:
- 이미지 미리보기
- 실시간 편집 UI
- Canvas API 통합
- 결과 비교 뷰
- 소셜 공유 기능

### 4. api-service-template
**용도**: API 서비스 전용 템플릿
**포함 기능**:
- Cloudflare Workers
- Rate limiting
- API 키 관리
- 사용량 추적
- 문서 자동 생성

### 5. chrome-extension-template
**용도**: 크롬 확장 프로그램 템플릿
**포함 기능**:
- Manifest V3
- Content Script
- Background Service Worker
- Options Page
- 권한 관리

## 템플릿 사용법

### 1. 템플릿 복사
```bash
# 새 프로젝트 생성
cp -r templates/next-cloudflare-template projects/my-new-project
cd projects/my-new-project
```

### 2. 프로젝트 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 프로젝트 이름 변경
# package.json, README.md 등에서 프로젝트 이름 수정
```

### 3. Kiro Spec 생성
```bash
# Kiro를 사용해 요구사항 정의
# .kiro/specs/ 폴더에 requirements.md, design.md, tasks.md 생성
```

### 4. 개발 시작
```bash
# 개발 서버 실행
npm run dev

# 빌드 및 배포
npm run build
npm run deploy
```

## 템플릿 커스터마이징 가이드

### 브랜딩 변경
1. `src/config/branding.ts` - 브랜드 정보 수정
2. `public/` - 로고, 파비콘 교체
3. `src/styles/globals.css` - 브랜드 컬러 변경

### 기능 추가/제거
1. `src/components/` - 컴포넌트 수정
2. `src/pages/` 또는 `src/app/` - 페이지 구조 변경
3. `workers/` - API 엔드포인트 수정

### 배포 설정
1. `wrangler.toml` - Cloudflare Workers 설정
2. `next.config.js` - Next.js 빌드 설정
3. `package.json` - 배포 스크립트 수정

## 공통 설정 파일

### package.json 기본 구조
```json
{
  "name": "project-template",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "deploy": "wrangler deploy",
    "test": "jest",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.0.0",
    "typescript": "5.0.0",
    "@supabase/supabase-js": "^2.0.0"
  }
}
```

### 환경 변수 템플릿
```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxx
CLOUDFLARE_API_TOKEN=your_cloudflare_token
ANALYTICS_API_KEY=your_analytics_key
```

## 새 템플릿 추가

새로운 유형의 프로젝트 템플릿을 추가하려면:

1. `templates/` 폴더에 새 템플릿 디렉토리 생성
2. 기본 프로젝트 구조 및 파일들 추가
3. `README.md`에 템플릿 설명 추가
4. 공통 라이브러리 통합
5. 배포 설정 포함