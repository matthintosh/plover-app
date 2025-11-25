import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { FollowUpService } from '../service/follow-up.service';
import type { OralHygieneRecommendation, OdontogramSpace } from '../service/types';

export interface UseRecommendationOptions {
  patientId?: string | null;
  enabled?: boolean;
}

export interface UseRecommendationResult {
  recommendation: OralHygieneRecommendation | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createOrUpdateRecommendation: (
    data: {
      toothbrushType?: string;
      toothbrushBrand?: string;
      toothbrushModel?: string;
      odontogram?: {
        spaces: OdontogramSpace[];
      };
    },
    periodontistId: string,
  ) => Promise<OralHygieneRecommendation>;
  isSubmitting: boolean;
}

export const useRecommendation = ({
  patientId,
  enabled = true,
}: UseRecommendationOptions): UseRecommendationResult => {
  const queryClient = useQueryClient();
  const followUpService = useMemo(() => new FollowUpService(), []);
  const isEnabled = enabled && !!patientId;

  const recommendationQuery = useQuery<OralHygieneRecommendation | null, Error>({
    queryKey: ['follow-up', 'recommendation', patientId],
    queryFn: () => followUpService.getRecommendationByPatientId(patientId as string),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const submitMutation = useMutation({
    mutationFn: ({
      data,
      periodontistId,
    }: {
      data: {
        toothbrushType?: string;
        toothbrushBrand?: string;
        toothbrushModel?: string;
        odontogram?: {
          spaces: OdontogramSpace[];
        };
      };
      periodontistId: string;
    }) =>
      followUpService.createOrUpdateRecommendation(patientId as string, periodontistId, data),
    onSuccess: async () => {
      // Invalidate recommendation query
      await queryClient.invalidateQueries({
        queryKey: ['follow-up', 'recommendation', patientId],
      });
    },
  });

  const refetch = async () => {
    if (!patientId) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['follow-up', 'recommendation', patientId],
    });
  };

  const createOrUpdateRecommendation = async (
    data: {
      toothbrushType?: string;
      toothbrushBrand?: string;
      toothbrushModel?: string;
      odontogram?: {
        spaces: OdontogramSpace[];
      };
    },
    periodontistId: string,
  ) => {
    return await submitMutation.mutateAsync({ data, periodontistId });
  };

  return {
    recommendation: recommendationQuery.data ?? null,
    isLoading: recommendationQuery.isLoading,
    isFetching: recommendationQuery.isFetching,
    error: recommendationQuery.error ?? null,
    refetch,
    createOrUpdateRecommendation,
    isSubmitting: submitMutation.isPending,
  };
};



