/**
 * PWA Icon Generator
 * Generates PNG icons from SVG source for PWA manifest
 *
 * Usage: node scripts/generate-icons.mjs
 */

import sharp from 'sharp'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const ICON_SIZES = [192, 512]
const SVG_SOURCE = join(ROOT, 'public/icons/icon.svg')
const OUTPUT_DIR = join(ROOT, 'public/icons')

async function generateIcons() {
  console.warn('🎨 Generating PWA icons...')

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const svgBuffer = readFileSync(SVG_SOURCE)

  for (const size of ICON_SIZES) {
    const outputPath = join(OUTPUT_DIR, `icon-${size}.png`)

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath)

    console.warn(`  ✅ Generated: icon-${size}.png`)
  }

  console.warn('🎉 All icons generated successfully!')
}

generateIcons().catch((err) => {
  console.error('❌ Error generating icons:', err)
  process.exit(1)
})
