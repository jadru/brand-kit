import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { generateTextSVG, renderIconToBuffer, validateImage } from '@/lib/utils/image'
import type { Project, StylePreset } from '@/types/database'

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    user_id: 'u1',
    brand_profile_id: null,
    style_preset_id: 's1',
    name: 'Test Project',
    description: null,
    platform: 'web',
    mobile_target: null,
    primary_color_override: '#FFFF00',
    icon_type: 'text',
    icon_value: 'AB',
    ai_headline: null,
    ai_tagline: null,
    ai_og_description: null,
    ai_short_slogan: null,
    assets_zip_url: null,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

function createStylePreset(overrides: Partial<StylePreset> = {}): StylePreset {
  return {
    id: 's1',
    name: 'Style',
    slug: 'style',
    is_free: true,
    best_for_styles: [],
    icon_style: null,
    corner_radius: 18,
    shadow_style: null,
    color_mode: null,
    og_layout: null,
    og_typography: null,
    og_background: null,
    og_ai_style_modifier: null,
    icon_ai_negative_prompt: null,
    icon_ai_prompt_template: null,
    ai_style_modifier: null,
    preview_image_url: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('image utils', () => {
  it('generateTextSVG should limit to 2 chars and apply high legibility style', () => {
    const svg = generateTextSVG('abcd', '#000000', '#FFFFFF', 8)

    expect(svg).toContain('>AB<')
    expect(svg).toContain('font-size="46"')
    expect(svg).toContain('font-weight="900"')
  })

  it('renderIconToBuffer should return PNG of requested size for text icons', async () => {
    const project = createProject()
    const stylePreset = createStylePreset()

    const png = await renderIconToBuffer({ type: 'text', value: 'AB' }, 128, project, stylePreset)
    const metadata = await sharp(png).metadata()

    expect(metadata.width).toBe(128)
    expect(metadata.height).toBe(128)
    expect(metadata.format).toBe('png')
  })

  it('validateImage should reject mismatched dimensions', async () => {
    const buffer = await sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    }).png().toBuffer()

    await expect(validateImage(buffer, 32, 32, 'icon')).rejects.toThrow('expected 32x32')
  })
})
