# 코드 리뷰 가이드

## 개요

이 문서는 BrandKit 프로젝트의 코드 리뷰 기준을 정의합니다.

## ESLint 규칙

### 필수 (Error)

| 규칙 | 설명 |
|------|------|
| `@typescript-eslint/no-explicit-any` | `any` 타입 사용 금지 |
| `@typescript-eslint/no-unused-vars` | 미사용 변수 금지 (`_` prefix 제외) |
| `@typescript-eslint/consistent-type-imports` | `type` import 일관성 |
| `prefer-const` | 재할당 없으면 `const` 사용 |
| `no-var` | `var` 사용 금지 |
| `react/jsx-no-target-blank` | `target="_blank"`에 `rel="noopener"` 필수 |

### 경고 (Warn)

| 규칙 | 설명 |
|------|------|
| `no-console` | `console.log` 사용 자제 (warn/error만 허용) |
| `react-hooks/exhaustive-deps` | Hook 의존성 배열 검사 |

## Prettier 설정

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## 코드 리뷰 체크리스트

### 필수 확인 사항

- [ ] TypeScript 타입 안전성
  - `any` 타입 사용 없음
  - 적절한 타입 정의
  - 타입 캐스팅 최소화

- [ ] 에러 처리
  - 커스텀 에러 클래스 사용
  - `handleApiError` 일관 적용
  - 사용자 친화적 에러 메시지

- [ ] 보안
  - 인증 검증 누락 없음
  - 환경변수 노출 없음
  - 입력 검증 존재

- [ ] 성능
  - 불필요한 리렌더링 없음
  - 적절한 메모이제이션
  - 큰 번들 import 없음

### 코드 스타일

- [ ] 일관된 네이밍 (camelCase, PascalCase)
- [ ] 적절한 파일 분리
- [ ] 의미 있는 변수/함수 이름
- [ ] 주석은 "왜"를 설명 (코드가 "무엇"을 하는지는 명확해야 함)

## PR 템플릿

```markdown
## 변경 사항
-

## 테스트
- [ ] 새 테스트 추가
- [ ] 기존 테스트 통과

## 체크리스트
- [ ] `yarn lint` 통과
- [ ] `yarn tsc --noEmit` 통과
- [ ] `yarn test` 통과
```

## 참고

- [ESLint Configuration](../../eslint.config.mjs)
- [Prettier Configuration](../../.prettierrc)
