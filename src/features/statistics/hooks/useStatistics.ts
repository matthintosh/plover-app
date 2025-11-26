import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { StatisticsService } from '../service/statistics.service';
import type { CheckInStatistics } from '../service/types';

export interface UseStatisticsOptions {
  patientId?: string | null;
  startDate?: string; // ISO date string (defaults to 30 days ago)
  endDate?: string; // ISO date string (defaults to today)
  enabled?: boolean;
}

export interface UseStatisticsResult {
  statistics: CheckInStatistics | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useStatistics = ({
  patientId,
  startDate,
  endDate,
  enabled = true,
}: UseStatisticsOptions): UseStatisticsResult => {
  const statisticsService = useMemo(() => new StatisticsService(), []);
  const isEnabled = enabled && !!patientId;

  // Calculate default date range (last 30 days)
  const defaultDateRange = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(thirtyDaysAgo),
      end: formatDate(today),
    };
  }, []);

  const finalStartDate = startDate || defaultDateRange.start;
  const finalEndDate = endDate || defaultDateRange.end;

  const statisticsQuery = useQuery<CheckInStatistics, Error>({
    queryKey: ['statistics', patientId, finalStartDate, finalEndDate],
    queryFn: () =>
      statisticsService.getCheckInStatistics(
        patientId as string,
        finalStartDate,
        finalEndDate,
      ),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const refetch = async () => {
    if (!patientId) {
      return;
    }

    await statisticsQuery.refetch();
  };

  return {
    statistics: statisticsQuery.data ?? null,
    isLoading: statisticsQuery.isLoading,
    isFetching: statisticsQuery.isFetching,
    error: statisticsQuery.error ?? null,
    refetch,
  };
};






