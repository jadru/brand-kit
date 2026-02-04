import { fal } from '@fal-ai/client'
import type { StyleDirection, ColorMode, IconStyle, CornerStyle } from '@/types/database'

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
}

export async function generateIcon(params: GenerateIconParams) {
  const prompt = buildPrompt(params)

  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt,
      num_images: 4,
      image_size: 'square_hd',
      num_inference_steps: 4,
      seed: Math.floor(Math.random() * 1000000),
    },
  })

  return result.data.images.map((img) => ({ url: img.url, seed: 0 }))
}

function buildPrompt(params: GenerateIconParams): string {
  const { description, brandProfile } = params

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
