import { fal } from '@fal-ai/client'
import sharp from 'sharp'
import type { StyleDirection, ColorMode, IconStyle, CornerStyle } from '@/types/database'
import type { Project, BrandProfile, StylePreset } from '@/types/database'
import { composeIconPrompt } from '@/lib/prompts'
import type { IconPromptConfig, IconVisualStyle, IconShape, IconColorScheme } from '@/lib/prompts'
import { AI_CONFIG } from '@/lib/config/ai'
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
  styleModifier?: string
  negativePrompt?: string
}

/**
 * AI 아이콘 생성
 * FAL AI의 Flux 모델을 사용하여 브랜드 스타일에 맞는 아이콘을 생성합니다.
 */
export async function generateIcon(params: GenerateIconParams) {
  const { description, brandProfile, promptConfig, styleModifier, negativePrompt } = params

  let prompt: string

  if (promptConfig) {
    const brandColors = brandProfile
      ? { primary: brandProfile.primaryColor }
      : undefined

    const composed = composeIconPrompt(promptConfig, brandColors)
    prompt = `${description}, ${composed.userPrompt}`
  } else if (brandProfile) {
    // 브랜드 프로필이 있으면 자동으로 IconPromptConfig 도출하여 구조화된 프롬프트 생성
    const derivedConfig = deriveIconPromptConfig(brandProfile)
    const brandColors = { primary: brandProfile.primaryColor }
    const composed = composeIconPrompt(derivedConfig, brandColors)

    // 구조화된 프롬프트: description + composed system + style modifier
    const promptParts = [
      description,
      composed.userPrompt,
    ]

    if (styleModifier) {
      promptParts.push(`Style reference: ${styleModifier}`)
    }

    prompt = promptParts.join('. ')
  } else {
    prompt = buildDefaultPrompt(description, styleModifier)
  }

  // 네거티브 프롬프트를 positive prompt에 Avoid 섹션으로 추가
  if (negativePrompt) {
    prompt += `. Avoid: ${negativePrompt}`
  }

  let result
  try {
    result = await fal.subscribe(AI_CONFIG.fal.model, {
      input: {
        prompt,
        num_images: AI_CONFIG.fal.numImages,
        image_size: AI_CONFIG.fal.imageSize,
        num_inference_steps: AI_CONFIG.fal.numInferenceSteps,
        seed: Math.floor(Math.random() * AI_CONFIG.fal.maxSeedValue),
      },
    })
  } catch (error) {
    throw new AIGenerationError('fal')
  }

  const images = result.data?.images
  if (!Array.isArray(images) || images.length === 0) {
    throw new AIGenerationError('fal')
  }

  return images.map((img) => ({ url: img.url, seed: 0 }))
}

/**
 * @deprecated generateIcon을 대신 사용하세요
 */
export const generateIconWithPromptConfig = generateIcon

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

/**
 * BrandProfile 데이터에서 IconPromptConfig를 자동 도출
 */
function deriveIconPromptConfig(brandProfile: BrandProfileInfo): IconPromptConfig {
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

  const colorSchemeMap: Record<ColorMode, IconColorScheme> = {
    mono: 'monochrome',
    duotone: 'duotone',
    gradient: 'gradient-linear',
    vibrant: 'vibrant-multi',
  }

  const emotionMap: Record<StyleDirection, IconPromptConfig['emotion']> = {
    minimal: 'sophisticated',
    playful: 'friendly',
    corporate: 'trustworthy',
    tech: 'innovative',
    custom: 'innovative',
  }

  return {
    visualStyle: visualStyleMap[brandProfile.iconStyle],
    shape: shapeMap[brandProfile.cornerStyle],
    colorScheme: colorSchemeMap[brandProfile.colorMode],
    emotion: emotionMap[brandProfile.styleDirection],
    complexity: 'moderate',
  }
}

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
