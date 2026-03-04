import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'
import { isProtectedPath, isAuthRedirectPath } from '@/lib/config/routes'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // 먼저 i18n 미들웨어 처리
  const intlResponse = intlMiddleware(request)

  // Supabase 환경변수 체크
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // 환경변수 누락 시 i18n 응답만 반환
    return intlResponse
  }

  // 현재 경로에서 locale prefix 제거하여 실제 경로 확인
  const pathname = request.nextUrl.pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ko)/, '') || '/'

  // Supabase 클라이언트 생성
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
          intlResponse.cookies.set(name, value)
        })
      },
    },
  })

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const isProtected = isProtectedPath(pathnameWithoutLocale)
    const isAuthRedirect = isAuthRedirectPath(pathnameWithoutLocale)

    // 미인증 사용자가 보호된 라우트 접근 시 로그인으로 리다이렉트
    if (!user && isProtected) {
      const locale = pathname.match(/^\/(en|ko)/)?.[1] || routing.defaultLocale
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      return NextResponse.redirect(url)
    }

    // 인증된 사용자가 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
    if (user && isAuthRedirect) {
      const locale = pathname.match(/^\/(en|ko)/)?.[1] || routing.defaultLocale
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/dashboard`
      return NextResponse.redirect(url)
    }

    return intlResponse
  } catch (error) {
    console.error('Middleware auth error:', error)

    // 인증 오류 시 보호된 라우트는 로그인으로 리다이렉트
    if (isProtectedPath(pathnameWithoutLocale)) {
      const locale = pathname.match(/^\/(en|ko)/)?.[1] || routing.defaultLocale
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('error', 'session')
      return NextResponse.redirect(url)
    }

    return intlResponse
  }
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)',],
}
