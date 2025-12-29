# Cloudflare Pages 빌드 수정 가이드

## 현재 문제
- Cloudflare가 이전 커밋을 사용하고 있음
- package-lock.json이 반영되지 않음

## 해결 방법

### 1. Build command 변경
```bash
npm install && npm run build
```

### 2. 설정 확인
- Root directory: projects/online-editor
- Build output directory: out
- NODE_VERSION = 18

이 파일은 새 커밋을 트리거하기 위한 것입니다.