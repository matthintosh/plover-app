-- Migration: Create DailyCheckIn table
-- Description: Represents a patient's daily symptom and habit log

-- Create daily_check_in table
CREATE TABLE daily_check_in (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bleeding INTEGER,
  pain INTEGER,
  mouth_feeling TEXT,
  interdental_brush_used BOOLEAN NOT NULL DEFAULT false,
  floss_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT daily_check_in_bleeding_range CHECK (bleeding IS NULL OR (bleeding >= 0 AND bleeding <= 10)),
  CONSTRAINT daily_check_in_pain_range CHECK (pain IS NULL OR (pain >= 0 AND pain <= 10)),
  CONSTRAINT daily_check_in_one_per_day UNIQUE (patient_id, date)
);

-- Create index on patient_id for fast lookups
CREATE INDEX idx_daily_check_in_patient_id ON daily_check_in(patient_id);

-- Create index on date for date range queries (statistics)
CREATE INDEX idx_daily_check_in_date ON daily_check_in(date);

-- Create composite index for patient date queries
CREATE INDEX idx_daily_check_in_patient_date ON daily_check_in(patient_id, date DESC);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_daily_check_in_updated_at
  BEFORE UPDATE ON daily_check_in
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE daily_check_in ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can create/read/update their own check-ins
CREATE POLICY "Patients can view own check-ins"
  ON daily_check_in
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = daily_check_in.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Patients can create own check-ins"
  ON daily_check_in
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = daily_check_in.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Patients can update own check-ins"
  ON daily_check_in
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = daily_check_in.patient_id
      AND patient.id::text = auth.uid()::text
    )
  );

-- RLS Policy: Periodontists can read check-ins for their patients
CREATE POLICY "Periodontists can view patient check-ins"
  ON daily_check_in
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient
      WHERE patient.id = daily_check_in.patient_id
      AND EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id = patient.periodontist_id
        AND periodontist.id::text = auth.uid()::text
      )
    )
  );

-- Note: Check-ins cannot be deleted (maintain history)
-- If soft delete is needed in the future, add a deleted_at column

