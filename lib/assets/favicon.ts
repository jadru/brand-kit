import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { FAVICON_SIZES, PWA_ICON_SIZES } from './constants'
import {
  renderIconToBuffer,
  generateTextSVG,
  validateImage,
  type IconSource,
} from '@/lib/utils/image'
import { getContrastColor } from '@/lib/utils/colors'
import { resolveIconStyles } from './style-resolver'
import type { Project, StylePreset, BrandProfile } from '@/types/database'

interface FaviconInput {
  iconSource: IconSource
  project: Project
  brandProfile: BrandProfile | null
  stylePreset: StylePreset
}

export async function generateFavicons(input: FaviconInput) {
  const { iconSource, project, brandProfile, stylePreset } = input
  const results: Record<string, Buffer> = {}
  const color = project.primary_color_override || brandProfile?.primary_color || '#000000'
  const resolved = resolveIconStyles(stylePreset, brandProfile, project)
  const iconPngOptions = { compressionLevel: 9, palette: true, quality: 100 } as const

  if (iconSource.type === 'text') {
    const svgString = generateTextSVG(
      iconSource.value!,
      color,
      getContrastColor(color),
      stylePreset.corner_radius,
      resolved,
    )
    results['favicon.svg'] = Buffer.from(svgString)
  } else if (iconSource.type === 'svg') {
    results['favicon.svg'] = iconSource.buffer!
  }

  const baseImage = await renderIconToBuffer(iconSource, 1024, project, stylePreset, brandProfile)

  for (const size of FAVICON_SIZES.png) {
    const resized = await sharp(baseImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png(iconPngOptions)
      .toBuffer()

    if (size === 180) {
      results['apple-touch-icon.png'] = resized
      await validateImage(resized, 180, 180, 'apple-touch-icon.png')
    } else {
      results[`favicon-${size}x${size}.png`] = resized
    }
  }

  for (const size of PWA_ICON_SIZES) {
    const pwaIcon = await sharp(baseImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png(iconPngOptions)
      .toBuffer()

    results[`icon-${size}.png`] = pwaIcon
    await validateImage(pwaIcon, size, size, `icon-${size}.png`)
  }

  const icoBuffers = await Promise.all(
    FAVICON_SIZES.ico.map((size) =>
      sharp(baseImage)
        .resize(size, size)
        .png(iconPngOptions)
        .toBuffer()
    )
  )
  results['favicon.ico'] = await pngToIco(icoBuffers)

  return results
}
