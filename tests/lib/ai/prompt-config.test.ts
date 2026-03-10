import { beforeAll, describe, expect, it } from 'vitest'
import { composeOgBackgroundPrompt, mergePromptConfig, getDefaultPromptConfig } from '@/lib/prompts'
import type { MetadataPromptConfig, OgPromptConfig } from '@/lib/prompts'
import type { StylePreset } from '@/types/database'

let brandProfileToMetadataConfig: (input: {
  platform: string
  styleDirection?: string
  keywords?: string[]
  language?: MetadataPromptConfig['language']
}) => MetadataPromptConfig

let stylePresetToOgConfig: (preset: StylePreset) => Partial<OgPromptConfig>

beforeAll(async () => {
  process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key'
  process.env.FAL_KEY = process.env.FAL_KEY || 'test-key'

  ;({ brandProfileToMetadataConfig } = await import('@/lib/ai/claude'))
  ;({ stylePresetToOgConfig } = await import('@/lib/ai/fal'))
})

describe('prompt config mapping', () => {
  it('maps brand profile hints to metadata prompt config', () => {
    const config = brandProfileToMetadataConfig({
      platform: 'all',
      styleDirection: 'tech',
      keywords: ['B2B SaaS', 'enterprise security', 'automation'],
    })

    expect(config).toMatchObject({
      tone: 'technical',
      audience: 'b2b-enterprise',
      contentType: 'saas-homepage',
      urgency: 'evergreen',
      language: 'ko',
      focusKeywords: ['B2B SaaS', 'enterprise security', 'automation'],
    })
  })

  it('maps style preset OG fields into structured OG config', () => {
    const preset: StylePreset = {
      id: 'preset-1',
      name: 'Linear Dark',
      slug: 'linear-dark',
      is_free: false,
      best_for_styles: ['tech', 'minimal'],
      icon_style: 'Outline with neon accent',
      corner_radius: 12,
      shadow_style: 'Subtle neon glow',
      color_mode: 'Dark with accent',
      og_layout: 'Left-aligned, dark background',
      og_typography: 'Inter, Medium',
      og_background: 'Dark (#0A0A0A) with subtle gradient',
      ai_style_modifier: 'dark background, neon accent lines, futuristic, Linear-style',
      og_ai_style_modifier: 'deep dark matte background with subtle neon accent lines',
      icon_ai_negative_prompt: 'bright colors, busy, cartoon',
      icon_ai_prompt_template: null,
      preview_image_url: null,
      sort_order: 4,
      created_at: '2026-03-10T00:00:00.000Z',
    }

    expect(stylePresetToOgConfig(preset)).toMatchObject({
      layout: 'left-aligned',
      visual: 'grid-pattern',
      typography: 'technical-mono',
      mood: 'technical',
      customAccent: 'deep dark matte background with subtle neon accent lines',
    })
  })

  it('composes OG prompts with preset overrides and brand colors', () => {
    const promptConfig = mergePromptConfig(getDefaultPromptConfig(), {
      og: {
        layout: 'minimal-corner',
        visual: 'grid-pattern',
        typography: 'technical-mono',
        mood: 'technical',
        customAccent: 'thin neon line accents',
      },
    }).og as OgPromptConfig

    const composed = composeOgBackgroundPrompt(promptConfig, {
      brandName: 'Conductor',
      primaryColor: '#0A84FF',
      secondaryColors: ['#7C3AED'],
    })

    expect(composed.userPrompt).toContain('technical developer aesthetic')
    expect(composed.userPrompt).toContain('thin neon line accents')
    expect(composed.userPrompt).toContain('primary brand color: #0A84FF')
    expect(composed.userPrompt).toContain('without rendering the brand name')
  })
})
