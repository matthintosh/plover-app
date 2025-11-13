-- Migration: Create Periodontist table
-- Description: Represents healthcare providers using the platform

-- Create enum for account status
CREATE TYPE periodontist_account_status AS ENUM ('active', 'inactive', 'suspended');

-- Create periodontist table
CREATE TABLE periodontist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT, -- Managed by Supabase Auth, but stored here for reference
  professional_credentials TEXT,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  account_status periodontist_account_status NOT NULL DEFAULT 'active',
  
  -- Constraints
  CONSTRAINT periodontist_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT periodontist_full_name_length CHECK (char_length(full_name) >= 2)
);

-- Create index on email for fast lookups
CREATE UNIQUE INDEX idx_periodontist_email ON periodontist(email);

-- Create index on account_status for filtering
CREATE INDEX idx_periodontist_account_status ON periodontist(account_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_periodontist_updated_at
  BEFORE UPDATE ON periodontist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE periodontist ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Periodontists can only read/update their own record
CREATE POLICY "Periodontists can view own profile"
  ON periodontist
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Periodontists can update own profile"
  ON periodontist
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Note: Periodontists will be created via Supabase Auth, then profile data synced to this table
-- The auth.uid() will match the periodontist.id

