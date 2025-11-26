-- Migration: Add notes field to diagnosis table and full_name field to patient table
-- Description: Adds notes field for diagnosis entries and full_name field for patient records

-- Add notes field to diagnosis table
ALTER TABLE diagnosis
ADD COLUMN notes TEXT;

-- Add full_name field to patient table
ALTER TABLE patient
ADD COLUMN full_name TEXT;

