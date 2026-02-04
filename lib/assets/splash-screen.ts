import sharp from 'sharp'
import { SPLASH_SIZES } from './constants'
import { renderIconToBuffer, type IconSource } from '@/lib/utils/image'
import { hexToRgb } from '@/lib/utils/colors'
import type { Project, StylePreset, MobileTarget } from '@/types/database'

interface SplashInput {
  iconSource: IconSource
  project: Project
  stylePreset: StylePreset
  mobileTarget: MobileTarget | null
}

export async function generateSplashScreens(input: SplashInput) {
  const { iconSource, project, stylePreset, mobileTarget } = input
  const results: Record<string, Buffer> = {}

  const iconSize = 200
  const iconBuffer = await renderIconToBuffer(iconSource, iconSize, project, stylePreset)
  const bgColorHex = project.primary_color_override || '#FFFFFF'
  const bgRgb = hexToRgb(bgColorHex)

  for (const { width, height, name } of SPLASH_SIZES) {
    if (mobileTarget === 'android' && (name.startsWith('iphone') || name.startsWith('ipad'))) continue
    if (mobileTarget === 'ios' && name.startsWith('android')) continue

    results[`splash/${name}.png`] = await sharp({
      create: { width, height, channels: 4, background: { ...bgRgb, alpha: 255 } },
    })
      .composite([{ input: iconBuffer, gravity: 'centre' }])
      .png()
      .toBuffer()
  }

  return results
}
