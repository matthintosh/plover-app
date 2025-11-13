-- Migration: Create RiskFactor table
-- Description: Represents factors that may affect periodontal health

-- Create enum for risk factor type
CREATE TYPE risk_factor_type AS ENUM (
  'diabetes',
  'tobacco_use',
  'cardiovascular_disease',
  'cancer_hormonotherapy'
);

-- Create risk_factor table
CREATE TABLE risk_factor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  type risk_factor_type NOT NULL,
  details JSONB,
  entered_by UUID NOT NULL REFERENCES periodontist(id) ON DELETE RESTRICT,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: Prevent duplicate risk factors of the same type per patient
  -- (enforced at application level, but also add unique constraint)
  CONSTRAINT risk_factor_unique_per_patient_type UNIQUE (patient_id, type)
);

-- Create index on patient_id for fast lookups
CREATE INDEX idx_risk_factor_patient_id ON risk_factor(patient_id);

-- Create index on entered_by for periodontist queries
CREATE INDEX idx_risk_factor_entered_by ON risk_factor(entered_by);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_risk_factor_updated_at
  BEFORE UPDATE ON risk_factor
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE risk_factor ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can read their own risk factors
CREATE POLICY "Patients can view own risk factors"
  ON risk_factor
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = risk_factor.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

-- RLS Policy: Periodontists can create/read/update/delete risk factors for their patients
CREATE POLICY "Periodontists can view patient risk factors"
  ON risk_factor
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = risk_factor.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can create patient risk factors"
  ON risk_factor
  FOR INSERT
  WITH CHECK (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = risk_factor.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can update patient risk factors"
  ON risk_factor
  FOR UPDATE
  USING (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = risk_factor.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can delete patient risk factors"
  ON risk_factor
  FOR DELETE
  USING (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = risk_factor.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

