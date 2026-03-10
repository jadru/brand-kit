export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brand_profiles: {
        Row: {
          color_mode: Database["public"]["Enums"]["color_mode"]
          corner_style: Database["public"]["Enums"]["corner_style"]
          created_at: string
          icon_style: Database["public"]["Enums"]["icon_style"]
          id: string
          is_default: boolean
          keywords: string[]
          name: string
          primary_color: string
          secondary_colors: string[]
          style_direction: Database["public"]["Enums"]["style_direction"]
          typography_mood: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color_mode?: Database["public"]["Enums"]["color_mode"]
          corner_style?: Database["public"]["Enums"]["corner_style"]
          created_at?: string
          icon_style?: Database["public"]["Enums"]["icon_style"]
          id?: string
          is_default?: boolean
          keywords?: string[]
          name: string
          primary_color?: string
          secondary_colors?: string[]
          style_direction?: Database["public"]["Enums"]["style_direction"]
          typography_mood?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color_mode?: Database["public"]["Enums"]["color_mode"]
          corner_style?: Database["public"]["Enums"]["corner_style"]
          created_at?: string
          icon_style?: Database["public"]["Enums"]["icon_style"]
          id?: string
          is_default?: boolean
          keywords?: string[]
          name?: string
          primary_color?: string
          secondary_colors?: string[]
          style_direction?: Database["public"]["Enums"]["style_direction"]
          typography_mood?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string | null
          id: string
          message: string
          page_url: string | null
          sentiment: Database["public"]["Enums"]["feedback_sentiment"]
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          page_url?: string | null
          sentiment: Database["public"]["Enums"]["feedback_sentiment"]
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          page_url?: string | null
          sentiment?: Database["public"]["Enums"]["feedback_sentiment"]
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      nps_responses: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          ai_headline: string | null
          ai_og_description: string | null
          ai_short_slogan: string | null
          ai_tagline: string | null
          assets_zip_url: string | null
          brand_profile_id: string | null
          created_at: string
          description: string | null
          icon_type: Database["public"]["Enums"]["icon_type"] | null
          icon_value: string | null
          id: string
          mobile_target: Database["public"]["Enums"]["mobile_target"] | null
          name: string
          pipeline_stage: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          primary_color_override: string | null
          status: Database["public"]["Enums"]["project_status"]
          style_preset_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_headline?: string | null
          ai_og_description?: string | null
          ai_short_slogan?: string | null
          ai_tagline?: string | null
          assets_zip_url?: string | null
          brand_profile_id?: string | null
          created_at?: string
          description?: string | null
          icon_type?: Database["public"]["Enums"]["icon_type"] | null
          icon_value?: string | null
          id?: string
          mobile_target?: Database["public"]["Enums"]["mobile_target"] | null
          name: string
          pipeline_stage?: string | null
          platform?: Database["public"]["Enums"]["platform_type"]
          primary_color_override?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          style_preset_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_headline?: string | null
          ai_og_description?: string | null
          ai_short_slogan?: string | null
          ai_tagline?: string | null
          assets_zip_url?: string | null
          brand_profile_id?: string | null
          created_at?: string
          description?: string | null
          icon_type?: Database["public"]["Enums"]["icon_type"] | null
          icon_value?: string | null
          id?: string
          mobile_target?: Database["public"]["Enums"]["mobile_target"] | null
          name?: string
          pipeline_stage?: string | null
          platform?: Database["public"]["Enums"]["platform_type"]
          primary_color_override?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          style_preset_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_brand_profile_id_fkey"
            columns: ["brand_profile_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_style_preset_id_fkey"
            columns: ["style_preset_id"]
            isOneToOne: false
            referencedRelation: "style_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      style_presets: {
        Row: {
          ai_style_modifier: string | null
          best_for_styles: string[]
          color_mode: string | null
          corner_radius: number
          created_at: string
          icon_ai_negative_prompt: string | null
          icon_ai_prompt_template: string | null
          icon_style: string | null
          id: string
          is_free: boolean
          name: string
          og_ai_style_modifier: string | null
          og_background: string | null
          og_layout: string | null
          og_typography: string | null
          preview_image_url: string | null
          shadow_style: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          ai_style_modifier?: string | null
          best_for_styles?: string[]
          color_mode?: string | null
          corner_radius?: number
          created_at?: string
          icon_ai_negative_prompt?: string | null
          icon_ai_prompt_template?: string | null
          icon_style?: string | null
          id?: string
          is_free?: boolean
          name: string
          og_ai_style_modifier?: string | null
          og_background?: string | null
          og_layout?: string | null
          og_typography?: string | null
          preview_image_url?: string | null
          shadow_style?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          ai_style_modifier?: string | null
          best_for_styles?: string[]
          color_mode?: string | null
          corner_radius?: number
          created_at?: string
          icon_ai_negative_prompt?: string | null
          icon_ai_prompt_template?: string | null
          icon_style?: string | null
          id?: string
          is_free?: boolean
          name?: string
          og_ai_style_modifier?: string | null
          og_background?: string | null
          og_layout?: string | null
          og_typography?: string | null
          preview_image_url?: string | null
          shadow_style?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          ai_headlines_used_this_month: number
          ai_icons_used_this_month: number
          created_at: string
          email: string
          id: string
          lemonsqueezy_customer_id: string | null
          lemonsqueezy_subscription_id: string | null
          plan: Database["public"]["Enums"]["plan_type"]
          projects_used_this_month: number
          updated_at: string
          usage_reset_at: string
        }
        Insert: {
          ai_headlines_used_this_month?: number
          ai_icons_used_this_month?: number
          created_at?: string
          email: string
          id: string
          lemonsqueezy_customer_id?: string | null
          lemonsqueezy_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          projects_used_this_month?: number
          updated_at?: string
          usage_reset_at?: string
        }
        Update: {
          ai_headlines_used_this_month?: number
          ai_icons_used_this_month?: number
          created_at?: string
          email?: string
          id?: string
          lemonsqueezy_customer_id?: string | null
          lemonsqueezy_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          projects_used_this_month?: number
          updated_at?: string
          usage_reset_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unread_notification_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      increment_usage: {
        Args: { p_field_name: string; p_user_id: string }
        Returns: undefined
      }
      mark_all_notifications_read: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      reset_monthly_usage: { Args: never; Returns: undefined }
    }
    Enums: {
      color_mode: "mono" | "duotone" | "gradient" | "vibrant"
      corner_style: "sharp" | "rounded" | "pill"
      feedback_sentiment: "positive" | "neutral" | "negative"
      icon_style: "outline" | "filled" | "3d_soft" | "flat"
      icon_type: "text" | "symbol" | "ai_generated"
      mobile_target: "android" | "ios" | "both"
      notification_type:
        | "project_complete"
        | "subscription_update"
        | "system_announcement"
        | "usage_warning"
      plan_type: "free" | "pro"
      platform_type: "web" | "mobile" | "all"
      project_status: "draft" | "generating" | "completed" | "failed"
      style_direction: "minimal" | "playful" | "corporate" | "tech" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      color_mode: ["mono", "duotone", "gradient", "vibrant"],
      corner_style: ["sharp", "rounded", "pill"],
      feedback_sentiment: ["positive", "neutral", "negative"],
      icon_style: ["outline", "filled", "3d_soft", "flat"],
      icon_type: ["text", "symbol", "ai_generated"],
      mobile_target: ["android", "ios", "both"],
      notification_type: [
        "project_complete",
        "subscription_update",
        "system_announcement",
        "usage_warning",
      ],
      plan_type: ["free", "pro"],
      platform_type: ["web", "mobile", "all"],
      project_status: ["draft", "generating", "completed", "failed"],
      style_direction: ["minimal", "playful", "corporate", "tech", "custom"],
    },
  },
} as const
