import type {
  ComposedPrompt,
  OgPromptConfig,
  IconPromptConfig,
  MetadataPromptConfig,
  FullPromptConfig,
  PromptCategory,
} from './types'
import { resolveConflicts } from './conflict-resolver'
import {
  ogLayoutCategories,
  ogVisualCategories,
  ogTypographyCategories,
  ogMoodCategories,
} from './categories/og-image'
import {
  iconVisualStyleCategories,
  iconShapeCategories,
  iconIndustryCategories,
  iconEmotionCategories,
  iconColorSchemeCategories,
} from './categories/icon'
import {
  metadataToneCategories,
  metadataAudienceCategories,
  metadataContentTypeCategories,
  metadataUrgencyCategories,
} from './categories/metadata'

function findCategory<T extends string>(
  categories: PromptCategory<T>[],
  id: T | undefined
): PromptCategory<T> | undefined {
  if (!id) return undefined
  return categories.find((c) => c.id === id)
}

// ========================================
// OG Background Prompt Composer
// ========================================

export function composeOgBackgroundPrompt(
  config: OgPromptConfig,
  context: {
    brandName: string
    primaryColor: string
    secondaryColors?: string[]
  }
): ComposedPrompt {
  const selectedCategories = [
    findCategory(ogLayoutCategories, config.layout),
    findCategory(ogVisualCategories, config.visual),
    findCategory(ogTypographyCategories, config.typography),
    findCategory(ogMoodCategories, config.mood),
  ].filter(Boolean) as PromptCategory[]

  const { resolved, warnings } = resolveConflicts(selectedCategories)
  const fragments = resolved.map((c) => c.promptFragment)

  const colorFragments = [
    `primary brand color: ${context.primaryColor}`,
    context.secondaryColors?.length
      ? `secondary brand colors: ${context.secondaryColors.join(', ')}`
      : null,
    config.customAccent?.trim() || null,
  ].filter(Boolean) as string[]

  const coreRequirements = [
    `for the brand atmosphere of "${context.brandName}" without rendering the brand name`,
    'abstract decorative background only',
    'no text, no readable words, no letters, no logos',
    'no people, no faces, no products, no UI mockups',
    'optimized for OG and social sharing with clean safe areas for overlay text',
  ]

  return {
    systemPrompt: 'Generate an abstract brand background image with the following direction:',
    userPrompt: [...fragments, ...colorFragments, ...coreRequirements].join(', '),
    fragments: [...fragments, ...colorFragments, ...coreRequirements],
    warnings,
  }
}

// ========================================
// Icon Prompt Composer
// ========================================

export function composeIconPrompt(
  config: IconPromptConfig,
  brandColors?: { primary: string; secondary?: string[] }
): ComposedPrompt {
  const selectedCategories = [
    findCategory(iconVisualStyleCategories, config.visualStyle),
    findCategory(iconShapeCategories, config.shape),
    findCategory(iconIndustryCategories, config.industry),
    findCategory(iconEmotionCategories, config.emotion),
    findCategory(iconColorSchemeCategories, config.colorScheme),
  ].filter(Boolean) as PromptCategory[]

  const { resolved, warnings } = resolveConflicts(selectedCategories)
  const fragments = resolved.map((c) => c.promptFragment)

  // 브랜드 컬러 추가 (brand-colors 선택 시)
  if (config.colorScheme === 'brand-colors' && brandColors) {
    fragments.push(`primary brand color: ${brandColors.primary}`)
    if (brandColors.secondary?.length) {
      fragments.push(`secondary colors: ${brandColors.secondary.join(', ')}`)
    }
  }

  // 복잡도 수정자 추가
  const complexityMap = {
    simple: 'simple design, minimal elements, easy to recognize at small sizes, 16px readability',
    moderate: 'moderate complexity, balanced detail level, clear at 32px',
    detailed: 'detailed design with subtle elements, rich visual texture, best at 64px+',
  }
  if (config.complexity) {
    fragments.push(complexityMap[config.complexity])
  }

  // 핵심 아이콘 요구사항 추가
  const coreRequirements = [
    'single centered icon',
    'white or transparent background',
    'high quality, vector-style rendering',
    'no text, no letters, no watermark',
    'square composition, symmetric',
    'clean professional app icon design',
  ]

  return {
    systemPrompt: 'Generate a professional app icon with the following characteristics:',
    userPrompt: [...fragments, ...coreRequirements].join(', '),
    fragments: [...fragments, ...coreRequirements],
    warnings,
  }
}

