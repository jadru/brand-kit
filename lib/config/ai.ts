/**
 * AI 서비스 설정
 * FAL AI (이미지 생성) 및 Claude (텍스트 생성) 설정 상수
 */

export const AI_CONFIG = {
  fal: {
    models: {
      fast: { model: 'fal-ai/flux/schnell', steps: 8 },
      quality: { model: 'fal-ai/flux/dev', steps: 28 },
    },
    numImages: 4,
    imageSize: 'square_hd' as const,
    maxSeedValue: 1000000,
  },
  falOg: {
    model: 'fal-ai/flux/dev',
    numImages: 1,
    imageSize: 'landscape_16_9' as const,
    numInferenceSteps: 25,
  },
  claude: {
    model: 'claude-sonnet-4-20250514',
    maxTokens: 500,
  },
} as const

export type FalImageSize = typeof AI_CONFIG.fal.imageSize | typeof AI_CONFIG.falOg.imageSize
export type FalQualityTier = keyof typeof AI_CONFIG.fal.models
