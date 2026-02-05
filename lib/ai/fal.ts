import { fal } from '@fal-ai/client'
import type { StyleDirection, ColorMode, IconStyle, CornerStyle } from '@/types/database'
import { composeIconPrompt } from '@/lib/prompts'
import type { IconPromptConfig } from '@/lib/prompts'
import { AI_CONFIG } from '@/lib/config/ai'

fal.config({
  credentials: process.env.FAL_KEY!,
})

interface BrandProfileInfo {
  styleDirection: StyleDirection
  primaryColor: string
  colorMode: ColorMode
  iconStyle: IconStyle
  cornerStyle: CornerStyle
  keywords: string[]
}

interface GenerateIconParams {
  description: string
  brandProfile?: BrandProfileInfo
  promptConfig?: IconPromptConfig
}

/**
 * AI 아이콘 생성
 * FAL AI의 Flux 모델을 사용하여 브랜드 스타일에 맞는 아이콘을 생성합니다.
 */
export async function generateIcon(params: GenerateIconParams) {
  const { description, brandProfile, promptConfig } = params

  let prompt: string

  if (promptConfig) {
    const brandColors = brandProfile
      ? { primary: brandProfile.primaryColor }
      : undefined

    const composed = composeIconPrompt(promptConfig, brandColors)
    prompt = `${description}, ${composed.userPrompt}`
  } else {
    // 기본 프롬프트 생성 (promptConfig 없는 경우)
    prompt = buildDefaultPrompt(description, brandProfile)
  }

  const result = await fal.subscribe(AI_CONFIG.fal.model, {
    input: {
      prompt,
      num_images: AI_CONFIG.fal.numImages,
      image_size: AI_CONFIG.fal.imageSize,
      num_inference_steps: AI_CONFIG.fal.numInferenceSteps,
      seed: Math.floor(Math.random() * AI_CONFIG.fal.maxSeedValue),
    },
  })

  return result.data.images.map((img) => ({ url: img.url, seed: 0 }))
}

/**
 * @deprecated generateIcon을 대신 사용하세요
 */
export const generateIconWithPromptConfig = generateIcon

// ========================================
// Internal Helpers
// ========================================

function buildDefaultPrompt(
  description: string,
  brandProfile?: BrandProfileInfo
): string {
  const parts = [
    description,
    brandProfile ? getStyleModifier(brandProfile.styleDirection) : '',
    brandProfile?.keywords.join(', ') || '',
    'single centered icon',
    brandProfile ? getColorInstruction(brandProfile) : '',
    'white background',
    brandProfile ? getIconStyleModifier(brandProfile.iconStyle) : '',
    brandProfile ? getCornerStyleModifier(brandProfile.cornerStyle) : '',
    'clean professional app icon design',
    'high quality, vector-style rendering',
    'no text, no letters, no watermark',
    'square composition, symmetric',
  ]

  return parts.filter(Boolean).join(', ')
}

function getStyleModifier(direction: StyleDirection): string {
  const map: Record<StyleDirection, string> = {
    minimal: 'clean lines, simple shapes, whitespace, understated, elegant simplicity',
    playful: 'rounded shapes, vibrant, friendly, bouncy, cheerful, soft edges',
    corporate: 'professional, structured, balanced, trustworthy, refined',
    tech: 'geometric, futuristic, sleek, digital, modern, sharp',
    custom: '',
  }
  return map[direction]
}

function getIconStyleModifier(style: IconStyle): string {
  const map: Record<IconStyle, string> = {
    outline: 'thin outline, stroke-based, line art, no fill',
    filled: 'solid fill, bold shapes, flat design',
    '3d_soft': 'soft 3D render, subtle shadows, rounded, depth',
    flat: 'flat design, solid colors, no shadows, minimal',
  }
  return map[style]
}

function getCornerStyleModifier(style: CornerStyle): string {
  const map: Record<CornerStyle, string> = {
    sharp: 'sharp corners, angular, precise edges',
    rounded: 'rounded corners, soft edges',
    pill: 'fully rounded, pill shape, circular elements',
  }
  return map[style]
}

function getColorInstruction(profile: BrandProfileInfo): string {
  const { colorMode, primaryColor } = profile

  switch (colorMode) {
    case 'mono':
      return `monochrome, single color ${primaryColor}`
    case 'duotone':
      return `duotone, ${primaryColor} and white`
    case 'gradient':
      return `gradient from ${primaryColor} to white`
    case 'vibrant':
      return `vibrant colors, ${primaryColor} as primary accent`
    default:
      return ''
  }
}
