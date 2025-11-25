import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { CheckInService } from '../service/check-in.service';
import type { CheckInInput, DailyCheckIn } from '../service/types';

export interface UseCheckInOptions {
  patientId?: string | null;
  date?: string; // ISO date string (defaults to today)
  enabled?: boolean;
}

export interface UseCheckInResult {
  checkIn: DailyCheckIn | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createOrUpdateCheckIn: (data: CheckInInput) => Promise<DailyCheckIn>;
  isSubmitting: boolean;
}

export const useCheckIn = ({
  patientId,
  date,
  enabled = true,
}: UseCheckInOptions): UseCheckInResult => {
  const queryClient = useQueryClient();
  const checkInService = useMemo(() => new CheckInService(), []);
  const isEnabled = enabled && !!patientId;

  // Get today's date if not provided
  const checkInDate =
    date ||
    (() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })();

  const checkInQuery = useQuery<DailyCheckIn | null, Error>({
    queryKey: ['check-in', 'by-date', patientId, checkInDate],
    queryFn: () => checkInService.getCheckInByDate(patientId as string, checkInDate),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const submitMutation = useMutation({
    mutationFn: (data: CheckInInput) =>
      checkInService.createOrUpdateCheckIn(patientId as string, {
        ...data,
        date: data.date || checkInDate,
      }),
    onSuccess: async (data) => {
      // Invalidate check-in queries
      await queryClient.invalidateQueries({
        queryKey: ['check-in', 'by-date', patientId, data.date],
      });
      await queryClient.invalidateQueries({
        queryKey: ['check-in', 'by-date-range', patientId],
      });
      // Also invalidate statistics queries
      await queryClient.invalidateQueries({
        queryKey: ['statistics', patientId],
      });
    },
  });

  const refetch = async () => {
    if (!patientId) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['check-in', 'by-date', patientId, checkInDate],
    });
  };

  return {
    checkIn: checkInQuery.data ?? null,
    isLoading: checkInQuery.isLoading,
    isFetching: checkInQuery.isFetching,
    error: checkInQuery.error ?? null,
    refetch,
    createOrUpdateCheckIn: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
  };
};

