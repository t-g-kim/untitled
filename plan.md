# 양산형 파일 변환 플랫폼 마스터 플랜

## 🎯 프로젝트 개요

**컨셉**: 하나의 엔진으로 다수의 파일 변환 서비스를 양산하여 광고 수익 기반의 확장 가능한 플랫폼 구축

**핵심 전략**: 서버리스 + 컨테이너 하이브리드 아키텍처로 유지비 최소화 및 확장성 극대화

## 📋 제품 라인업 (1차 출시 - 4주 내 10개 서비스)

### 우선순위 TOP 5
1. **PDF ↔ Word** (`/pdf-to-word`, `/word-to-pdf`) - 가장 수요 높음
2. **이미지 → PDF** (`/jpg-to-pdf`, `/png-to-pdf`) - 간단하고 빠른 변환
3. **이미지 압축** (`/image-compress`) - 일상적 니즈
4. **PDF 병합/분할** (`/merge-pdf`, `/split-pdf`) - 업무용 필수
5. **Office → PDF** (`/pptx-to-pdf`, `/xlsx-to-pdf`) - 비즈니스 니즈

### 추가 확장 서비스
- PDF → JPG (`/pdf-to-jpg`)
- PNG → JPG (`/png-to-jpg`)
- WebP 변환 (`/webp-convert`)
- 문서 OCR (`/pdf-ocr`)
- 이미지 리사이징 (`/image-resize`)

## 🏗️ 기술 아키텍처

### Frontend Stack
- **Next.js 14** (App Router, SSR/SSG)
- **Tailwind CSS** (빠른 UI 개발)
- **TypeScript** (타입 안정성)
- **i18n** (다국어 지원: 한국어, 영어, 일본어)

### Backend Architecture
```
[Client Layer]
├── Next.js SSR/SSG (SEO 최적화)
├── Edge CDN (Cloudflare/Vercel)
└── Progressive Web App (모바일 최적화)

[API Gateway Layer]
├── Rate Limiting (익명 사용자 제한)
├── File Validation (크기/형식 검증)
└── Authentication (토큰 기반)

[Processing Layer - 컨테이너]
├── LibreOffice Headless (Office ↔ PDF)
├── ImageMagick + libvips (이미지 처리)
├── Ghostscript (PDF 최적화)
├── Tesseract OCR (텍스트 추출)
└── Queue Consumer (Redis/Cloud Tasks)

[Storage Layer]
├── Object Storage (S3/GCS) - 24-48h 임시 보관
├── Signed URL (보안 업로드/다운로드)
└── Auto-deletion (개인정보 보호)

[Infrastructure]
├── Cloud Run/ECS (컨테이너 오케스트레이션)
├── Cloud Functions (이벤트 트리거)
├── Pub/Sub/SQS (비동기 작업 큐)
└── CDN (글로벌 배포)
```

### 핵심 API 엔드포인트
```typescript
POST /api/upload          // Signed URL 반환
POST /api/jobs           // 변환 작업 생성
GET  /api/jobs/:jobId    // 작업 상태 확인
GET  /api/download       // 결과 파일 다운로드
```

## 💰 수익 모델 & 광고 전략

### 광고 네트워크
- **글로벌**: Google AdSense (디스플레이/네이티브)
- **국내**: 네이버 애드포스트, 카카오 광고

### 광고 배치 전략
1. **업로드 전 랜딩** - 상단 네이티브 광고
2. **변환 진행 중** - 로딩 화면 광고 (사용자 대기 시간 활용)
3. **결과 다운로드** - 네이티브/배너 광고

### 프리미엄 모델
- **무광고 플랜**: 월 4,900원 ~ 9,900원
- **혜택**: 더 큰 파일 지원, 빠른 처리, OCR 고급 옵션
- **목표 전환율**: 0.5% (월 1,500명 중 7-8명)

### 수익 시뮬레이션
| 월간 PV | RPM 500원 | RPM 1,000원 | RPM 2,000원 | RPM 3,000원 |
|---------|-----------|-------------|-------------|-------------|
| 50,000  | 25,000원  | 50,000원    | 100,000원   | 150,000원   |
| 100,000 | 50,000원  | 100,000원   | 200,000원   | 300,000원   |
| 300,000 | 150,000원 | 300,000원   | 600,000원   | 900,000원   |
| 500,000 | 250,000원 | 500,000원   | 1,000,000원 | 1,500,000원 |

## 🚀 SEO & 양산 전략

### URL 구조
- 메인 브랜드: `convertok.kr` 또는 `fastconvert.kr`
- 서브패스: `/pdf-to-word`, `/jpg-to-pdf` 등
- 마이크로 도메인: `pdf-to-word.kr`, `jpg2pdf.kr` (후기 확장)

