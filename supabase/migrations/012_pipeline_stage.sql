-- Add pipeline_stage column for tracking real-time generation progress
ALTER TABLE public.projects
  ADD COLUMN pipeline_stage TEXT;

COMMENT ON COLUMN public.projects.pipeline_stage IS 'Current pipeline stage during asset generation (icon_resolve, favicons, og, app_icons, splash, zip, upload). NULL when not generating.';
