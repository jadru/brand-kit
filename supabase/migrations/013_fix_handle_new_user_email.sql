-- Fix auth signup trigger to use auth.users.email instead of metadata.
-- Some signup flows do not populate raw_user_meta_data.email, which caused
-- public.users.email NOT NULL violations and broke signup/admin user creation.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.email, ''),
      NULLIF(NEW.raw_user_meta_data ->> 'email', '')
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;
