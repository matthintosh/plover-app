-- Migration: Create Patient table
-- Description: Represents end users receiving periodontal care

-- Create enum for account status
CREATE TYPE patient_account_status AS ENUM ('pending', 'active', 'inactive');

-- Create patient table
-- Note: Patient authentication is handled by Supabase Auth via magic links.
-- Workflow:
-- 1. Periodontist invites patient using Supabase Auth admin API (inviteUserByEmail)
-- 2. This creates an auth.users record and sends magic link email
-- 3. Patient record is created with id = the auth user ID
-- 4. When patient clicks magic link and authenticates, they can access the app
-- The patient.id directly references auth.users.id for seamless integration.
CREATE TABLE patient (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  periodontist_id UUID NOT NULL REFERENCES periodontist(id) ON DELETE RESTRICT,
  email TEXT NOT NULL UNIQUE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  account_status patient_account_status NOT NULL DEFAULT 'pending',
  
  -- Constraints
  CONSTRAINT patient_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for fast lookups
CREATE UNIQUE INDEX idx_patient_email ON patient(email);

-- Create index on periodontist_id for periodontist's patient queries
CREATE INDEX idx_patient_periodontist_id ON patient(periodontist_id);

-- Create index on account_status for filtering
CREATE INDEX idx_patient_account_status ON patient(account_status);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_patient_updated_at
  BEFORE UPDATE ON patient
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE patient ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Patients can only read/update their own record
CREATE POLICY "Patients can view own profile"
  ON patient
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Patients can update own profile"
  ON patient
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policy: Periodontists can read/update all their associated patients
CREATE POLICY "Periodontists can view their patients"
  ON patient
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM periodontist
      WHERE periodontist.id = patient.periodontist_id
      AND periodontist.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Periodontists can update their patients"
  ON patient
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM periodontist
      WHERE periodontist.id = patient.periodontist_id
      AND periodontist.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Periodontists can create patients"
  ON patient
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM periodontist
      WHERE periodontist.id = patient.periodontist_id
      AND periodontist.id::text = auth.uid()::text
    )
  );

