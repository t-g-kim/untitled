# 공통 라이브러리 및 유틸리티

양산형 프로젝트들에서 공통으로 사용할 수 있는 라이브러리와 유틸리티들을 관리합니다.

## 구조

```
shared/
├── ui/                      # 공통 UI 컴포넌트
│   ├── components/
│   │   ├── FileUpload/
│   │   ├── ProgressBar/
│   │   ├── AdUnit/
│   │   └── Layout/
│   └── styles/
├── utils/                   # 공통 유틸리티
│   ├── file-validation.ts
│   ├── analytics.ts
│   ├── encryption.ts
│   └── api-client.ts
├── hooks/                   # 공통 React Hooks
│   ├── useFileUpload.ts
│   ├── useAnalytics.ts
│   └── useAds.ts
├── types/                   # 공통 타입 정의
│   ├── api.ts
│   ├── analytics.ts
│   └── file.ts
├── config/                  # 공통 설정
│   ├── cloudflare.ts
│   ├── supabase.ts
│   └── ads.ts
└── templates/              # 프로젝트 템플릿
    ├── next-cloudflare/
    ├── worker-api/
    └── supabase-functions/
```

## 주요 공통 컴포넌트

### FileUpload
- 드래그 앤 드롭 파일 업로드
- 파일 타입 및 크기 검증
- 진행률 표시
- 다국어 지원

### AdUnit
- Google AdSense 통합
- 반응형 광고 레이아웃
- A/B 테스트 지원
- 수익 추적

### ProgressBar
- 실시간 진행률 표시
- 애니메이션 효과
- 커스터마이징 가능

### Layout
- 공통 헤더/푸터
- SEO 메타 태그
- 다국어 네비게이션
- 광고 배치 영역

## 공통 유틸리티

### file-validation.ts
```typescript
export interface ValidationResult {
  valid: boolean;
  error?: string;
  fileInfo?: FileInfo;
}

export async function validateFile(
  file: File, 
  allowedTypes: string[], 
  maxSize: number
): Promise<ValidationResult>
```

### analytics.ts
```typescript
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
}

export function trackEvent(event: AnalyticsEvent): void
export function trackConversion(type: string, value?: number): void
export function trackAdRevenue(placement: string, revenue: number): void
```

### encryption.ts
```typescript
export async function encryptFile(file: ArrayBuffer): Promise<ArrayBuffer>
export async function decryptFile(encryptedFile: ArrayBuffer): Promise<ArrayBuffer>
export function generateSecureKey(): Promise<CryptoKey>
```

## 사용법

각 프로젝트에서 공통 라이브러리를 사용하려면:

```bash
# 공통 라이브러리 설치
npm install @shared/ui @shared/utils @shared/hooks

# 또는 심볼릭 링크 사용
ln -s ../../shared/ui ./node_modules/@shared/ui
```

```typescript
// 프로젝트에서 사용
import { FileUpload, AdUnit } from '@shared/ui';
import { validateFile, trackEvent } from '@shared/utils';
import { useFileUpload } from '@shared/hooks';
```