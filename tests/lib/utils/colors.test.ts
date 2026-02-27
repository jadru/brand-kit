import { describe, it, expect } from 'vitest'
import { hexToRgb, getRelativeLuminance, getContrastColor } from '@/lib/utils/colors'

describe('colors utils', () => {
  it('hexToRgb should parse 6-digit and 3-digit hex values', () => {
    expect(hexToRgb('#112233')).toEqual({ r: 17, g: 34, b: 51 })
    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204 })
  })

  it('getRelativeLuminance should return expected extremes', () => {
    expect(getRelativeLuminance('#000000')).toBe(0)
    expect(getRelativeLuminance('#FFFFFF')).toBe(1)
  })

  it('getContrastColor should choose the higher-contrast foreground', () => {
    expect(getContrastColor('#000000')).toBe('#FFFFFF')
    expect(getContrastColor('#FFFF00')).toBe('#000000')
    expect(getContrastColor('#808080')).toBe('#000000')
  })
})
