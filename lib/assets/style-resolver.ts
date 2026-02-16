import { isLightColor, darkenHex, lightenHex, hexToRgba, getContrastColor } from '@/lib/utils/colors'
import type { StylePreset, BrandProfile, Project } from '@/types/database'

// ========================================
// Resolved Types
// ========================================

export type OgLayout = 'centered' | 'left-aligned' | 'centered-large-text' | 'grid-balanced'

export interface ResolvedOgStyles {
  layout: OgLayout
  background: string  // CSS background value (color or linear-gradient)
  isDark: boolean
  textColor: string
  secondaryTextColor: string
  fontFamily: string
  fontWeight: number
  accentColor: string | null  // decorative accent element color
  glassOverlay: boolean       // glassmorphism simulation
  hardShadow: boolean         // duolingo-style hard shadow on text container
}

export interface ResolvedIconStyles {
  cornerRadius: number
  shadow: {
    svgFilter: string | null       // SVG <filter> element string
    svgFilterId: string | null     // filter id for referencing
  }
  background: {
    type: 'solid' | 'gradient' | 'dark'
    fill: string         // SVG fill value (color or 'url(#bg-gradient)')
    defs: string | null  // SVG <defs> for gradients
  }
  textColor: string
}

export interface ResolvedSplashStyles {
  background: {
    type: 'solid' | 'gradient'
    color1: string
    color2: string | null
  }
}

// ========================================
// OG Styles Resolver
// ========================================

export function resolveOgStyles(
  preset: StylePreset,
  brandProfile: BrandProfile | null,
  project: Project,
): ResolvedOgStyles {
  const primaryColor = project.primary_color_override || brandProfile?.primary_color || '#6366F1'
  const secondaryColor = brandProfile?.secondary_colors?.[0] || lightenHex(primaryColor, 20)

  // Slug-based dispatch for known presets
  switch (preset.slug) {
    case 'notion-minimal':
      return {
        layout: 'left-aligned',
        background: '#FFFFFF',
        isDark: false,
        textColor: '#1A1A1A',
        secondaryTextColor: '#6B7280',
        fontFamily: 'Inter',
        fontWeight: 500,
        accentColor: primaryColor,
        glassOverlay: false,
        hardShadow: false,
      }

    case 'airbnb-3d':
      return {
        layout: 'centered',
        background: `linear-gradient(135deg, ${lightenHex(primaryColor, 30)} 0%, ${lightenHex(primaryColor, 15)} 100%)`,
        isDark: false,
        textColor: darkenHex(primaryColor, 35),
        secondaryTextColor: darkenHex(primaryColor, 20),
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 700,
        accentColor: primaryColor,
        glassOverlay: false,
        hardShadow: false,
      }

    case 'stripe-gradient':
      return {
        layout: 'centered',
        background: `linear-gradient(135deg, #0A0A1A 0%, ${darkenHex(primaryColor, 30)} 50%, #0A0A1A 100%)`,
        isDark: true,
        textColor: '#FFFFFF',
        secondaryTextColor: 'rgba(255,255,255,0.7)',
        fontFamily: 'Inter',
        fontWeight: 600,
        accentColor: primaryColor,
        glassOverlay: false,
        hardShadow: false,
      }

    case 'linear-dark':
      return {
        layout: 'left-aligned',
        background: `linear-gradient(160deg, #0A0A0A 0%, #141420 100%)`,
        isDark: true,
        textColor: '#FFFFFF',
        secondaryTextColor: 'rgba(255,255,255,0.5)',
        fontFamily: 'Inter',
        fontWeight: 500,
        accentColor: primaryColor,
        glassOverlay: false,
        hardShadow: false,
      }

    case 'vercel-sharp': {
      const useDark = !isLightColor(primaryColor)
      return {
        layout: 'centered-large-text',
        background: useDark ? '#000000' : '#FFFFFF',
        isDark: useDark,
        textColor: useDark ? '#FFFFFF' : '#000000',
        secondaryTextColor: useDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        fontFamily: 'Geist',
        fontWeight: 700,
        accentColor: null,
        glassOverlay: false,
        hardShadow: false,
      }
    }

    case 'glassmorphism':
      return {
        layout: 'centered',
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        isDark: !isLightColor(primaryColor),
        textColor: '#FFFFFF',
        secondaryTextColor: 'rgba(255,255,255,0.8)',
        fontFamily: 'Inter',
        fontWeight: 600,
        accentColor: null,
        glassOverlay: true,
        hardShadow: false,
      }

    case 'duolingo-playful':
      return {
        layout: 'centered',
        background: primaryColor,
        isDark: !isLightColor(primaryColor),
        textColor: getContrastColor(primaryColor),
        secondaryTextColor: hexToRgba(getContrastColor(primaryColor), 0.8),
        fontFamily: 'Nunito',
        fontWeight: 800,
        accentColor: null,
        glassOverlay: false,
        hardShadow: true,
      }

    case 'figma-clean':
      return {
        layout: 'grid-balanced',
        background: '#F5F5F5',
        isDark: false,
        textColor: '#1A1A1A',
        secondaryTextColor: '#6B7280',
        fontFamily: 'Inter',
        fontWeight: 400,
        accentColor: primaryColor,
        glassOverlay: false,
        hardShadow: false,
      }

    default:
      return resolveOgStylesByKeyword(preset, primaryColor, secondaryColor)
  }
}

