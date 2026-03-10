import type {
  Database as SupabaseDatabase,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  Json,
} from './supabase-generated'

export type Database = SupabaseDatabase
export type GeneratedDatabase = SupabaseDatabase
export type { Json }

export type Plan = Enums<'plan_type'>
export type StyleDirection = Enums<'style_direction'>
export type ColorMode = Enums<'color_mode'>
export type IconStyle = Enums<'icon_style'>
export type CornerStyle = Enums<'corner_style'>
export type Platform = Enums<'platform_type'>
export type MobileTarget = Enums<'mobile_target'>
export type IconType = Enums<'icon_type'>
export type ProjectStatus = Enums<'project_status'>

// pipeline_stage is stored as TEXT in Postgres, but the app narrows it to known values.
export type PipelineStage =
  | 'icon_resolve'
  | 'favicons'
  | 'og'
  | 'app_icons'
  | 'splash'
  | 'zip'
  | 'upload'

export type NotificationType = Enums<'notification_type'>
export type FeedbackSentiment = Enums<'feedback_sentiment'>

export type User = Tables<'users'>
export type BrandProfile = Tables<'brand_profiles'>
export type StylePreset = Tables<'style_presets'>
export type Notification = Tables<'notifications'>
export type Feedback = Tables<'feedback'>
export type NpsResponse = Tables<'nps_responses'>

type ProjectOverrides = {
  icon_type: IconType | null
  mobile_target: MobileTarget | null
  pipeline_stage: PipelineStage | null
  platform: Platform
  status: ProjectStatus
}

type ProjectInsertOverrides = {
  icon_type?: IconType | null
  mobile_target?: MobileTarget | null
  pipeline_stage?: PipelineStage | null
  platform?: Platform
  status?: ProjectStatus
}

type ProjectUpdateOverrides = {
  icon_type?: IconType | null
  mobile_target?: MobileTarget | null
  pipeline_stage?: PipelineStage | null
  platform?: Platform
  status?: ProjectStatus
}

export type Project = Omit<Tables<'projects'>, keyof ProjectOverrides> & ProjectOverrides
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>
export type BrandProfileInsert = TablesInsert<'brand_profiles'>
export type BrandProfileUpdate = TablesUpdate<'brand_profiles'>
export type StylePresetInsert = TablesInsert<'style_presets'>
export type StylePresetUpdate = TablesUpdate<'style_presets'>
export type NotificationInsert = TablesInsert<'notifications'>
export type NotificationUpdate = TablesUpdate<'notifications'>
export type FeedbackInsert = TablesInsert<'feedback'>
export type FeedbackUpdate = TablesUpdate<'feedback'>
export type NpsResponseInsert = TablesInsert<'nps_responses'>
export type NpsResponseUpdate = TablesUpdate<'nps_responses'>
export type ProjectInsert = Omit<TablesInsert<'projects'>, keyof ProjectInsertOverrides> & ProjectInsertOverrides
export type ProjectUpdate = Omit<TablesUpdate<'projects'>, keyof ProjectUpdateOverrides> & ProjectUpdateOverrides

export const PLAN_LIMITS = {
  free: {
    brand_profiles: 2,
    projects_per_month: 3,
    ai_headlines_per_month: 10,
    ai_icons_per_month: 3,
    style_presets: 'free_only' as const,
  },
  pro: {
    brand_profiles: 5,
    projects_per_month: Infinity,
    ai_headlines_per_month: Infinity,
    ai_icons_per_month: 50,
    style_presets: 'all' as const,
  },
} as const
