/**
 * TypeScript Types for Patient Diagnostic View Feature
 * 
 * Defines view models and display models for patient medical information.
 * These types are used throughout the feature for data transformation and display.
 */

import type { Tables } from '@/lib/supabase/types';

// Database row types
type DiagnosisRow = Tables<'diagnosis'>;
type RiskFactorRow = Tables<'risk_factor'>;
type OralHygieneRecommendationRow = Tables<'oral_hygiene_recommendation'>;

// ============================================================================
// Diagnosis Types
// ============================================================================

export type DiagnosisType = 'gingivitis' | 'periodontitis';

export interface DiagnosisView {
  id: string;
  type: DiagnosisType;
  grade: number | null; // 1-4, only for periodontitis
  stage: number | null; // 1-4, only for periodontitis
  enteredAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface DiagnosisDisplay {
  type: DiagnosisType;
  displayLabel: string; // "Gingivitis" or "Periodontitis"
  grade: number | null;
  stage: number | null;
  gradeLabel: string | null; // "Grade 1" or null
  stageLabel: string | null; // "Stage 1" or null
  lastUpdated: string; // Formatted date string
}

// ============================================================================
// Risk Factor Types
// ============================================================================

export type RiskFactorType = 
  | 'diabetes'
  | 'tobacco_use'
  | 'cardiovascular_disease'
  | 'cancer_hormonotherapy';

export interface RiskFactorDetails {
  level?: string; // For tobacco use: "light", "moderate", "heavy"
  notes?: string;
  [key: string]: unknown; // Allow for future extensibility
}

export interface RiskFactorView {
  id: string;
  type: RiskFactorType;
  details: RiskFactorDetails | null;
  enteredAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface RiskFactorDisplay {
  id: string;
  type: RiskFactorType;
  displayLabel: string; // "Diabetes", "Tobacco Use", etc.
  details: RiskFactorDetails | null;
  formattedDetails: string; // Human-readable details string
  lastUpdated: string; // Formatted date string
}

// ============================================================================
// Oral Hygiene Recommendation Types
// ============================================================================

export interface OralHygieneRecommendationView {
  id: string;
  toothbrushType: string | null;
  toothbrushBrand: string | null;
  toothbrushModel: string | null;
  enteredAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface OralHygieneRecommendationDisplay {
  toothbrushType: string | null;
  toothbrushBrand: string | null;
  toothbrushModel: string | null;
  formattedRecommendation: string; // Combined display string
  lastUpdated: string; // Formatted date string
}

// ============================================================================
// Comprehensive Medical Information Types
// ============================================================================

export interface ComprehensiveMedicalInfoView {
  diagnosis: DiagnosisView | null;
  riskFactors: RiskFactorView[];
  recommendation: OralHygieneRecommendationView | null;
}

export interface ComprehensiveMedicalInfoDisplay {
  diagnosis: DiagnosisDisplay | null;
  riskFactors: RiskFactorDisplay[];
  recommendation: OralHygieneRecommendationDisplay | null;
  hasAnyData: boolean; // True if at least one data type exists
}

// ============================================================================
// Empty State Messages
// ============================================================================
// Note: Empty state messages are now in constants.ts for better organization
// These exports are kept for backward compatibility
export {
    EMPTY_DIAGNOSIS_MESSAGE, EMPTY_RECOMMENDATIONS_MESSAGE, EMPTY_RISK_FACTORS_MESSAGE
} from './constants';

// ============================================================================
// Mapper Functions (for repository layer)
// ============================================================================

export const mapDiagnosisRowToView = (row: DiagnosisRow): DiagnosisView => ({
  id: row.id,
  type: row.type,
  grade: row.grade,
  stage: row.stage,
  enteredAt: row.entered_at,
  updatedAt: row.updated_at,
});

export const mapRiskFactorRowToView = (row: RiskFactorRow): RiskFactorView => ({
  id: row.id,
  type: row.type,
  details: row.details as RiskFactorDetails | null,
  enteredAt: row.entered_at,
  updatedAt: row.updated_at,
});

export const mapRecommendationRowToView = (
  row: OralHygieneRecommendationRow
): OralHygieneRecommendationView => ({
  id: row.id,
  toothbrushType: row.toothbrush_type,
  toothbrushBrand: row.toothbrush_brand,
  toothbrushModel: row.toothbrush_model,
  enteredAt: row.entered_at,
  updatedAt: row.updated_at,
});

