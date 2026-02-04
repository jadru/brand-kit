export type Plan = 'free' | 'pro'
export type StyleDirection = 'minimal' | 'playful' | 'corporate' | 'tech' | 'custom'
export type ColorMode = 'mono' | 'duotone' | 'gradient' | 'vibrant'
export type IconStyle = 'outline' | 'filled' | '3d_soft' | 'flat'
export type CornerStyle = 'sharp' | 'rounded' | 'pill'
export type Platform = 'web' | 'mobile' | 'all'
export type MobileTarget = 'android' | 'ios' | 'both'
export type IconType = 'text' | 'symbol' | 'ai_generated'
export type ProjectStatus = 'draft' | 'generating' | 'completed' | 'failed'

export interface User {
  id: string
  email: string
  plan: Plan
  lemonsqueezy_customer_id: string | null
  lemonsqueezy_subscription_id: string | null
  projects_used_this_month: number
  ai_headlines_used_this_month: number
  ai_icons_used_this_month: number
  usage_reset_at: string
  created_at: string
  updated_at: string
}

export interface BrandProfile {
  id: string
  user_id: string
  name: string
  style_direction: StyleDirection
  primary_color: string
  secondary_colors: string[]
  color_mode: ColorMode
  icon_style: IconStyle
  corner_style: CornerStyle
  typography_mood: string | null
  keywords: string[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface StylePreset {
  id: string
  name: string
  slug: string
  is_free: boolean
  best_for_styles: string[]
  icon_style: string | null
  corner_radius: number
  shadow_style: string | null
  color_mode: string | null
  og_layout: string | null
  og_typography: string | null
  og_background: string | null
  ai_style_modifier: string | null
  preview_image_url: string | null
  sort_order: number
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  brand_profile_id: string | null
  style_preset_id: string
  name: string
  description: string | null
  platform: Platform
  mobile_target: MobileTarget | null
  primary_color_override: string | null
  icon_type: IconType | null
  icon_value: string | null
  ai_headline: string | null
  ai_tagline: string | null
  ai_og_description: string | null
  ai_short_slogan: string | null
  assets_zip_url: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface UserInsert {
  id: string
  email: string
  plan?: Plan
}

export interface UserUpdate {
  email?: string
  plan?: Plan
  lemonsqueezy_customer_id?: string | null
  lemonsqueezy_subscription_id?: string | null
  projects_used_this_month?: number
  ai_headlines_used_this_month?: number
  ai_icons_used_this_month?: number
  usage_reset_at?: string
}

export interface BrandProfileInsert {
  user_id: string
  name: string
  style_direction?: StyleDirection
  primary_color?: string
  secondary_colors?: string[]
  color_mode?: ColorMode
  icon_style?: IconStyle
  corner_style?: CornerStyle
  typography_mood?: string | null
  keywords?: string[]
  is_default?: boolean
}

export interface BrandProfileUpdate {
  name?: string
  style_direction?: StyleDirection
  primary_color?: string
  secondary_colors?: string[]
  color_mode?: ColorMode
  icon_style?: IconStyle
  corner_style?: CornerStyle
  typography_mood?: string | null
  keywords?: string[]
  is_default?: boolean
}

export interface ProjectInsert {
  user_id: string
  style_preset_id: string
  name: string
  platform: Platform
  brand_profile_id?: string | null
  description?: string | null
  mobile_target?: MobileTarget | null
  primary_color_override?: string | null
  icon_type?: IconType | null
  icon_value?: string | null
  ai_headline?: string | null
  ai_tagline?: string | null
  ai_og_description?: string | null
  ai_short_slogan?: string | null
  assets_zip_url?: string | null
  status?: ProjectStatus
}

export interface ProjectUpdate {
  brand_profile_id?: string | null
  style_preset_id?: string
  name?: string
  description?: string | null
  platform?: Platform
  mobile_target?: MobileTarget | null
  primary_color_override?: string | null
  icon_type?: IconType | null
  icon_value?: string | null
  ai_headline?: string | null
  ai_tagline?: string | null
  ai_og_description?: string | null
  ai_short_slogan?: string | null
  assets_zip_url?: string | null
  status?: ProjectStatus
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      brand_profiles: {
        Row: BrandProfile
        Insert: BrandProfileInsert
        Update: BrandProfileUpdate
      }
      style_presets: {
        Row: StylePreset
        Insert: never
        Update: never
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_monthly_usage: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export const PLAN_LIMITS = {
  free: {
    brand_profiles: 1,
    projects_per_month: 3,
    ai_headlines_per_month: 10,
    ai_icons_per_month: 5,
    style_presets: 'free_only' as const,
  },
  pro: {
    brand_profiles: 5,
    projects_per_month: Infinity,
    ai_headlines_per_month: Infinity,
    ai_icons_per_month: Infinity,
    style_presets: 'all' as const,
  },
} as const
