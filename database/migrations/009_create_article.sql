-- Migration: Create Article table
-- Description: Represents educational content available to patients

-- Create enum for article status
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');

-- Create article table
CREATE TABLE article (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status article_status NOT NULL DEFAULT 'draft',
  
  -- Constraints
  CONSTRAINT article_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT article_content_not_empty CHECK (char_length(trim(content)) > 0),
  CONSTRAINT article_published_at_when_published CHECK (
    (status = 'published' AND published_at IS NOT NULL) OR
    (status != 'published')
  )
);

-- Create index on status for filtering published articles
CREATE INDEX idx_article_status ON article(status);

-- Create index on published_at for sorting
CREATE INDEX idx_article_published_at ON article(published_at DESC) WHERE published_at IS NOT NULL;

-- Create index on category for filtering
CREATE INDEX idx_article_category ON article(category) WHERE category IS NOT NULL;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_article_updated_at
  BEFORE UPDATE ON article
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_article_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_article_published_at_trigger
  BEFORE UPDATE ON article
  FOR EACH ROW
  WHEN (NEW.status = 'published' AND OLD.status != 'published')
  EXECUTE FUNCTION set_article_published_at();

-- Enable Row Level Security
ALTER TABLE article ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated patients can read published articles
CREATE POLICY "Patients can view published articles"
  ON article
  FOR SELECT
  USING (
    status = 'published'
    AND (
      -- Patients can view published articles
      EXISTS (
        SELECT 1 FROM patient
        WHERE patient.id::text = auth.uid()::text
      )
      OR
      -- Periodontists can view all articles
      EXISTS (
        SELECT 1 FROM periodontist
        WHERE periodontist.id::text = auth.uid()::text
      )
    )
  );

-- RLS Policy: Periodontists can read all articles (including drafts)
CREATE POLICY "Periodontists can view all articles"
  ON article
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM periodontist
      WHERE periodontist.id::text = auth.uid()::text
    )
  );

-- Note: Article creation/update/deletion will be restricted to admins in the future
-- For now, we'll allow periodontists to manage articles (can be restricted later)

