import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FollowUpService } from '../service/follow-up.service';
import type { Diagnosis, RiskFactor } from '../service/types';

export interface UseFollowUpOptions {
  patientId?: string | null;
  enabled?: boolean;
}

export interface UseFollowUpResult {
  diagnosis: Diagnosis | null;
  riskFactors: RiskFactor[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFollowUp = ({
  patientId,
  enabled = true,
}: UseFollowUpOptions): UseFollowUpResult => {
  const queryClient = useQueryClient();
  const followUpService = useMemo(() => new FollowUpService(), []);
  const isEnabled = enabled && !!patientId;

  const diagnosisQuery = useQuery<Diagnosis | null, Error>({
    queryKey: ['follow-up', 'diagnosis', patientId],
    queryFn: () => followUpService.getDiagnosisByPatientId(patientId as string),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const riskFactorsQuery = useQuery<RiskFactor[], Error>({
    queryKey: ['follow-up', 'risk-factors', patientId],
    queryFn: () => followUpService.getRiskFactorsByPatientId(patientId as string),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const refetch = async () => {
    if (!patientId) {
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['follow-up', 'diagnosis', patientId] }),
      queryClient.invalidateQueries({ queryKey: ['follow-up', 'risk-factors', patientId] }),
    ]);
  };

  return {
    diagnosis: diagnosisQuery.data ?? null,
    riskFactors: riskFactorsQuery.data ?? [],
    isLoading: diagnosisQuery.isLoading || riskFactorsQuery.isLoading,
    isFetching: diagnosisQuery.isFetching || riskFactorsQuery.isFetching,
    error: diagnosisQuery.error ?? riskFactorsQuery.error ?? null,
    refetch,
  };
};

