# ADR-001: 미들웨어 보안 수정

## 상태
승인됨 (2026-02-05)

## 컨텍스트

기존 `lib/supabase/middleware.ts`의 `catch` 블록에서 인증 오류 발생 시 `NextResponse.next()`를 반환하고 있었습니다:

```typescript
catch (error) {
  console.error('Middleware auth error:', error)
  return NextResponse.next({ request })  // 보안 취약점
}
```

이로 인해 다음과 같은 보안 취약점이 존재했습니다:

1. **인증 우회 가능**: Supabase 인증 서버 오류 시 보호된 라우트(`/dashboard`, `/projects` 등)에 미인증 사용자가 접근 가능
2. **환경변수 누락 시 우회**: Supabase 환경변수가 설정되지 않은 경우에도 동일한 문제 발생
3. **세션 오류 악용 가능**: 의도적인 세션 조작으로 인증 검증을 우회할 수 있는 가능성

## 결정

### 1. 라우트 설정 중앙화
`lib/config/routes.ts` 파일을 생성하여 보호된 라우트 목록을 중앙에서 관리:

```typescript
export const ROUTE_CONFIG = {
  protected: ['/dashboard', '/projects', '/brand-profiles', '/settings'],
  public: ['/', '/login', '/signup'],
  authRedirect: ['/login', '/signup'],
} as const
```

### 2. 예외 처리 개선
`catch` 블록에서 보호된 라우트 접근 시 로그인 페이지로 리다이렉트:

```typescript
catch (error) {
  console.error('Middleware auth error:', error)

  if (isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'session')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

### 3. 환경변수 누락 시 처리
환경변수가 없는 경우에도 보호된 라우트는 로그인으로 리다이렉트:

```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  if (isProtectedPath(request.nextUrl.pathname)) {
    // 로그인으로 리다이렉트
  }
}
```

## 결과

### 긍정적 영향
- 인증 오류 발생 시에도 보호된 라우트가 안전하게 보호됨
- 라우트 설정이 중앙화되어 유지보수성 향상
- 타입 안전한 라우트 검증 함수 제공

### 부정적 영향
- 인증 서버 일시적 오류 시 사용자가 로그아웃됨 (의도된 동작)
- 추가 파일(`lib/config/routes.ts`) 생성

## 관련 파일
- `lib/supabase/middleware.ts` - 수정됨
- `lib/config/routes.ts` - 신규 생성

## 참고
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
