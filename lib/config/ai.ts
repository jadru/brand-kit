/**
 * AI 서비스 설정
 * FAL AI (이미지 생성) 및 Claude (텍스트 생성) 설정 상수
 */

export const AI_CONFIG = {
  fal: {
    model: 'fal-ai/flux/schnell',
    numImages: 4,
    imageSize: 'square_hd' as const,
    numInferenceSteps: 4,
    maxSeedValue: 1000000,
  },
  claude: {
    model: 'claude-sonnet-4-20250514',
    maxTokens: 500,
  },
} as const

export type FalImageSize = typeof AI_CONFIG.fal.imageSize