### SEO 최적화
```html
Title: PDF를 Word로 변환 - 무료 온라인 변환기 | Converto
Description: PDF를 몇 초 만에 DOCX로 변환하세요. 회원가입 없이 무료, 안전 삭제.
Keywords: PDF 변환, Word 변환, 무료 변환기, 온라인 변환
```

### 콘텐츠 전략
- **FAQ 섹션**: "스캔 PDF 변환 방법", "파일 깨짐 해결법"
- **튜토리얼**: 각 변환 기능별 가이드
- **비교 콘텐츠**: "PDF 변환기 비교", "최고의 무료 변환 도구"
- **다국어**: hreflang 태그로 국제 SEO

## 📊 핵심 지표 (KPI)

### 트래픽 지표
- **Pageviews**: 월간 페이지뷰
- **Unique Users**: 순 방문자 수
- **Conversion Rate**: 업로드 → 다운로드 완료율
- **Processing Time**: 평균 변환 처리 시간

### 광고 지표
- **RPM**: 1,000 PV당 수익
- **Fill Rate**: 광고 노출률
- **CTR**: 클릭률
- **Viewability**: 광고 가시성

### 사용자 경험
- **Core Web Vitals**: LCP, FID, CLS
- **Error Rate**: 변환 실패율
- **Retry Rate**: 재시도율

## 🛡️ 보안 & 개인정보 보호

### 데이터 보호
- **암호화**: 전송(TLS) 및 저장(KMS) 암호화
- **자동 삭제**: 24-48시간 후 자동 삭제
- **즉시 삭제**: 사용자 요청 시 즉시 삭제 버튼
- **익명 사용**: 회원가입 없이 사용 가능

### 파일 검증
- **크기 제한**: 무료 50MB, 프리미엄 200MB
- **형식 검증**: MIME 타입 검증
- **보안 스캔**: 악성 파일 검사 (선택적)

## 📅 개발 로드맵

### Week 1-2: MVP 개발
- [x] 도메인 확보 및 브랜딩
- [ ] Next.js 기본 구조 및 공통 레이아웃
- [ ] 핵심 3개 기능 (PDF↔Word, JPG→PDF, 이미지 압축)
- [ ] 업로드→큐→다운로드 파이프라인
- [ ] 기본 로깅 및 에러 처리

### Week 3-4: 기능 확장 및 최적화
- [ ] 7개 추가 기능 구현
- [ ] 다국어 지원 (ko/en)
- [ ] 광고 삽입 및 A/B 테스트
- [ ] SEO 콘텐츠 20개 자동 발행
- [ ] 성능 최적화 (LCP/TTFB)

### Month 2: 확장 및 최적화
- [ ] 모바일 PWA 개발
- [ ] 드라이브 연동 (Google Drive/OneDrive)
- [ ] 프리미엄 기능 추가
- [ ] 고급 OCR 및 eSign 기능

### Month 3-6: 스케일링
- [ ] 마이크로 도메인 확장
- [ ] 팀 계정 기능
- [ ] API 서비스 제공
- [ ] 파트너십 및 제휴

## 🎯 성공 목표

### 3개월 목표
- **월간 PV**: 300,000+
- **월 수익**: 300,000원+ (RPM 1,000원 기준)
- **프리미엄 전환**: 월 10명+
- **서비스 수**: 20개+

### 6개월 목표
- **월간 PV**: 1,000,000+
- **월 수익**: 1,000,000원+ (광고 + 프리미엄)
- **브랜드 인지도**: "파일 변환" 키워드 상위 노출
- **국제 확장**: 영어/일본어 시장 진출

## 🚨 리스크 관리

### 기술적 리스크
- **변환 품질**: 다단계 품질 모드 제공
- **비용 폭증**: 파일 크기 제한 및 프리미엄 유도
- **서버 부하**: 오토스케일링 및 큐 시스템

### 비즈니스 리스크
- **광고 정책**: AdSense 정책 준수
- **경쟁사**: 차별화된 UX 및 속도
- **저작권**: 이용약관 명시 및 책임 제한

## 🔄 다음 단계

1. **브랜드 결정**: `convertok.kr` vs `fastconvert.kr`
2. **기술 스택 확정**: Next.js + Cloud Run 조합
3. **MVP 개발 시작**: 핵심 3개 기능부터
4. **도메인 등록 및 인프라 설정**
5. **Kiro Spec 시스템으로 상세 구현 계획 수립**

---

**다음 액션**: 이 플랜을 바탕으로 Kiro의 spec 시스템을 활용해 구체적인 요구사항, 설계, 구현 계획을 단계별로 수립하겠습니다.