function resolveOgStylesByKeyword(
  preset: StylePreset,
  primaryColor: string,
  secondaryColor: string,
): ResolvedOgStyles {
  const bg = preset.og_background?.toLowerCase() || ''
  const layout = preset.og_layout?.toLowerCase() || ''

  const isDark = bg.includes('dark') || bg.includes('black') || bg.includes('#0a')
  const resolvedLayout: OgLayout =
    layout.includes('left') ? 'left-aligned' :
    layout.includes('large text') ? 'centered-large-text' :
    layout.includes('grid') || layout.includes('balanced') ? 'grid-balanced' :
    'centered'

  let background: string
  if (isDark) {
    background = `linear-gradient(135deg, #0A0A0A 0%, ${darkenHex(primaryColor, 30)} 100%)`
  } else if (bg.includes('gradient')) {
    background = `linear-gradient(135deg, ${lightenHex(primaryColor, 25)} 0%, ${secondaryColor} 100%)`
  } else if (bg.includes('gray') || bg.includes('#f5f5f5')) {
    background = '#F5F5F5'
  } else if (bg.includes('white') || bg.includes('#ffffff')) {
    background = '#FFFFFF'
  } else {
    background = primaryColor
  }

  const { fontFamily, fontWeight } = parseTypography(preset.og_typography)

  return {
    layout: resolvedLayout,
    background,
    isDark,
    textColor: isDark ? '#FFFFFF' : '#1A1A1A',
    secondaryTextColor: isDark ? 'rgba(255,255,255,0.6)' : '#6B7280',
    fontFamily,
    fontWeight,
    accentColor: primaryColor,
    glassOverlay: bg.includes('blur') || bg.includes('glass'),
    hardShadow: false,
  }
}

function parseTypography(ogTypography: string | null): { fontFamily: string; fontWeight: number } {
  if (!ogTypography) return { fontFamily: 'Inter', fontWeight: 700 }

  const parts = ogTypography.split(',').map(s => s.trim())
  const fontFamily = parts[0] || 'Inter'
  const weightStr = (parts[1] || 'Bold').toLowerCase()

  const weightMap: Record<string, number> = {
    'regular': 400, 'medium': 500, 'semibold': 600, 'semi bold': 600,
    'bold': 700, 'extra bold': 800, 'extrabold': 800,
  }

  return { fontFamily, fontWeight: weightMap[weightStr] || 700 }
}

// ========================================
// Icon Styles Resolver
// ========================================

