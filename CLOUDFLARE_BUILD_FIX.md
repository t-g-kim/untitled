# 🔧 Cloudflare Pages 빌드 오류 해결

## 문제 상황
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

## 원인
Cloudflare Pages가 루트 디렉토리에서 `npm ci`를 실행하려고 하지만, package-lock.json이 `projects/online-editor/` 디렉토리에 있음.

## 해결 방법

### 1. Cloudflare Pages 설정 수정

**Pages 대시보드에서:**

1. **프로젝트 선택** → **Settings** 탭
2. **Build & deployments** 섹션에서 **Edit configuration**
3. 다음과 같이 수정:

```
Root directory: projects/online-editor
Build command: npm install && npm run build
Build output directory: out
```

### 2. 환경 변수 확인 (중요!)

**Environment variables**에서 다음이 설정되어 있는지 확인:

```
NODE_VERSION = 20
NPM_FLAGS = --production=false
```

⚠️ **중요**: NODE_VERSION을 20으로 설정해야 합니다. Next.js 16+는 Node.js 20.9.0 이상이 필요합니다.

### 3. 재배포

1. **Save** 클릭
2. **Deployments** 탭으로 이동
3. 최신 배포에서 **Retry deployment** 클릭

## 예상 결과

설정 변경 후 빌드 로그에서 다음과 같이 표시되어야 함:

```
Installing nodejs 20.x.x
Installing project dependencies: npm install
✓ Dependencies installed successfully
Building application: npm run build
✓ Build completed successfully
```

**주요 변경사항:**
- Node.js 버전이 20.x.x로 업그레이드됨
- `npm install`이 성공적으로 실행됨 (package-lock.json 동기화)
- Next.js 빌드가 오류 없이 완료됨

## 추가 확인사항

만약 여전히 문제가 발생한다면:

1. **Root directory**가 정확히 `projects/online-editor`인지 재확인
2. GitHub 저장소에 최신 코드가 푸시되었는지 확인
3. package.json과 package-lock.json이 동기화되어 있는지 확인

## 성공 확인

빌드가 성공하면 다음과 같은 메시지가 표시됩니다:
```
✓ Build completed successfully
✓ Deployment completed
```

그 후 배포된 사이트 URL로 접속하여 정상 작동을 확인하세요.