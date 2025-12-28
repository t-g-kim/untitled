# 양산형 프로젝트 관리

이 폴더는 다양한 양산형 프로젝트들을 체계적으로 관리하기 위한 공간입니다.

## 프로젝트 구조

```
projects/
├── file-conversion-platform/     # 파일 변환 플랫폼 (메인 프로젝트)
├── image-tools/                  # 이미지 처리 도구들
├── pdf-utilities/               # PDF 관련 유틸리티들
├── document-converters/         # 문서 변환 도구들
├── web-scrapers/               # 웹 스크래핑 도구들
├── api-services/               # API 서비스들
├── chrome-extensions/          # 크롬 확장 프로그램들
├── mobile-apps/               # 모바일 앱들
├── shared/                    # 공통 라이브러리 및 유틸리티
└── templates/                 # 프로젝트 템플릿들
```

## 각 프로젝트 폴더 구조

각 프로젝트는 다음과 같은 표준 구조를 따릅니다:

```
project-name/
├── .kiro/
│   └── specs/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── src/                      # 소스 코드
├── docs/                     # 문서
├── tests/                    # 테스트
├── deployment/               # 배포 설정
├── README.md                 # 프로젝트 개요
├── package.json             # 의존성 관리
└── .env.example             # 환경 변수 예시
```

## 공통 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**

### Backend & Deployment
- **Cloudflare Pages** (호스팅)
- **Cloudflare Workers** (API)
- **Supabase** (데이터베이스 & 스토리지)
- **Vercel** (대안 호스팅)

### 공통 라이브러리
- **@shared/ui** - 공통 UI 컴포넌트
- **@shared/utils** - 유틸리티 함수들
- **@shared/analytics** - 분석 도구
- **@shared/ads** - 광고 통합

## 프로젝트 생성 가이드

1. 새 프로젝트 폴더 생성
2. Kiro spec 시스템으로 요구사항 정의
3. 공통 템플릿 복사 및 커스터마이징
4. 개발 및 배포

## 수익 모델 공통 전략

- **광고 수익**: Google AdSense, 네이버 애드포스트
- **프리미엄 구독**: 무광고, 고급 기능
- **API 서비스**: 개발자 대상 유료 API
- **제휴 마케팅**: 관련 도구 및 서비스 추천