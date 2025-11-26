/**
 * Repository Implementation for Patient Diagnostic View
 * 
 * Implements data access layer using Supabase client.
 * RLS policies ensure patients can only view their own data.
 */

import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type {
    ComprehensiveMedicalInfoView,
    DiagnosisView,
    OralHygieneRecommendationView,
    RiskFactorView,
} from '../service/types';
import {
    mapDiagnosisRowToView,
    mapRecommendationRowToView,
    mapRiskFactorRowToView,
} from '../service/types';
import type { PatientDiagnosticViewRepository } from './patient-diagnostic-view.repository.interface';

export class PatientDiagnosticViewRepositoryImpl
  implements PatientDiagnosticViewRepository
{
  /**
   * Get diagnosis for the authenticated patient
   * Uses RLS to automatically filter by patient_id from auth session
   */
  async getDiagnosis(): Promise<DiagnosisView | null> {
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .select('*')
        .maybeSingle();

      if (error) {
        throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
      }

      if (!data) {
        return null;
      }

      return mapDiagnosisRowToView(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Failed to fetch diagnosis',
        error,
      );
    }
  }

  /**
   * Get all risk factors for the authenticated patient
   * Uses RLS to automatically filter by patient_id from auth session
   */
  async getRiskFactors(): Promise<RiskFactorView[]> {
    try {
      const { data, error } = await supabase
        .from('risk_factor')
        .select('*')
        .order('entered_at', { ascending: false });

      if (error) {
        throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
      }

      return (data ?? []).map(mapRiskFactorRowToView);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Failed to fetch risk factors',
        error,
      );
    }
  }

  /**
   * Get oral hygiene recommendations for the authenticated patient
   * Uses RLS to automatically filter by patient_id from auth session
   */
  async getRecommendations(): Promise<OralHygieneRecommendationView | null> {
    try {
      const { data, error } = await supabase
        .from('oral_hygiene_recommendation')
        .select('*')
        .maybeSingle();

      if (error) {
        throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
      }

      if (!data) {
        return null;
      }

      return mapRecommendationRowToView(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Failed to fetch recommendations',
        error,
      );
    }
  }

  /**
   * Get all medical information for the authenticated patient in a single call
   * Fetches diagnosis, risk factors, and recommendations in parallel
   */
  async getAllMedicalInfo(): Promise<ComprehensiveMedicalInfoView> {
    try {
      const [diagnosis, riskFactors, recommendation] = await Promise.all([
        this.getDiagnosis(),
        this.getRiskFactors(),
        this.getRecommendations(),
      ]);

      return {
        diagnosis,
        riskFactors,
        recommendation,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Failed to fetch medical information',
        error,
      );
    }
  }
}

