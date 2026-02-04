-- Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE plan_type AS ENUM ('free', 'pro');
CREATE TYPE style_direction AS ENUM ('minimal', 'playful', 'corporate', 'tech', 'custom');
CREATE TYPE color_mode AS ENUM ('mono', 'duotone', 'gradient', 'vibrant');
CREATE TYPE icon_style AS ENUM ('outline', 'filled', '3d_soft', 'flat');
CREATE TYPE corner_style AS ENUM ('sharp', 'rounded', 'pill');
CREATE TYPE platform_type AS ENUM ('web', 'mobile', 'all');
CREATE TYPE mobile_target AS ENUM ('android', 'ios', 'both');
CREATE TYPE icon_type AS ENUM ('text', 'symbol', 'ai_generated');
CREATE TYPE project_status AS ENUM ('draft', 'generating', 'completed', 'failed');

-- users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan plan_type NOT NULL DEFAULT 'free',
  lemonsqueezy_customer_id TEXT,
  lemonsqueezy_subscription_id TEXT,
  projects_used_this_month INTEGER NOT NULL DEFAULT 0,
  ai_headlines_used_this_month INTEGER NOT NULL DEFAULT 0,
  ai_icons_used_this_month INTEGER NOT NULL DEFAULT 0,
  usage_reset_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- brand_profiles
CREATE TABLE public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style_direction style_direction NOT NULL DEFAULT 'minimal',
  primary_color TEXT NOT NULL DEFAULT '#000000',
  secondary_colors TEXT[] NOT NULL DEFAULT '{}',
  color_mode color_mode NOT NULL DEFAULT 'mono',
  icon_style icon_style NOT NULL DEFAULT 'outline',
  corner_style corner_style NOT NULL DEFAULT 'rounded',
  typography_mood TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- style_presets
CREATE TABLE public.style_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_free BOOLEAN NOT NULL DEFAULT false,
  best_for_styles TEXT[] NOT NULL DEFAULT '{}',
  icon_style TEXT,
  corner_radius INTEGER NOT NULL DEFAULT 8,
  shadow_style TEXT,
  color_mode TEXT,
  og_layout TEXT,
  og_typography TEXT,
  og_background TEXT,
  ai_style_modifier TEXT,
  preview_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  style_preset_id UUID NOT NULL REFERENCES public.style_presets(id),
  name TEXT NOT NULL,
  description TEXT,
  platform platform_type NOT NULL DEFAULT 'web',
  mobile_target mobile_target,
  primary_color_override TEXT,
  icon_type icon_type,
  icon_value TEXT,
  ai_headline TEXT,
  ai_tagline TEXT,
  ai_og_description TEXT,
  ai_short_slogan TEXT,
  assets_zip_url TEXT,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_brand_profile_id ON public.projects(brand_profile_id);
CREATE INDEX idx_style_presets_is_free ON public.style_presets(is_free);
CREATE INDEX idx_style_presets_slug ON public.style_presets(slug);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
