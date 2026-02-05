# 배포 가이드

## 개요

BrandKit은 Vercel에 배포됩니다. 이 문서는 배포 프로세스와 환경 설정을 설명합니다.

## CI/CD 파이프라인

### GitHub Actions 워크플로우

`.github/workflows/ci.yml` 파일에서 다음 작업을 자동화합니다:

```
push/PR to main, develop
    │
    ├── Lint (yarn lint)
    │
    ├── Type Check (yarn tsc --noEmit)
    │
    ├── Test (yarn test)
    │
    └── Build (yarn build)
```

### 실행 조건
- `main` 또는 `develop` 브랜치로의 push
- `main` 또는 `develop` 브랜치로의 PR

## Vercel 배포

### 자동 배포
- `main` 브랜치 push → Production 배포
- PR → Preview 배포

### 환경변수 설정

Vercel Dashboard에서 다음 환경변수를 설정해야 합니다:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
FAL_KEY=...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_PRO_VARIANT_ID=...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### vercel.json 설정

```json
{
  "buildCommand": "yarn build",
  "devCommand": "yarn dev",
  "installCommand": "yarn install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

## 로컬 빌드 테스트

```bash
# 프로덕션 빌드 테스트
yarn build

# 프로덕션 서버 실행
yarn start
```

## 배포 체크리스트

### 배포 전
- [ ] 모든 테스트 통과 (`yarn test`)
- [ ] TypeScript 에러 없음 (`yarn tsc --noEmit`)
- [ ] ESLint 통과 (`yarn lint`)
- [ ] 로컬 빌드 성공 (`yarn build`)

### 배포 후
- [ ] 프로덕션 URL 접속 확인
- [ ] 로그인/회원가입 동작 확인
- [ ] 에셋 생성 동작 확인
- [ ] 결제 흐름 확인 (테스트 모드)

## 롤백

Vercel Dashboard에서:
1. Deployments 탭 이동
2. 이전 배포 선택
3. "Promote to Production" 클릭

## 참고

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
