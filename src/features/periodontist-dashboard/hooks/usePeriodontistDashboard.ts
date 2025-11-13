import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { PatientRepository } from '@/features/authentication/repository/patient.repository';
import type { PatientProfile } from '@/features/authentication/repository/patient.repository.interface';
import { PeriodontistDashboardService } from '../service/periodontist-dashboard.service';
import type {
    AddRiskFactorInput,
    CreateOrUpdateDiagnosisInput,
    RemoveRiskFactorInput,
} from '../service/types';

type UsePeriodontistDashboardOptions = {
  periodontistId?: string | null;
};

export const usePeriodontistDashboard = ({ periodontistId }: UsePeriodontistDashboardOptions) => {
  const queryClient = useQueryClient();
  const patientRepository = useMemo(() => new PatientRepository(), []);
  const dashboardService = useMemo(() => new PeriodontistDashboardService(), []);

  const patientsQuery = useQuery<PatientProfile[]>({
    queryKey: ['periodontist-dashboard', 'patients', periodontistId],
    enabled: !!periodontistId,
    queryFn: async () => {
      if (!periodontistId) {
        return [];
      }

      return patientRepository.listByPeriodontistId(periodontistId);
    },
  });

  const createOrUpdateDiagnosisMutation = useMutation({
    mutationFn: (input: CreateOrUpdateDiagnosisInput) =>
      dashboardService.createOrUpdateDiagnosis(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follow-up', 'diagnosis', variables.patientId] });
    },
  });

  const addRiskFactorMutation = useMutation({
    mutationFn: (input: AddRiskFactorInput) => dashboardService.addRiskFactor(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['follow-up', 'risk-factors', variables.patientId],
      });
    },
  });

  const removeRiskFactorMutation = useMutation({
    mutationFn: (input: RemoveRiskFactorInput) => dashboardService.removeRiskFactor(input),
    onSuccess: (_data, variables) => {
      if (variables.patientId) {
        queryClient.invalidateQueries({
          queryKey: ['follow-up', 'risk-factors', variables.patientId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['follow-up', 'risk-factors'] });
      }
    },
  });

  return {
    patients: patientsQuery.data ?? [],
    isLoadingPatients: patientsQuery.isLoading,
    patientsError: patientsQuery.error as Error | null,
    refetchPatients: patientsQuery.refetch,
    createOrUpdateDiagnosis: createOrUpdateDiagnosisMutation.mutateAsync,
    createOrUpdateDiagnosisStatus: createOrUpdateDiagnosisMutation.status,
    addRiskFactor: addRiskFactorMutation.mutateAsync,
    addRiskFactorStatus: addRiskFactorMutation.status,
    removeRiskFactor: removeRiskFactorMutation.mutateAsync,
    removeRiskFactorStatus: removeRiskFactorMutation.status,
  };
};

