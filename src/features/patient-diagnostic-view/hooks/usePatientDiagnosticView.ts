/**
 * Custom Hook for Patient Diagnostic View
 * 
 * Manages data fetching and state for patient medical information.
 * Uses React Query for caching and automatic refetching.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CACHE_STALE_TIME } from '../service/constants';
import { PatientDiagnosticViewService } from '../service/patient-diagnostic-view.service';
import type {
    ComprehensiveMedicalInfoDisplay,
    DiagnosisDisplay,
    OralHygieneRecommendationDisplay,
    RiskFactorDisplay,
} from '../service/types';

export interface UsePatientDiagnosticViewResult {
  // Diagnosis data
  diagnosis: DiagnosisDisplay | null;
  diagnosisLoading: boolean;
  diagnosisError: Error | null;

  // Risk factors data
  riskFactors: RiskFactorDisplay[];
  riskFactorsLoading: boolean;
  riskFactorsError: Error | null;

  // Recommendations data
  recommendations: OralHygieneRecommendationDisplay | null;
  recommendationsLoading: boolean;
  recommendationsError: Error | null;

  // Comprehensive view data
  comprehensiveInfo: ComprehensiveMedicalInfoDisplay | null;
  comprehensiveLoading: boolean;
  comprehensiveError: Error | null;

  // Combined loading state (true if any data is loading)
  isLoading: boolean;

  // Combined error state (first error encountered, or null)
  error: Error | null;

  // Refetch functions
  refetchDiagnosis: () => Promise<void>;
  refetchRiskFactors: () => Promise<void>;
  refetchRecommendations: () => Promise<void>;
  refetchAll: () => Promise<void>;
}

export interface UsePatientDiagnosticViewOptions {
  enabled?: boolean;
}

export function usePatientDiagnosticView(
  options: UsePatientDiagnosticViewOptions = {},
): UsePatientDiagnosticViewResult {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const service = useMemo(() => new PatientDiagnosticViewService(), []);

  // Diagnosis query
  const diagnosisQuery = useQuery<DiagnosisDisplay | null, Error>({
    queryKey: ['patient-diagnostic-view', 'diagnosis'],
    queryFn: () => service.getDiagnosis(),
    enabled,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_STALE_TIME * 2, // Keep in cache for 10 minutes
  });

  // Risk factors query
  const riskFactorsQuery = useQuery<RiskFactorDisplay[], Error>({
    queryKey: ['patient-diagnostic-view', 'risk-factors'],
    queryFn: () => service.getRiskFactors(),
    enabled,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_STALE_TIME * 2, // Keep in cache for 10 minutes
  });

  // Recommendations query
  const recommendationsQuery = useQuery<
    OralHygieneRecommendationDisplay | null,
    Error
  >({
    queryKey: ['patient-diagnostic-view', 'recommendations'],
    queryFn: () => service.getRecommendations(),
    enabled,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_STALE_TIME * 2, // Keep in cache for 10 minutes
  });

  // Comprehensive info query
  const comprehensiveQuery = useQuery<
    ComprehensiveMedicalInfoDisplay,
    Error
  >({
    queryKey: ['patient-diagnostic-view', 'comprehensive'],
    queryFn: () => service.getComprehensiveMedicalInfo(),
    enabled,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_STALE_TIME * 2, // Keep in cache for 10 minutes
  });

  // Refetch functions
  const refetchDiagnosis = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['patient-diagnostic-view', 'diagnosis'],
    });
  };

  const refetchRiskFactors = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['patient-diagnostic-view', 'risk-factors'],
    });
  };

  const refetchRecommendations = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['patient-diagnostic-view', 'recommendations'],
    });
  };

  const refetchAll = async () => {
    await Promise.all([
      refetchDiagnosis(),
      refetchRiskFactors(),
      refetchRecommendations(),
      queryClient.invalidateQueries({
        queryKey: ['patient-diagnostic-view', 'comprehensive'],
      }),
    ]);
  };

  return {
    // Diagnosis
    diagnosis: diagnosisQuery.data ?? null,
    diagnosisLoading: diagnosisQuery.isLoading,
    diagnosisError: diagnosisQuery.error ?? null,

    // Risk factors
    riskFactors: riskFactorsQuery.data ?? [],
    riskFactorsLoading: riskFactorsQuery.isLoading,
    riskFactorsError: riskFactorsQuery.error ?? null,

    // Recommendations
    recommendations: recommendationsQuery.data ?? null,
    recommendationsLoading: recommendationsQuery.isLoading,
    recommendationsError: recommendationsQuery.error ?? null,

    // Comprehensive
    comprehensiveInfo: comprehensiveQuery.data ?? null,
    comprehensiveLoading: comprehensiveQuery.isLoading,
    comprehensiveError: comprehensiveQuery.error ?? null,

    // Combined states
    isLoading:
      diagnosisQuery.isLoading ||
      riskFactorsQuery.isLoading ||
      recommendationsQuery.isLoading ||
      comprehensiveQuery.isLoading,
    error:
      diagnosisQuery.error ??
      riskFactorsQuery.error ??
      recommendationsQuery.error ??
      comprehensiveQuery.error ??
      null,

    // Refetch functions
    refetchDiagnosis,
    refetchRiskFactors,
    refetchRecommendations,
    refetchAll,
  };
}

