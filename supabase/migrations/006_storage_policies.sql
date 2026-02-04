-- Create project-assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', false)
ON CONFLICT DO NOTHING;

-- Users can upload own assets
CREATE POLICY "Users can upload own assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can download own assets
CREATE POLICY "Users can download own assets"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update own assets
CREATE POLICY "Users can update own assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
