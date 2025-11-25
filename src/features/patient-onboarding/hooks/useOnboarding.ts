import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { PatientRepository } from '@/features/authentication/repository/patient.repository';
import { OnboardingService } from '../service/onboarding.service';
import type { OnboardingInput, OnboardingResponse } from '../service/types';

export interface UseOnboardingOptions {
  patientId?: string | null;
  enabled?: boolean;
}

export interface UseOnboardingResult {
  onboardingResponse: OnboardingResponse | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  submitOnboarding: (data: OnboardingInput) => Promise<OnboardingResponse>;
  isSubmitting: boolean;
}

export const useOnboarding = ({
  patientId,
  enabled = true,
}: UseOnboardingOptions): UseOnboardingResult => {
  const queryClient = useQueryClient();
  const onboardingService = useMemo(() => new OnboardingService(), []);
  const patientRepository = useMemo(() => new PatientRepository(), []);
  const isEnabled = enabled && !!patientId;

  const onboardingQuery = useQuery<OnboardingResponse | null, Error>({
    queryKey: ['onboarding', 'response', patientId],
    queryFn: () => onboardingService.getOnboardingResponse(patientId as string),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });

  const submitMutation = useMutation({
    mutationFn: (data: OnboardingInput) =>
      onboardingService.submitOnboardingResponse(patientId as string, data),
    onSuccess: async () => {
      // Invalidate onboarding query
      await queryClient.invalidateQueries({
        queryKey: ['onboarding', 'response', patientId],
      });

      // Update patient account status to active
      if (patientId) {
        try {
          await patientRepository.updateOnboardingStatus(patientId, true);
          // Invalidate patient queries to refresh account status
          await queryClient.invalidateQueries({
            queryKey: ['patient', patientId],
          });
          await queryClient.invalidateQueries({
            queryKey: ['periodontist-dashboard', 'patients'],
          });
        } catch (error) {
          console.warn('[useOnboarding] Failed to update patient status', error);
          // Don't throw - onboarding was successful, status update is secondary
        }
      }
    },
  });

  const refetch = async () => {
    if (!patientId) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['onboarding', 'response', patientId],
    });
  };

  return {
    onboardingResponse: onboardingQuery.data ?? null,
    isLoading: onboardingQuery.isLoading,
    isFetching: onboardingQuery.isFetching,
    error: onboardingQuery.error ?? null,
    refetch,
    submitOnboarding: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
  };
};

