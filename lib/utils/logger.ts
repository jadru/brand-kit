/**
 * 환경별 로깅 유틸리티
 * 개발 환경에서는 상세 로그, 프로덕션에서는 에러만 출력
 */

const isDev = process.env.NODE_ENV === 'development'

type LogData = unknown

interface Logger {
  debug: (message: string, data?: LogData) => void
  info: (message: string, data?: LogData) => void
  warn: (message: string, data?: LogData) => void
  error: (message: string, data?: LogData) => void
}

export const logger: Logger = {
  /**
   * 디버그 로그 (개발 환경에서만 출력)
   */
  debug: (message: string, data?: LogData) => {
    if (isDev) {
      console.log(`[DEBUG] ${message}`, data !== undefined ? data : '')
    }
  },

  /**
   * 정보 로그 (개발 환경에서만 출력)
   */
  info: (message: string, data?: LogData) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, data !== undefined ? data : '')
    }
  },

  /**
   * 경고 로그 (개발 환경에서만 출력)
   */
  warn: (message: string, data?: LogData) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data !== undefined ? data : '')
    }
  },

  /**
   * 에러 로그 (항상 출력 - 프로덕션 디버깅에 필요)
   */
  error: (message: string, data?: LogData) => {
    console.error(`[ERROR] ${message}`, data !== undefined ? data : '')
  },
}
