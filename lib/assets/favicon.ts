import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { FAVICON_SIZES } from './constants'
import { renderIconToBuffer, generateTextSVG, type IconSource } from '@/lib/utils/image'
import { getContrastColor } from '@/lib/utils/colors'
import type { Project, StylePreset } from '@/types/database'

interface FaviconInput {
  iconSource: IconSource
  project: Project
  stylePreset: StylePreset
}

export async function generateFavicons(input: FaviconInput) {
  const { iconSource, project, stylePreset } = input
  const results: Record<string, Buffer> = {}
  const color = project.primary_color_override || '#000000'

  // SVG Favicon
  if (iconSource.type === 'text') {
    const svgString = generateTextSVG(
      iconSource.value!,
      color,
      getContrastColor(color),
      stylePreset.corner_radius
    )
    results['favicon.svg'] = Buffer.from(svgString)
  } else if (iconSource.type === 'svg') {
    results['favicon.svg'] = iconSource.buffer!
  }

  // PNG Favicons
  const baseImage = await renderIconToBuffer(iconSource, 512, project, stylePreset)

  for (const size of FAVICON_SIZES.png) {
    const resized = await sharp(baseImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    if (size === 180) {
      results['apple-touch-icon.png'] = resized
    } else {
      results[`favicon-${size}x${size}.png`] = resized
    }
  }

  // ICO Favicon (multi-resolution)
  const icoBuffers = await Promise.all(
    FAVICON_SIZES.ico.map((size) =>
      sharp(baseImage).resize(size, size).png().toBuffer()
    )
  )
  results['favicon.ico'] = await pngToIco(icoBuffers)

  return results
}
