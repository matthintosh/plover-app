/**
 * Repository Interface for Patient Diagnostic View
 * 
 * Defines the data access layer for fetching patient medical information.
 * The repository uses Supabase with RLS policies to ensure patients can only
 * view their own data.
 */

import type {
  DiagnosisView,
  RiskFactorView,
  OralHygieneRecommendationView,
  ComprehensiveMedicalInfoView,
} from '../service/types';

export interface PatientDiagnosticViewRepository {
  /**
   * Get diagnosis for the authenticated patient
   * @returns Diagnosis data or null if not found
   * @throws Error if patient is not authenticated or database error occurs
   */
  getDiagnosis(): Promise<DiagnosisView | null>;

  /**
   * Get all risk factors for the authenticated patient
   * @returns Array of risk factor data (empty array if none found)
   * @throws Error if patient is not authenticated or database error occurs
   */
  getRiskFactors(): Promise<RiskFactorView[]>;

  /**
   * Get oral hygiene recommendations for the authenticated patient
   * @returns Recommendation data or null if not found
   * @throws Error if patient is not authenticated or database error occurs
   */
  getRecommendations(): Promise<OralHygieneRecommendationView | null>;

  /**
   * Get all medical information for the authenticated patient in a single call
   * @returns Comprehensive medical information object
   * @throws Error if patient is not authenticated or database error occurs
   */
  getAllMedicalInfo(): Promise<ComprehensiveMedicalInfoView>;
}

