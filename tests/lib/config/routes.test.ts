import { describe, it, expect } from 'vitest'
import { ROUTE_CONFIG, isProtectedPath, isAuthRedirectPath } from '@/lib/config/routes'

describe('ROUTE_CONFIG', () => {
  it('should have protected paths', () => {
    expect(ROUTE_CONFIG.protected).toContain('/dashboard')
    expect(ROUTE_CONFIG.protected).toContain('/projects')
    expect(ROUTE_CONFIG.protected).toContain('/brand-profiles')
    expect(ROUTE_CONFIG.protected).toContain('/settings')
  })

  it('should have public paths', () => {
    expect(ROUTE_CONFIG.public).toContain('/')
    expect(ROUTE_CONFIG.public).toContain('/login')
    expect(ROUTE_CONFIG.public).toContain('/signup')
  })

  it('should have auth redirect paths', () => {
    expect(ROUTE_CONFIG.authRedirect).toContain('/login')
    expect(ROUTE_CONFIG.authRedirect).toContain('/signup')
  })
})

describe('isProtectedPath', () => {
  it('should return true for protected paths', () => {
    expect(isProtectedPath('/dashboard')).toBe(true)
    expect(isProtectedPath('/dashboard/settings')).toBe(true)
    expect(isProtectedPath('/projects')).toBe(true)
    expect(isProtectedPath('/projects/123')).toBe(true)
    expect(isProtectedPath('/brand-profiles')).toBe(true)
    expect(isProtectedPath('/settings')).toBe(true)
    expect(isProtectedPath('/settings/billing')).toBe(true)
  })

  it('should return false for public paths', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/login')).toBe(false)
    expect(isProtectedPath('/signup')).toBe(false)
    expect(isProtectedPath('/api/webhooks/lemonsqueezy')).toBe(false)
  })
})

describe('isAuthRedirectPath', () => {
  it('should return true for auth redirect paths', () => {
    expect(isAuthRedirectPath('/login')).toBe(true)
    expect(isAuthRedirectPath('/login?redirect=/dashboard')).toBe(true)
    expect(isAuthRedirectPath('/signup')).toBe(true)
  })

  it('should return false for non-auth paths', () => {
    expect(isAuthRedirectPath('/')).toBe(false)
    expect(isAuthRedirectPath('/dashboard')).toBe(false)
    expect(isAuthRedirectPath('/projects')).toBe(false)
  })
})