// ========================================
// Metadata Prompt Composer
// ========================================

export function composeMetadataPrompt(
  config: MetadataPromptConfig,
  projectContext: {
    name: string
    description?: string
    platform: string
    brandKeywords?: string[]
    brandStyleDirection?: string
  }
): ComposedPrompt {
  const selectedCategories = [
    findCategory(metadataToneCategories, config.tone),
    findCategory(metadataAudienceCategories, config.audience),
    findCategory(metadataContentTypeCategories, config.contentType),
    findCategory(metadataUrgencyCategories, config.urgency),
  ].filter(Boolean) as PromptCategory[]

  const { resolved, warnings } = resolveConflicts(selectedCategories)
  const fragments = resolved.map((c) => c.promptFragment)

  const languageMap = {
    ko: 'Korean (한국어)',
    en: 'English',
    ja: 'Japanese (日本語)',
  }
  const targetLanguage = languageMap[config.language || 'ko']

  const systemPrompt = `You are a senior brand copywriter specializing in tech startups and SaaS products.
Your task is to generate SEO-optimized, conversion-focused copy.

## Style Guidelines
${fragments.map((f) => `- ${f}`).join('\n')}

## Focus Keywords
${config.focusKeywords?.length ? config.focusKeywords.join(', ') : 'None specified - derive from project context'}

## Output Requirements
Generate exactly 4 items in JSON format:
1. headline: Main headline for landing page (max 60 chars, ${targetLanguage})
2. tagline: Short memorable tagline (max 30 chars, ${targetLanguage})
3. ogDescription: Open Graph description for social sharing (max 155 chars, ${targetLanguage})
4. shortSlogan: Ultra-short slogan for app stores (max 15 chars, ${targetLanguage})

## Writing Guidelines
- Use active, benefit-driven language
- Avoid generic buzzwords like "revolutionary", "game-changing"
- Focus on specific value proposition
- Consider SEO keywords naturally
- If brand keywords provided, reflect the brand's tone

## Response Format
Return ONLY valid JSON, no markdown formatting:
{"headline": "...", "tagline": "...", "ogDescription": "...", "shortSlogan": "..."}`

  const userPrompt = `Project Name: ${projectContext.name}
Description: ${projectContext.description || 'No description provided'}
Platform: ${projectContext.platform}
Brand Keywords: ${projectContext.brandKeywords?.join(', ') || 'Not specified'}
Brand Style: ${projectContext.brandStyleDirection || 'Not specified'}

Generate brand copy for this project.`

  return {
    systemPrompt,
    userPrompt,
    fragments,
    warnings,
  }
}

// ========================================
// Utility Functions
// ========================================

/**
 * 기본 프롬프트 설정을 반환합니다.
 */
export function getDefaultPromptConfig(): FullPromptConfig {
  return {
    og: {
      layout: 'centered',
      visual: 'gradient-blob',
      typography: 'bold-modern',
      mood: 'professional',
    },
    icon: {
      visualStyle: 'filled-solid',
      shape: 'rounded-square',
      emotion: 'innovative',
      colorScheme: 'brand-colors',
      complexity: 'moderate',
    },
    metadata: {
      tone: 'professional',
      audience: 'b2c-general',
      contentType: 'product-landing',
      urgency: 'evergreen',
      language: 'ko',
    },
  }
}

/**
 * 프롬프트 설정을 병합합니다.
 */
export function mergePromptConfig(
  base: FullPromptConfig,
  override: Partial<FullPromptConfig>
): FullPromptConfig {
  return {
    og: { ...base.og, ...override.og },
    icon: { ...base.icon, ...override.icon },
    metadata: { ...base.metadata, ...override.metadata },
  }
}
