# ADR-002: 테스트 프레임워크 선택 (Vitest)

## 상태
승인됨 (2026-02-05)

## 컨텍스트

프로젝트에 테스트 프레임워크가 없어 코드 품질 보장이 어려웠습니다. 다음 옵션을 검토했습니다:

| 프레임워크 | 장점 | 단점 |
|-----------|------|------|
| **Jest** | 성숙함, 큰 생태계 | ESM 지원 불안정, 느림 |
| **Vitest** | 빠름, ESM 네이티브, Vite 호환 | 상대적으로 새로움 |

## 결정

**Vitest**를 선택했습니다.

### 선택 이유

1. **ESM 네이티브 지원**: Next.js 15, React 19의 ESM 모듈과 완벽 호환
2. **빠른 실행 속도**: Vite의 HMR 기반으로 테스트 실행 속도 향상
3. **Jest 호환 API**: 기존 Jest 지식 활용 가능
4. **TypeScript 설정 공유**: `vite-tsconfig-paths`로 경로 별칭 자동 인식

### 구성

```typescript
// vitest.config.mts
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    pool: 'threads',
  },
})
```

### 테스트 스크립트

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## 결과

### 긍정적 영향
- 빠른 테스트 피드백 루프 (119ms for 19 tests)
- ESM 관련 문제 없음 (threads pool 사용)
- TypeScript 경로 별칭 자동 지원

### 부정적 영향
- jsdom 환경에서 일부 ESM 호환성 이슈 (node 환경 기본 사용으로 해결)
- 생태계가 Jest보다 작음

## 관련 파일
- `vitest.config.mts` - Vitest 설정
- `tests/setup.ts` - 테스트 전역 설정
- `package.json` - 테스트 스크립트

## 참고
- [Vitest 공식 문서](https://vitest.dev/)
- [Vitest vs Jest 비교](https://vitest.dev/guide/comparisons.html)
