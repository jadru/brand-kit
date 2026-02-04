-- increment_usage: atomic increment for usage tracking fields
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_field_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_field_name = 'projects_used_this_month' THEN
    UPDATE public.users
    SET projects_used_this_month = projects_used_this_month + 1, updated_at = NOW()
    WHERE id = p_user_id;
  ELSIF p_field_name = 'ai_headlines_used_this_month' THEN
    UPDATE public.users
    SET ai_headlines_used_this_month = ai_headlines_used_this_month + 1, updated_at = NOW()
    WHERE id = p_user_id;
  ELSIF p_field_name = 'ai_icons_used_this_month' THEN
    UPDATE public.users
    SET ai_icons_used_this_month = ai_icons_used_this_month + 1, updated_at = NOW()
    WHERE id = p_user_id;
  ELSE
    RAISE EXCEPTION 'Invalid field name: %', p_field_name;
  END IF;
END;
$$;
