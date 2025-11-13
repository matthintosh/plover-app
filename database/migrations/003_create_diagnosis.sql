-- Migration: Create Diagnosis table
-- Description: Represents a patient's periodontal condition

-- Create enum for diagnosis type
CREATE TYPE diagnosis_type AS ENUM ('gingivitis', 'periodontitis');

-- Create diagnosis table
CREATE TABLE diagnosis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES patient(id) ON DELETE CASCADE,
  type diagnosis_type NOT NULL,
  grade INTEGER,
  stage INTEGER,
  entered_by UUID NOT NULL REFERENCES periodontist(id) ON DELETE RESTRICT,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT diagnosis_grade_range CHECK (grade IS NULL OR (grade >= 1 AND grade <= 4)),
  CONSTRAINT diagnosis_stage_range CHECK (stage IS NULL OR (stage >= 1 AND stage <= 4)),
  CONSTRAINT diagnosis_periodontitis_requires_grade_stage CHECK (
    (type = 'gingivitis' AND grade IS NULL AND stage IS NULL) OR
    (type = 'periodontitis' AND grade IS NOT NULL AND stage IS NOT NULL)
  )
);

-- Create index on patient_id for fast lookups
CREATE UNIQUE INDEX idx_diagnosis_patient_id ON diagnosis(patient_id);

-- Create index on entered_by for periodontist queries
CREATE INDEX idx_diagnosis_entered_by ON diagnosis(entered_by);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_diagnosis_updated_at
  BEFORE UPDATE ON diagnosis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE diagnosis ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can read their own diagnosis
CREATE POLICY "Patients can view own diagnosis"
  ON diagnosis
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = diagnosis.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

-- RLS Policy: Periodontists can read/update diagnoses for their patients
CREATE POLICY "Periodontists can view patient diagnoses"
  ON diagnosis
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = diagnosis.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can create patient diagnoses"
  ON diagnosis
  FOR INSERT
  WITH CHECK (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = diagnosis.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Periodontists can update patient diagnoses"
  ON diagnosis
  FOR UPDATE
  USING (
    entered_by::text = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = diagnosis.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

