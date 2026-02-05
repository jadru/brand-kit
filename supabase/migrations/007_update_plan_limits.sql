-- Update check_brand_profile_limit: Free plan now allows 2 brand profiles (was 1)
-- This improves the core value experience for free users

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
    max_profiles := 2;  -- Changed from 1 to 2
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
