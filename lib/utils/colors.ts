export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  const normalized = cleaned.length === 3
    ? cleaned.split('').map((char) => `${char}${char}`).join('')
    : cleaned

  return {
    r: parseInt(normalized.substring(0, 2), 16),
    g: parseInt(normalized.substring(2, 4), 16),
    b: parseInt(normalized.substring(4, 6), 16),
  }
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  )

  return (0.2126 * rs) + (0.7152 * gs) + (0.0722 * bs)
}

export function isLightColor(hex: string): boolean {
  return getRelativeLuminance(hex) > 0.5
}

export function getContrastColor(hex: string): string {
  const bgLuminance = getRelativeLuminance(hex)
  const whiteContrast = 1.05 / (bgLuminance + 0.05)
  const blackContrast = (bgLuminance + 0.05) / 0.05

  return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000'
}
