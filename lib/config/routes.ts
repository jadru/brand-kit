/**
 * 중앙화된 라우트 설정
 * 보호된 라우트, 공개 라우트, API 라우트 정의
 */

export const ROUTE_CONFIG = {
  /**
   * 인증이 필요한 보호된 라우트
   * 미인증 사용자는 /login으로 리다이렉트됨
   */
  protected: ['/dashboard', '/projects', '/brand-profiles', '/settings'] as const,

  /**
   * 공개 라우트 (인증 불필요)
   */
  public: ['/', '/login', '/signup'] as const,

  /**
   * 인증된 사용자가 접근 시 대시보드로 리다이렉트되는 라우트
   */
  authRedirect: ['/login', '/signup'] as const,

  /**
   * API 라우트 설정
   */
  api: {
    /** 인증이 필요한 API 라우트 */
    protected: ['/api/ai', '/api/assets', '/api/lemonsqueezy'] as const,
    /** 공개 API 라우트 (웹훅 등) */
    public: ['/api/webhooks', '/api/og'] as const,
  },
} as const

/**
 * 주어진 경로가 보호된 라우트인지 확인
 */
export function isProtectedPath(pathname: string): boolean {
  return ROUTE_CONFIG.protected.some(path => pathname.startsWith(path))
}

/**
 * 주어진 경로가 인증 리다이렉트 대상인지 확인
 * (로그인된 사용자가 접근 시 대시보드로 리다이렉트)
 */
export function isAuthRedirectPath(pathname: string): boolean {
  return ROUTE_CONFIG.authRedirect.some(path => pathname.startsWith(path))
}

export type ProtectedPath = (typeof ROUTE_CONFIG.protected)[number]
export type PublicPath = (typeof ROUTE_CONFIG.public)[number]
