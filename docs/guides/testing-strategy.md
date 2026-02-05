# 테스트 전략 가이드

## 개요

BrandKit 프로젝트는 Vitest를 사용하여 테스트를 작성합니다. 이 문서는 테스트 전략과 우선순위를 설명합니다.

## 테스트 도구

- **Vitest** - 테스트 러너 (Vite 기반, ESM 네이티브 지원)
- **@testing-library/react** - React 컴포넌트 테스트 (향후)
- **@testing-library/jest-dom** - DOM assertion 확장

## 테스트 실행

```bash
# 모든 테스트 실행
yarn test

# 워치 모드
yarn test:watch

# 커버리지 포함
yarn test:coverage
```

## 테스트 우선순위

### P0: Critical (필수)
보안 및 인증 관련 - 반드시 테스트 필요

| 대상 | 파일 |
|------|------|
| 라우트 설정 | `tests/lib/config/routes.test.ts` |
| 에러 핸들링 | `tests/lib/utils/errors.test.ts` |
| 미들웨어 | `tests/lib/supabase/middleware.test.ts` |

### P1: High (권장)
핵심 비즈니스 로직

| 대상 | 파일 |
|------|------|
| 사용량 제한 | `tests/lib/utils/rate-limit.test.ts` |
| AI 헤드라인 API | `tests/app/api/ai/headlines.test.ts` |
| AI 아이콘 API | `tests/app/api/ai/icons.test.ts` |
| 에셋 생성 API | `tests/app/api/assets/generate.test.ts` |

### P2: Medium (선택)
UI 컴포넌트 및 상태 관리

| 대상 | 파일 |
|------|------|
| Wizard Store | `tests/store/wizard-store.test.ts` |
| UI 컴포넌트 | `tests/components/ui/*.test.tsx` |

### P3: Low (향후)
E2E 테스트

| 대상 | 도구 |
|------|------|
| 사용자 흐름 | Playwright |
| 결제 흐름 | Playwright |

## 테스트 작성 패턴

### 순수 유닛 테스트

```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/utils/my-function'

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('expected')
  })
})
```

### 모킹

```typescript
import { vi } from 'vitest'

// 모듈 모킹
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// 함수 스파이
const spy = vi.spyOn(module, 'function')
```

### API 테스트

```typescript
import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/my-route/route'

describe('POST /api/my-route', () => {
  it('should return 401 for unauthenticated requests', async () => {
    const request = new Request('http://localhost/api/my-route', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })
})
```

## 폴더 구조

```
tests/
├── setup.ts                    # 전역 설정
├── lib/
│   ├── config/
│   │   └── routes.test.ts      # ✅ 구현됨
│   ├── utils/
│   │   └── errors.test.ts      # ✅ 구현됨
│   └── supabase/
│       └── middleware.test.ts  # TODO
├── store/
│   └── wizard-store.test.ts    # TODO
├── components/
│   └── ui/                     # TODO
└── app/
    └── api/                    # TODO
```

## 커버리지 목표

| 카테고리 | 목표 |
|---------|------|
| 전체 | > 50% |
| lib/utils | > 80% |
| lib/config | > 90% |
| API routes | > 60% |

## 참고

- [Vitest 공식 문서](https://vitest.dev/)
- [Testing Library 문서](https://testing-library.com/)
