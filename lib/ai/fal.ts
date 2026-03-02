import { fal } from '@fal-ai/client'
import sharp from 'sharp'
import type { StyleDirection, ColorMode, IconStyle, CornerStyle } from '@/types/database'
import type { Project, BrandProfile, StylePreset } from '@/types/database'
import { composeIconPrompt } from '@/lib/prompts'
import type {
  IconPromptConfig,
  IconVisualStyle,
  IconShape,
  IconEmotion,
  IconColorScheme,
} from '@/lib/prompts'
import { AI_CONFIG, type FalQualityTier } from '@/lib/config/ai'
import { AIGenerationError } from '@/lib/utils/errors'

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
  seed?: number
  quality?: FalQualityTier
  styleModifier?: string
  negativePrompt?: string
  promptTemplate?: string
}

const ICON_NEGATIVE_PROMPT =
  'text, letters, words, typography, watermark, signature, blurry, low quality, ' +
  'multiple icons, busy background, photograph, realistic photo'

/**
 * AI 아이콘 생성
 * FAL AI의 Flux 모델을 사용하여 브랜드 스타일에 맞는 아이콘을 생성합니다.
 */
export async function generateIcon(params: GenerateIconParams) {
  const { description, brandProfile, promptConfig, styleModifier, negativePrompt, promptTemplate } = params
  const quality = params.quality ?? 'fast'
  const modelConfig = AI_CONFIG.fal.models[quality]
  const seed = params.seed ?? Math.floor(Math.random() * AI_CONFIG.fal.maxSeedValue)

  let prompt: string

  if (promptTemplate) {
    prompt = promptTemplate.replace('{description}', description)
  } else if (promptConfig) {
    const brandColors = brandProfile
      ? { primary: brandProfile.primaryColor }
      : undefined

    const composed = composeIconPrompt(promptConfig, brandColors)
    prompt = `${description}, ${composed.userPrompt}`
  } else if (brandProfile) {
    const autoConfig = brandProfileToPromptConfig(brandProfile)
    const composed = composeIconPrompt(autoConfig, { primary: brandProfile.primaryColor })
    const promptParts = [description, composed.userPrompt]
    if (styleModifier) {
      promptParts.push(`Style reference: ${styleModifier}`)
    }
    prompt = promptParts.join('. ')
  } else {
    prompt = buildDefaultPrompt(description, styleModifier)
  }

  // 템플릿 미사용 시에만 positive prompt에 Avoid 추가 (템플릿은 자체 제약 내장)
  if (negativePrompt && !promptTemplate) {
    prompt += `. Avoid: ${negativePrompt}`
  }

  const combinedNegativePrompt = [ICON_NEGATIVE_PROMPT, negativePrompt].filter(Boolean).join(', ')

  const falInput: Record<string, unknown> = {
    prompt,
    negative_prompt: combinedNegativePrompt,
    num_images: AI_CONFIG.fal.numImages,
    image_size: AI_CONFIG.fal.imageSize,
    num_inference_steps: modelConfig.steps,
    seed,
  }

  const result = await fal.subscribe(modelConfig.model, {
    input: falInput as never,
  })

  const resultSeed = getNumericSeed((result as { data?: { seed?: unknown } })?.data?.seed)
  return result.data.images.map((img) => ({
    url: img.url,
    seed: getNumericSeed((img as { seed?: unknown }).seed) ?? resultSeed ?? seed,
  }))
}

// ========================================
// OG Background Generation
// ========================================

interface GenerateOgBackgroundParams {
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
  width: number
  height: number
}

/**
 * OG 이미지 배경 AI 생성
 * 스타일 프리셋의 og_ai_style_modifier를 사용하여 브랜드에 맞는 배경 이미지를 생성합니다.
 */
export async function generateOgBackground(params: GenerateOgBackgroundParams): Promise<Buffer> {
  const { project, brandProfile, stylePreset, width, height } = params

  const primaryColor = project.primary_color_override || brandProfile?.primary_color || '#6366F1'
  const secondaryColors = brandProfile?.secondary_colors?.length
    ? brandProfile.secondary_colors.join(', ')
    : null

  const ogModifier = stylePreset.og_ai_style_modifier || stylePreset.ai_style_modifier || ''
  const negativeTerms = stylePreset.icon_ai_negative_prompt || ''

  // 구조화된 OG 배경 프롬프트
  const promptParts = [
    `A professional abstract background image for a brand called "${project.name}"`,
    ogModifier,
    `Primary color: ${primaryColor}`,
    secondaryColors ? `Secondary colors: ${secondaryColors}` : null,
    'Abstract decorative background only, no text, no logos, no human faces, no readable words, no letters',
  ].filter(Boolean)

  let prompt = promptParts.join('. ')

  // 네거티브 지시사항 추가
  const avoidTerms = [
    'text', 'words', 'letters', 'numbers', 'logos', 'human faces', 'portraits',
    negativeTerms,
  ].filter(Boolean).join(', ')
  prompt += `. Avoid: ${avoidTerms}`

  let result
  try {
    result = await fal.subscribe(AI_CONFIG.falOg.model, {
      input: {
        prompt,
        num_images: AI_CONFIG.falOg.numImages,
        image_size: AI_CONFIG.falOg.imageSize,
        num_inference_steps: AI_CONFIG.falOg.numInferenceSteps,
        seed: Math.floor(Math.random() * AI_CONFIG.fal.maxSeedValue),
      },
    })
  } catch (error) {
    throw new AIGenerationError('fal')
  }

  const imageUrl = result.data?.images?.[0]?.url
  if (!imageUrl) {
    throw new AIGenerationError('fal')
  }

  // 생성된 이미지를 정확한 크기로 리사이즈
  const response = await fetch(imageUrl)
  const buffer = Buffer.from(await response.arrayBuffer())

  return sharp(buffer)
    .resize(width, height, { fit: 'cover' })
    .png()
    .toBuffer()
}

// ========================================
// Internal Helpers
// ========================================

function buildDefaultPrompt(
  description: string,
  styleModifier?: string,
): string {
  const parts = [
    description,
    styleModifier ? `Style reference: ${styleModifier}` : '',
    'single centered icon',
    'clean professional app icon design',
    'high quality, vector-style rendering',
    'no text, no letters, no watermark',
    'square composition, symmetric',
  ]

  return parts.filter(Boolean).join(', ')
}

function getNumericSeed(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value
  }
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return Number(value)
  }
  return undefined
}

function brandProfileToPromptConfig(profile: BrandProfileInfo): IconPromptConfig {
  const visualStyleMap: Record<IconStyle, IconVisualStyle> = {
    outline: 'outline-medium',
    filled: 'filled-solid',
    '3d_soft': '3d-soft',
    flat: 'flat-minimal',
  }

  const shapeMap: Record<CornerStyle, IconShape> = {
    sharp: 'sharp-square',
    rounded: 'rounded-square',
    pill: 'circle',
  }

  const colorMap: Record<ColorMode, IconColorScheme> = {
    mono: 'monochrome',
    duotone: 'duotone',
    gradient: 'gradient-linear',
    vibrant: 'vibrant-multi',
  }

  const emotionMap: Record<StyleDirection, IconEmotion> = {
    minimal: 'sophisticated',
    playful: 'playful',
    corporate: 'trustworthy',
    tech: 'innovative',
    custom: 'innovative',
  }

  return {
    visualStyle: visualStyleMap[profile.iconStyle],
    shape: shapeMap[profile.cornerStyle],
    emotion: emotionMap[profile.styleDirection],
    colorScheme: colorMap[profile.colorMode],
    complexity: 'moderate',
  }
}
