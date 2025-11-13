-- Migration: Create OnboardingResponse table
-- Description: Represents a patient's onboarding questionnaire answers

-- Create onboarding_response table
CREATE TABLE onboarding_response (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES patient(id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  diet TEXT NOT NULL,
  sleep TEXT NOT NULL,
  bruxism_clenching BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT onboarding_response_age_range CHECK (age >= 1 AND age <= 150),
  CONSTRAINT onboarding_response_diet_not_empty CHECK (char_length(trim(diet)) > 0),
  CONSTRAINT onboarding_response_sleep_not_empty CHECK (char_length(trim(sleep)) > 0)
);

-- Create index on patient_id for fast lookups
CREATE UNIQUE INDEX idx_onboarding_response_patient_id ON onboarding_response(patient_id);

-- Enable Row Level Security
ALTER TABLE onboarding_response ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can read/update their own onboarding response
CREATE POLICY "Patients can view own onboarding response"
  ON onboarding_response
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = onboarding_response.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Patients can create own onboarding response"
  ON onboarding_response
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = onboarding_response.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Patients can update own onboarding response"
  ON onboarding_response
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = onboarding_response.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

-- RLS Policy: Periodontists can read onboarding responses for their patients
CREATE POLICY "Periodontists can view patient onboarding responses"
  ON onboarding_response
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = onboarding_response.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