export function resolveIconStyles(
  preset: StylePreset,
  brandProfile: BrandProfile | null,
  project: Project,
): ResolvedIconStyles {
  const primaryColor = project.primary_color_override || brandProfile?.primary_color || '#6366F1'
  const secondaryColor = brandProfile?.secondary_colors?.[0] || lightenHex(primaryColor, 15)

  const shadow = resolveShadow(preset.shadow_style, primaryColor)
  const background = resolveIconBackground(preset.color_mode, primaryColor, secondaryColor)
  const textColor = background.type === 'dark' ? primaryColor : getContrastColor(primaryColor)

  return {
    cornerRadius: preset.corner_radius,
    shadow,
    background,
    textColor,
  }
}

function resolveShadow(
  shadowStyle: string | null,
  primaryColor: string,
): ResolvedIconStyles['shadow'] {
  if (!shadowStyle || shadowStyle === 'None') {
    return { svgFilter: null, svgFilterId: null }
  }

  const id = 'icon-shadow'
  const s = shadowStyle.toLowerCase()

  let filter: string
  if (s.includes('soft drop') || s.includes('soft shadow')) {
    filter = `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.15)" flood-opacity="1"/></filter>`
  } else if (s.includes('colored glow') || s.includes('neon')) {
    filter = `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="${primaryColor}" flood-opacity="0.4"/></filter>`
  } else if (s.includes('hard')) {
    filter = `<filter id="${id}" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="3" dy="3" stdDeviation="0" flood-color="rgba(0,0,0,0.25)" flood-opacity="1"/></filter>`
  } else if (s.includes('glass') || s.includes('blur')) {
    filter = `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)" flood-opacity="1"/></filter>`
  } else if (s.includes('minimal') || s.includes('subtle elevation')) {
    filter = `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.08)" flood-opacity="1"/></filter>`
  } else {
    return { svgFilter: null, svgFilterId: null }
  }

  return { svgFilter: filter, svgFilterId: id }
}

function resolveIconBackground(
  colorMode: string | null,
  primaryColor: string,
  secondaryColor: string,
): ResolvedIconStyles['background'] {
  if (!colorMode) {
    return { type: 'solid', fill: primaryColor, defs: null }
  }

  const cm = colorMode.toLowerCase()

  if (cm.includes('dark') || cm.includes('accent')) {
    return { type: 'dark', fill: '#0A0A0A', defs: null }
  }

  if (cm.includes('gradient') || cm.includes('translucent')) {
    const gradientId = 'bg-gradient'
    const defs = `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${primaryColor}"/><stop offset="100%" stop-color="${secondaryColor}"/></linearGradient>`
    return { type: 'gradient', fill: `url(#${gradientId})`, defs }
  }

  if (cm.includes('pure monochrome')) {
    const color = isLightColor(primaryColor) ? '#FFFFFF' : '#000000'
    return { type: 'solid', fill: color, defs: null }
  }

  // 'Monochrome', 'Bright solid', 'Clean with accent', default
  return { type: 'solid', fill: primaryColor, defs: null }
}

// ========================================
// Splash Styles Resolver
// ========================================

export function resolveSplashStyles(
  preset: StylePreset,
  brandProfile: BrandProfile | null,
  project: Project,
): ResolvedSplashStyles {
  const primaryColor = project.primary_color_override || brandProfile?.primary_color || '#FFFFFF'
  const bg = preset.og_background?.toLowerCase() || ''

  if (bg.includes('dark') || bg.includes('black') || bg.includes('#0a')) {
    return {
      background: { type: 'gradient', color1: '#0A0A0A', color2: darkenHex(primaryColor, 30) },
    }
  }

  if (bg.includes('gradient') || bg.includes('blur')) {
    const secondaryColor = brandProfile?.secondary_colors?.[0] || lightenHex(primaryColor, 20)
    return {
      background: { type: 'gradient', color1: primaryColor, color2: secondaryColor },
    }
  }

  if (bg.includes('bright') || bg.includes('solid color')) {
    return {
      background: { type: 'solid', color1: primaryColor, color2: null },
    }
  }

  if (bg.includes('gray') || bg.includes('#f5f5f5')) {
    return {
      background: { type: 'solid', color1: '#F5F5F5', color2: null },
    }
  }

  // white or default
  return {
    background: { type: 'solid', color1: '#FFFFFF', color2: null },
  }
}
