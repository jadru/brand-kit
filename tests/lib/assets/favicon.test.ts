import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { generateFavicons } from '@/lib/assets/favicon'
import type { Project, StylePreset } from '@/types/database'

function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    user_id: 'u1',
    brand_profile_id: null,
    style_preset_id: 's1',
    name: 'Favicon Test',
    description: null,
    platform: 'web',
    mobile_target: null,
    primary_color_override: '#3366FF',
    icon_type: 'text',
    icon_value: 'BK',
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
    corner_radius: 16,
    shadow_style: null,
    color_mode: null,
    og_layout: null,
    og_typography: null,
    og_background: null,
    ai_style_modifier: null,
    preview_image_url: null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('generateFavicons', () => {
  it('should generate favicon set including PWA icons', async () => {
    const results = await generateFavicons({
      iconSource: { type: 'text', value: 'BK' },
      project: createProject(),
      stylePreset: createStylePreset(),
    })

    expect(results['favicon.svg']).toBeDefined()
    expect(results['favicon.ico']).toBeDefined()
    expect(results['apple-touch-icon.png']).toBeDefined()
    expect(results['favicon-16x16.png']).toBeDefined()
    expect(results['favicon-32x32.png']).toBeDefined()
    expect(results['favicon-48x48.png']).toBeDefined()
    expect(results['icon-192.png']).toBeDefined()
    expect(results['icon-512.png']).toBeDefined()

    const pwa192Meta = await sharp(results['icon-192.png']).metadata()
    const pwa512Meta = await sharp(results['icon-512.png']).metadata()

    expect(pwa192Meta.width).toBe(192)
    expect(pwa192Meta.height).toBe(192)
    expect(pwa512Meta.width).toBe(512)
    expect(pwa512Meta.height).toBe(512)
    expect(results['favicon.ico'].length).toBeGreaterThan(0)
  })
})
