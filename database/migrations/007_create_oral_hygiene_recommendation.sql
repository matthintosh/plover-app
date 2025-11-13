-- Migration: Create OralHygieneRecommendation table
-- Description: Represents periodontist-prescribed oral hygiene materials

-- Create oral_hygiene_recommendation table
CREATE TABLE oral_hygiene_recommendation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES patient(id) ON DELETE CASCADE,
  toothbrush_type TEXT,
  toothbrush_brand TEXT,
  toothbrush_model TEXT,
  entered_by UUID NOT NULL REFERENCES periodontist(id) ON DELETE RESTRICT,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: At least one field must be provided
  CONSTRAINT oral_hygiene_recommendation_has_data CHECK (
    toothbrush_type IS NOT NULL OR
    toothbrush_brand IS NOT NULL OR
    toothbrush_model IS NOT NULL
  )
);

-- Create index on patient_id for fast lookups
CREATE UNIQUE INDEX idx_oral_hygiene_recommendation_patient_id ON oral_hygiene_recommendation(patient_id);

-- Create index on entered_by for periodontist queries
CREATE INDEX idx_oral_hygiene_recommendation_entered_by ON oral_hygiene_recommendation(entered_by);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_oral_hygiene_recommendation_updated_at
  BEFORE UPDATE ON oral_hygiene_recommendation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE oral_hygiene_recommendation ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can read their own recommendations
CREATE POLICY "Patients can view own recommendations"
  ON oral_hygiene_recommendation
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = oral_hygiene_recommendation.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

-- RLS Policy: Periodontists can create/read/update recommendations for their patients
CREATE POLICY "Periodontists can view patient recommendations"
  ON oral_hygiene_recommendation
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = oral_hygiene_recommendation.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can create patient recommendations"
  ON oral_hygiene_recommendation
  FOR INSERT
  WITH CHECK (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = oral_hygiene_recommendation.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can update patient recommendations"
  ON oral_hygiene_recommendation
  FOR UPDATE
  USING (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = oral_hygiene_recommendation.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

