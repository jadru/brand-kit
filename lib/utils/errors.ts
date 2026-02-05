import { logger } from './logger'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 'UNAUTHORIZED', 401, '로그인이 필요합니다.')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '권한이 없습니다.') {
    super(message, 'FORBIDDEN', 403, '이 작업을 수행할 권한이 없습니다.')
  }
}

export class NotFoundError extends AppError {
  constructor(resource = '리소스') {
    super(`${resource}를 찾을 수 없습니다.`, 'NOT_FOUND', 404)
  }
}

export class UsageLimitError extends AppError {
  constructor(resource: string, limit: number) {
    super(
      `${resource} 사용량 한도를 초과했습니다. (${limit}개)`,
      'USAGE_LIMIT_EXCEEDED',
      429,
      `이번 달 ${resource} 사용량(${limit}개)을 모두 사용했습니다. Pro 플랜으로 업그레이드하세요.`
    )
  }
}

export class PlanRequiredError extends AppError {
  constructor(feature: string) {
    super(
      `${feature}는 Pro 플랜 전용 기능입니다.`,
      'PLAN_REQUIRED',
      403,
      `${feature}는 Pro 플랜에서 사용할 수 있습니다.`
    )
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400, message)
  }
}

export class AIGenerationError extends AppError {
  constructor(service: 'claude' | 'fal') {
    super(
      `${service} AI 생성에 실패했습니다.`,
      'AI_GENERATION_FAILED',
      500,
      'AI 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
    )
  }
}

export class PaymentError extends AppError {
  constructor(action: 'checkout' | 'portal' | 'webhook') {
    const messages = {
      checkout: '결제 페이지 생성에 실패했습니다.',
      portal: '결제 관리 포털에 접근할 수 없습니다.',
      webhook: '결제 웹훅 처리에 실패했습니다.',
    }
    super(
      messages[action],
      'PAYMENT_ERROR',
      500,
      `${messages[action]} 잠시 후 다시 시도해주세요.`
    )
  }
}

export class NoSubscriptionError extends AppError {
  constructor() {
    super(
      '구독 정보를 찾을 수 없습니다.',
      'NO_SUBSCRIPTION',
      404,
      '활성화된 구독이 없습니다. 먼저 Pro 플랜에 가입해주세요.'
    )
  }
}

export function handleApiError(error: unknown): Response {
  logger.error('API Error', error)

  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.userMessage || error.message,
        },
      },
      { status: error.statusCode }
    )
  }

  return Response.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
    { status: 500 }
  )
}

export async function generateWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      logger.warn(`Retry attempt ${i + 1} failed`, error)

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}
