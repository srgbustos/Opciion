/*
  # Setup Storage Buckets for Images

  Creates storage buckets for:
  - User avatars
  - Event images
  - Module images

  All buckets are public for read access
  Only authenticated users can upload
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('event-images', 'event-images', true),
  ('module-images', 'module-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- AVATAR BUCKET POLICIES
-- ============================================
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- EVENT IMAGES BUCKET POLICIES
-- ============================================
DROP POLICY IF EXISTS "Event images are publicly accessible" ON storage.objects;
CREATE POLICY "Event images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'event-images');

DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

DROP POLICY IF EXISTS "Users can update event images they uploaded" ON storage.objects;
CREATE POLICY "Users can update event images they uploaded"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'event-images'
    AND owner = auth.uid()
  )
  WITH CHECK (
    bucket_id = 'event-images'
    AND owner = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete event images they uploaded" ON storage.objects;
CREATE POLICY "Users can delete event images they uploaded"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'event-images'
    AND owner = auth.uid()
  );

-- ============================================
-- MODULE IMAGES BUCKET POLICIES
-- ============================================
DROP POLICY IF EXISTS "Module images are publicly accessible" ON storage.objects;
CREATE POLICY "Module images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'module-images');

DROP POLICY IF EXISTS "Authenticated users can upload module images" ON storage.objects;
CREATE POLICY "Authenticated users can upload module images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'module-images');

DROP POLICY IF EXISTS "Users can update module images they uploaded" ON storage.objects;
CREATE POLICY "Users can update module images they uploaded"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'module-images'
    AND owner = auth.uid()
  )
  WITH CHECK (
    bucket_id = 'module-images'
    AND owner = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete module images they uploaded" ON storage.objects;
CREATE POLICY "Users can delete module images they uploaded"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'module-images'
    AND owner = auth.uid()
  );
