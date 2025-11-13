-- Migration: Create Odontogram table
-- Description: Represents a visual diagram of the mouth showing recommended tools per interdental space

-- Create odontogram table
CREATE TABLE odontogram (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oral_hygiene_recommendation_id UUID NOT NULL UNIQUE REFERENCES oral_hygiene_recommendation(id) ON DELETE CASCADE,
  spaces JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: spaces must be a valid JSON array
  CONSTRAINT odontogram_spaces_is_array CHECK (jsonb_typeof(spaces) = 'array')
);

-- Create index on oral_hygiene_recommendation_id for fast lookups
CREATE UNIQUE INDEX idx_odontogram_recommendation_id ON odontogram(oral_hygiene_recommendation_id);

-- Create GIN index on spaces for JSONB queries
CREATE INDEX idx_odontogram_spaces ON odontogram USING GIN (spaces);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_odontogram_updated_at
  BEFORE UPDATE ON odontogram
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE odontogram ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can read odontogram for their recommendations
CREATE POLICY "Patients can view own odontogram"
  ON odontogram
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM oral_hygiene_recommendation
      JOIN patient ON patient.id = oral_hygiene_recommendation.patient_id
      WHERE oral_hygiene_recommendation.id = odontogram.oral_hygiene_recommendation_id
      AND patient.id::text = auth.uid()::text
    )
  );

-- RLS Policy: Periodontists can create/read/update odontograms for their patients
CREATE POLICY "Periodontists can view patient odontograms"
  ON odontogram
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM oral_hygiene_recommendation
      JOIN patient ON patient.id = oral_hygiene_recommendation.patient_id
      WHERE oral_hygiene_recommendation.id = odontogram.oral_hygiene_recommendation_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can create patient odontograms"
  ON odontogram
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM oral_hygiene_recommendation
      JOIN patient ON patient.id = oral_hygiene_recommendation.patient_id
      WHERE oral_hygiene_recommendation.id = odontogram.oral_hygiene_recommendation_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can update patient odontograms"
  ON odontogram
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM oral_hygiene_recommendation
      JOIN patient ON patient.id = oral_hygiene_recommendation.patient_id
      WHERE oral_hygiene_recommendation.id = odontogram.oral_hygiene_recommendation_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

