-- Migration: Add insert policy for Periodontist table
-- Ensures newly registered providers can create their own profile row

BEGIN;

CREATE POLICY "Periodontists can create own profile"
  ON periodontist
  FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

COMMIT;
