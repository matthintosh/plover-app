-- Migration: Create helper function to insert periodontist profile
-- Allows authenticated users to insert/update their profile without violating RLS

BEGIN;

CREATE OR REPLACE FUNCTION public.create_periodontist_profile(
  p_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_professional_credentials TEXT
)
RETURNS periodontist
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result periodontist;
BEGIN
  INSERT INTO periodontist (id, email, full_name, professional_credentials)
  VALUES (p_id, lower(p_email), p_full_name, p_professional_credentials)
  ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      professional_credentials = EXCLUDED.professional_credentials,
      updated_at = NOW()
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.create_periodontist_profile(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_periodontist_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;

COMMIT;
