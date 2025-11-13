-- Migration: Create additional indexes for performance
-- Description: Additional indexes beyond those created in table migrations

-- Additional composite indexes for common query patterns

-- Index for periodontist dashboard queries (patients with status)
CREATE INDEX idx_patient_periodontist_status ON patient(periodontist_id, account_status);

-- Index for patient check-in statistics queries (date range)
CREATE INDEX idx_daily_check_in_patient_date_range ON daily_check_in(patient_id, date DESC) 
  WHERE date >= CURRENT_DATE - INTERVAL '90 days';

-- Index for article browsing (published articles by category)
CREATE INDEX idx_article_published_category ON article(category, published_at DESC) 
  WHERE status = 'published';

-- Index for risk factor queries by type
CREATE INDEX idx_risk_factor_patient_type ON risk_factor(patient_id, type);

-- Full text search index for articles (if full-text search is needed)
-- CREATE INDEX idx_article_content_search ON article USING GIN (to_tsvector('english', title || ' ' || content));

-- Note: Additional indexes can be added based on actual query patterns in production

