import type { Platform, MobileTarget, IconType } from './database'
import type { MetadataPromptConfig } from '@/lib/prompts'

export interface WizardBrandData {
  brandProfileId: string | null
  skipBrandProfile: boolean
}

export interface WizardPlatformData {
  platform: Platform
  mobileTarget: MobileTarget | null
}

export interface WizardProjectData {
  name: string
  description: string
  aiHeadline: string | null
  aiTagline: string | null
  aiOgDescription: string | null
  aiShortSlogan: string | null
}

export interface WizardStyleData {
  stylePresetId: string | null
  primaryColorOverride: string | null
}

export interface WizardIconData {
  iconType: IconType | null
  iconValue: string | null
}

export interface HeadlineRequest {
  projectName: string
  description?: string
  platform: Platform
  brandKeywords?: string[]
  brandStyleDirection?: string
  promptConfig?: MetadataPromptConfig
}

export interface HeadlineResponse {
  headline: string
  tagline: string
  ogDescription: string
  shortSlogan: string
}
