-- Migration: Create helper function to insert patient profile
-- Allows periodontists to create patient records without violating RLS
-- Note: This function assumes the auth user has already been created via Supabase Auth admin API

BEGIN;

CREATE OR REPLACE FUNCTION public.create_patient_profile(
  p_id UUID,
  p_email TEXT,
  p_periodontist_id UUID
)
RETURNS patient
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result patient;
  v_periodontist_exists BOOLEAN;
BEGIN
  -- Verify that the periodontist exists
  -- Note: Authorization is verified by the Edge Function before calling this function
  -- When called with service_role, auth.uid() is null, so we only check existence
  SELECT EXISTS (
    SELECT 1 FROM periodontist
    WHERE periodontist.id = p_periodontist_id
  ) INTO v_periodontist_exists;

  IF NOT v_periodontist_exists THEN
    RAISE EXCEPTION 'Periodontist not found';
  END IF;

  -- Verify that the auth user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_id) THEN
    RAISE EXCEPTION 'Auth user does not exist';
  END IF;

  -- Insert patient record
  INSERT INTO patient (id, email, periodontist_id)
  VALUES (p_id, lower(p_email), p_periodontist_id)
  ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      periodontist_id = EXCLUDED.periodontist_id,
      updated_at = NOW()
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.create_patient_profile(UUID, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_patient_profile(UUID, TEXT, UUID) TO authenticated;
-- Grant to service_role for Edge Function calls (service role bypasses RLS)
GRANT EXECUTE ON FUNCTION public.create_patient_profile(UUID, TEXT, UUID) TO service_role;

COMMIT;
