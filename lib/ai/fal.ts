import { fal, type RunOptions } from '@fal-ai/client'
import sharp from 'sharp'
import type { StyleDirection, ColorMode, IconStyle, CornerStyle } from '@/types/database'
import type { Project, BrandProfile, StylePreset } from '@/types/database'
import {
  composeIconPrompt,
  composeOgBackgroundPrompt,
  getDefaultPromptConfig,
  mergePromptConfig,
} from '@/lib/prompts'
import type {
  OgPromptConfig,
  OgLayoutStyle,
  OgVisualElement,
  OgTypographyStyle,
  OgMoodTone,
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

interface FalFluxInput {
  prompt: string
  negative_prompt?: string
  num_images?: number
  image_size?: typeof AI_CONFIG.fal.imageSize
  num_inference_steps?: number
  seed?: number
}

const ICON_NEGATIVE_PROMPT =
  'text, letters, words, typography, watermark, signature, blurry, low quality, ' +
  'multiple icons, busy background, photograph, realistic photo'
const DEFAULT_OG_CONFIG = getDefaultPromptConfig().og as OgPromptConfig

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

  const falInput: FalFluxInput = {
    prompt,
    negative_prompt: combinedNegativePrompt,
    num_images: AI_CONFIG.fal.numImages,
    image_size: AI_CONFIG.fal.imageSize,
    num_inference_steps: modelConfig.steps,
    seed,
  }

  const runOptions: RunOptions<FalFluxInput> = {
    input: falInput,
  }

  const result = await fal.subscribe(modelConfig.model, {
    ...runOptions,
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
  const secondaryColors = brandProfile?.secondary_colors
  const promptConfig = mergePromptConfig(getDefaultPromptConfig(), {
    og: stylePresetToOgConfig(stylePreset),
  }).og as OgPromptConfig
  const composedPrompt = composeOgBackgroundPrompt(promptConfig, {
    brandName: project.name,
    primaryColor,
    secondaryColors,
  })
  const negativeTerms = stylePreset.icon_ai_negative_prompt || ''

  let prompt = [composedPrompt.systemPrompt, composedPrompt.userPrompt].join(' ')

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
  } catch {
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

export function stylePresetToOgConfig(preset: StylePreset): Partial<OgPromptConfig> {
  const knownPresets: Record<string, Partial<OgPromptConfig>> = {
    'notion-minimal': {
      layout: 'minimal-corner',
      visual: 'none',
      typography: 'minimal-clean',
      mood: 'minimal',
    },
    'airbnb-3d': {
      layout: 'centered',
      visual: 'gradient-blob',
      typography: 'playful-rounded',
      mood: 'friendly',
    },
    'stripe-gradient': {
      layout: 'centered',
      visual: 'gradient-blob',
      typography: 'bold-modern',
      mood: 'technical',
    },
    'linear-dark': {
      layout: 'left-aligned',
      visual: 'grid-pattern',
      typography: 'technical-mono',
      mood: 'technical',
    },
    'vercel-sharp': {
      layout: 'centered',
      visual: 'geometric-shapes',
      typography: 'bold-modern',
      mood: 'bold',
    },
    'glassmorphism': {
      layout: 'centered',
      visual: 'gradient-blob',
      typography: 'minimal-clean',
      mood: 'creative',
    },
    'duolingo-playful': {
      layout: 'card-stack',
      visual: 'illustration',
      typography: 'playful-rounded',
      mood: 'energetic',
    },
    'figma-clean': {
      layout: 'split-vertical',
      visual: 'grid-pattern',
      typography: 'minimal-clean',
      mood: 'professional',
    },
  }

  const layoutSource = preset.og_layout?.toLowerCase() || ''
  const typographySource = preset.og_typography?.toLowerCase() || ''
  const visualSource = [
    preset.og_background,
    preset.og_ai_style_modifier,
    preset.ai_style_modifier,
  ].filter(Boolean).join(' ').toLowerCase()
  const moodSource = [
    preset.slug,
    preset.og_background,
    preset.og_ai_style_modifier,
    ...preset.best_for_styles,
  ].join(' ').toLowerCase()

  const inferred: Partial<OgPromptConfig> = {
    layout: inferOgLayout(layoutSource),
    visual: inferOgVisual(visualSource),
    typography: inferOgTypography(typographySource),
    mood: inferOgMood(moodSource),
    customAccent: preset.og_ai_style_modifier || preset.ai_style_modifier || undefined,
  }

  return {
    ...inferred,
    ...knownPresets[preset.slug],
    customAccent: inferred.customAccent,
  }
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

function inferOgLayout(layoutSource: string): OgLayoutStyle {
  if (layoutSource.includes('left')) return 'left-aligned'
  if (layoutSource.includes('grid')) return 'split-vertical'
  if (layoutSource.includes('playful')) return 'card-stack'
  if (layoutSource.includes('diagonal')) return 'diagonal-split'
  if (layoutSource.includes('corner')) return 'minimal-corner'
  if (layoutSource.includes('split') && layoutSource.includes('horizontal')) return 'split-horizontal'
  if (layoutSource.includes('split')) return 'split-vertical'
  return DEFAULT_OG_CONFIG.layout
}

function inferOgVisual(visualSource: string): OgVisualElement {
  if (visualSource.includes('photo')) return 'photo-background'
  if (visualSource.includes('grid')) return 'grid-pattern'
  if (visualSource.includes('noise') || visualSource.includes('grain')) return 'noise-texture'
  if (visualSource.includes('illustration') || visualSource.includes('mascot')) return 'illustration'
  if (visualSource.includes('icon') || visualSource.includes('logo accent')) return 'icon-accent'
  if (visualSource.includes('blob') || visualSource.includes('gradient') || visualSource.includes('aurora') || visualSource.includes('glass')) {
    return 'gradient-blob'
  }
  if (visualSource.includes('geometric') || visualSource.includes('line') || visualSource.includes('shape') || visualSource.includes('monochrome')) {
    return 'geometric-shapes'
  }
  if (visualSource.includes('pattern')) return 'abstract-pattern'
  return DEFAULT_OG_CONFIG.visual
}

function inferOgTypography(typographySource: string): OgTypographyStyle {
  if (typographySource.includes('mono') || typographySource.includes('code')) return 'technical-mono'
  if (typographySource.includes('serif')) return 'elegant-serif'
  if (typographySource.includes('editorial')) return 'editorial'
  if (typographySource.includes('jakarta') || typographySource.includes('nunito') || typographySource.includes('rounded')) {
    return 'playful-rounded'
  }
  if (typographySource.includes('regular') || typographySource.includes('light') || typographySource.includes('clean')) {
    return 'minimal-clean'
  }
  if (typographySource.includes('handwritten') || typographySource.includes('script')) {
    return 'handwritten-accent'
  }
  return DEFAULT_OG_CONFIG.typography
}

function inferOgMood(moodSource: string): OgMoodTone {
  if (moodSource.includes('playful') || moodSource.includes('friendly') || moodSource.includes('warm') || moodSource.includes('cozy')) {
    return 'friendly'
  }
  if (moodSource.includes('energetic') || moodSource.includes('cheerful') || moodSource.includes('vivid')) {
    return 'energetic'
  }
  if (moodSource.includes('technical') || moodSource.includes('neon') || moodSource.includes('futuristic') || moodSource.includes('grid')) {
    return 'technical'
  }
  if (moodSource.includes('luxury') || moodSource.includes('luxurious') || moodSource.includes('premium')) {
    return 'luxurious'
  }
  if (moodSource.includes('creative') || moodSource.includes('glass') || moodSource.includes('artistic')) {
    return 'creative'
  }
  if (moodSource.includes('minimal') || moodSource.includes('clean') || moodSource.includes('monochrome')) {
    return 'minimal'
  }
  if (moodSource.includes('bold') || moodSource.includes('contrast') || moodSource.includes('brutalist')) {
    return 'bold'
  }
  return DEFAULT_OG_CONFIG.mood
}
