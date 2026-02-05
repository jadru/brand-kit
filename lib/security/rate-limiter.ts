/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based solution (e.g., @upstash/ratelimit)
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
  lastCleanup = now
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup()

  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No existing entry or window expired
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    }
  }

  // Within window - check count
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const RATE_LIMITS = {
  // AI generation endpoints - expensive operations
  aiGeneration: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  },
  // Authentication endpoints
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  },
  // General API endpoints
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
  // Webhook endpoints (more lenient)
  webhook: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 50 requests per minute
  },
} as const

/**
 * Get client identifier from request headers
 */
export function getClientIdentifier(request: Request): string {
  // Try various headers for client IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  return 'anonymous'
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitExceededResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)

  return new Response(
    JSON.stringify({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      },
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': String(resetAt),
      },
    }
  )
}
