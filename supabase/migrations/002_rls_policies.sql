-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_presets ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- brand_profiles
CREATE POLICY "brand_profiles_select_own"
  ON public.brand_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "brand_profiles_insert_own"
  ON public.brand_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "brand_profiles_update_own"
  ON public.brand_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "brand_profiles_delete_own"
  ON public.brand_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- projects
CREATE POLICY "projects_select_own"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- style_presets (read-only for all authenticated users)
CREATE POLICY "style_presets_select_all"
  ON public.style_presets FOR SELECT
  USING (true);
