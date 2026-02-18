/**
 * 앱 기본 URL을 반환합니다.
 * 프로덕션에서 NEXT_PUBLIC_APP_URL이 미설정이면 에러를 던집니다.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  throw new Error('NEXT_PUBLIC_APP_URL environment variable is required in production')
}
