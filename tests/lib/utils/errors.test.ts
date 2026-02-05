import { describe, it, expect } from 'vitest'
import {
  AppError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UsageLimitError,
  PlanRequiredError,
  ValidationError,
  AIGenerationError,
  handleApiError,
} from '@/lib/utils/errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with all properties', () => {
      const error = new AppError('test message', 'TEST_CODE', 500, 'user message')

      expect(error.message).toBe('test message')
      expect(error.code).toBe('TEST_CODE')
      expect(error.statusCode).toBe(500)
      expect(error.userMessage).toBe('user message')
      expect(error.name).toBe('AppError')
    })

    it('should have default status code 500', () => {
      const error = new AppError('test', 'TEST')
      expect(error.statusCode).toBe(500)
    })
  })

  describe('UnauthorizedError', () => {
    it('should have correct defaults', () => {
      const error = new UnauthorizedError()

      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.statusCode).toBe(401)
      expect(error.userMessage).toBe('로그인이 필요합니다.')
    })
  })

  describe('ForbiddenError', () => {
    it('should have correct defaults', () => {
      const error = new ForbiddenError()

      expect(error.code).toBe('FORBIDDEN')
      expect(error.statusCode).toBe(403)
    })
  })

  describe('NotFoundError', () => {
    it('should include resource name in message', () => {
      const error = new NotFoundError('프로젝트')

      expect(error.message).toContain('프로젝트')
      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
    })
  })

  describe('UsageLimitError', () => {
    it('should include resource and limit in message', () => {
      const error = new UsageLimitError('AI 헤드라인', 10)

      expect(error.message).toContain('AI 헤드라인')
      expect(error.message).toContain('10')
      expect(error.code).toBe('USAGE_LIMIT_EXCEEDED')
      expect(error.statusCode).toBe(429)
    })
  })

  describe('PlanRequiredError', () => {
    it('should include feature name', () => {
      const error = new PlanRequiredError('AI 아이콘 생성')

      expect(error.message).toContain('AI 아이콘 생성')
      expect(error.code).toBe('PLAN_REQUIRED')
      expect(error.statusCode).toBe(403)
    })
  })

  describe('ValidationError', () => {
    it('should have correct properties', () => {
      const error = new ValidationError('입력이 잘못되었습니다.', { email: '유효하지 않음' })

      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.fields).toEqual({ email: '유효하지 않음' })
    })
  })

  describe('AIGenerationError', () => {
    it('should include service name', () => {
      const claudeError = new AIGenerationError('claude')
      const falError = new AIGenerationError('fal')

      expect(claudeError.message).toContain('claude')
      expect(falError.message).toContain('fal')
      expect(claudeError.code).toBe('AI_GENERATION_FAILED')
      expect(claudeError.statusCode).toBe(500)
    })
  })
})

describe('handleApiError', () => {
  it('should handle AppError instances', async () => {
    const error = new UnauthorizedError()
    const response = handleApiError(error)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error.code).toBe('UNAUTHORIZED')
    expect(data.error.message).toBe('로그인이 필요합니다.')
  })

  it('should handle unknown errors', async () => {
    const error = new Error('Unknown error')
    const response = handleApiError(error)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error.code).toBe('INTERNAL_ERROR')
    expect(data.error.message).toContain('서버 오류')
  })

  it('should handle non-Error objects', async () => {
    const response = handleApiError('string error')
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error.code).toBe('INTERNAL_ERROR')
  })
})
