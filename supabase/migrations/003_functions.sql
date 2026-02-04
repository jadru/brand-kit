-- handle_new_user: auto-create public.users on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'email');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- check_brand_profile_limit: enforce plan-based profile limits
CREATE OR REPLACE FUNCTION public.check_brand_profile_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_count INTEGER;
  user_plan public.plan_type;
  max_profiles INTEGER;
BEGIN
  SELECT plan INTO user_plan
  FROM public.users
  WHERE id = NEW.user_id;

  IF user_plan = 'free' THEN
    max_profiles := 1;
  ELSE
    max_profiles := 5;
  END IF;

  SELECT COUNT(*) INTO current_count
  FROM public.brand_profiles
  WHERE user_id = NEW.user_id;

  IF current_count >= max_profiles THEN
    RAISE EXCEPTION 'Brand profile limit reached. Current plan (%) allows up to % profiles.',
      user_plan, max_profiles;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER before_brand_profile_insert
  BEFORE INSERT ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_brand_profile_limit();

-- reset_monthly_usage: lazy reset pattern
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.users
  SET
    projects_used_this_month = 0,
    ai_headlines_used_this_month = 0,
    ai_icons_used_this_month = 0,
    usage_reset_at = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE
    usage_reset_at <= NOW()
    AND auth.uid() = id;
END;
$$;
