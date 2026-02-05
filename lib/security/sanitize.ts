/**
 * Input sanitization utilities
 * Helps prevent XSS, injection attacks, and other security issues
 */

/**
 * Remove HTML tags from a string
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(input: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return input.replace(/[&<>"'/]/g, (char) => htmlEscapes[char])
}

/**
 * Sanitize a string for safe use (removes script tags and dangerous attributes)
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''

  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs (except safe images)
    .replace(/data:(?!image\/(?:png|jpeg|gif|webp|svg\+xml))/gi, '')
    // Trim whitespace
    .trim()
}

/**
 * Sanitize an object's string values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      ;(result as Record<string, unknown>)[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      ;(result as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item as Record<string, unknown>)
            : item
      )
    } else if (typeof value === 'object' && value !== null) {
      ;(result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      )
    } else {
      ;(result as Record<string, unknown>)[key] = value
    }
  }

  return result
}

/**
 * Validate and sanitize a hex color code
 */
export function sanitizeHexColor(input: string): string | null {
  const hex = input.replace(/[^0-9a-fA-F#]/g, '')
  const match = hex.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
  if (!match) return null
  return `#${match[1].toLowerCase()}`
}

/**
 * Validate and sanitize a URL
 */
export function sanitizeUrl(input: string): string | null {
  try {
    const url = new URL(input)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }
    return url.href
  } catch {
    return null
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncate string to max length
 */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return input.slice(0, maxLength)
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(input: string): string {
  return input
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .trim()
}
