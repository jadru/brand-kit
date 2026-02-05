// ========================================
// Base Types
// ========================================

export interface PromptCategory<T extends string = string> {
  id: T
  label: string
  labelKo: string
  description: string
  promptFragment: string
  incompatibleWith?: string[]  // 다른 카테고리의 ID도 포함 가능
  requiresOne?: string[][]
  weight?: number
}

export interface ComposedPrompt {
  systemPrompt: string
  userPrompt: string
  fragments: string[]
  warnings?: string[]
}

// ========================================
// OG Image Types
// ========================================

export type OgLayoutStyle =
  | 'centered'
  | 'left-aligned'
  | 'split-vertical'
  | 'split-horizontal'
  | 'gradient-wave'
  | 'diagonal-split'
  | 'card-stack'
  | 'minimal-corner'

export type OgVisualElement =
  | 'none'
  | 'geometric-shapes'
  | 'abstract-pattern'
  | 'illustration'
  | 'photo-background'
  | 'icon-accent'
  | 'gradient-blob'
  | 'grid-pattern'
  | 'noise-texture'

export type OgTypographyStyle =
  | 'bold-modern'
  | 'elegant-serif'
  | 'technical-mono'
  | 'playful-rounded'
  | 'minimal-clean'
  | 'editorial'
  | 'handwritten-accent'

export type OgMoodTone =
  | 'professional'
  | 'creative'
  | 'minimal'
  | 'energetic'
  | 'luxurious'
  | 'friendly'
  | 'technical'
  | 'bold'

export interface OgPromptConfig {
  layout: OgLayoutStyle
  visual: OgVisualElement
  typography: OgTypographyStyle
  mood: OgMoodTone
  customAccent?: string
}

// ========================================
// Icon Types
// ========================================

export type IconVisualStyle =
  | 'outline-thin'
  | 'outline-medium'
  | 'outline-thick'
  | 'filled-solid'
  | 'filled-gradient'
  | 'duotone'
  | '3d-soft'
  | '3d-isometric'
  | 'glassmorphism'
  | 'neumorphism'
  | 'flat-minimal'
  | 'sketch-hand-drawn'

export type IconShape =
  | 'circle'
  | 'rounded-square'
  | 'squircle'
  | 'hexagon'
  | 'sharp-square'
  | 'organic-blob'
  | 'shield'
  | 'diamond'

export type IconIndustry =
  | 'saas'
  | 'fintech'
  | 'healthcare'
  | 'education'
  | 'e-commerce'
  | 'social-media'
  | 'gaming'
  | 'productivity'
  | 'creative-tools'
  | 'developer-tools'
  | 'ai-ml'
  | 'sustainability'
  | 'real-estate'
  | 'travel'
  | 'food-beverage'

export type IconEmotion =
  | 'trustworthy'
  | 'innovative'
  | 'friendly'
  | 'premium'
  | 'energetic'
  | 'calm'
  | 'playful'
  | 'serious'
  | 'bold'
  | 'sophisticated'
  | 'creative'

export type IconColorScheme =
  | 'monochrome'
  | 'duotone'
  | 'gradient-linear'
  | 'gradient-radial'
  | 'vibrant-multi'
  | 'pastel'
  | 'dark-mode'
  | 'brand-colors'

export interface IconPromptConfig {
  visualStyle: IconVisualStyle
  shape: IconShape
  industry?: IconIndustry
  emotion: IconEmotion
  colorScheme: IconColorScheme
  complexity?: 'simple' | 'moderate' | 'detailed'
}

// ========================================
// Metadata Types
// ========================================

export type MetadataTone =
  | 'formal'
  | 'casual'
  | 'technical'
  | 'creative'
  | 'inspirational'
  | 'urgent'
  | 'friendly'
  | 'authoritative'
  | 'professional'

export type MetadataAudience =
  | 'b2b-enterprise'
  | 'b2b-smb'
  | 'b2c-general'
  | 'b2c-premium'
  | 'developer'
  | 'designer'
  | 'startup'
  | 'student'

export type MetadataContentType =
  | 'product-landing'
  | 'saas-homepage'
  | 'blog-article'
  | 'portfolio'
  | 'documentation'
  | 'e-commerce'
  | 'app-store'
  | 'social-profile'

export type MetadataUrgency =
  | 'evergreen'
  | 'timely'
  | 'promotional'
  | 'announcement'

export interface MetadataPromptConfig {
  tone: MetadataTone
  audience: MetadataAudience
  contentType: MetadataContentType
  urgency?: MetadataUrgency
  focusKeywords?: string[]
  language?: 'ko' | 'en' | 'ja'
}

// ========================================
// Combined Configuration
// ========================================

export interface FullPromptConfig {
  og?: Partial<OgPromptConfig>
  icon?: Partial<IconPromptConfig>
  metadata?: Partial<MetadataPromptConfig>
}

export interface ProjectContext {
  projectName: string
  description?: string
  platform: string
  brandKeywords?: string[]
  brandColors?: {
    primary: string
    secondary?: string[]
  }
}

// ========================================
// Example Types
// ========================================

export interface PromptExample {
  id: string
  name: string
  nameKo: string
  description: string
  thumbnail?: string
  config: FullPromptConfig
  sourceInspiration?: string
}
