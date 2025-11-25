import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { StatisticsService } from '../statistics.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

jest.mock('../../../../lib/utils/offline-sync', () => ({
  isOnline: jest.fn(() => true),
  queueOperation: jest.fn(),
}));

describe('StatisticsService', () => {
  const createService = ({
    checkInsReturnValue = [],
  }: {
    checkInsReturnValue?: any[];
  }) => {
    const checkInService = {
      getCheckInsByDateRange: jest.fn().mockResolvedValue(checkInsReturnValue),
    };

    return {
      service: new StatisticsService(checkInService as any),
      checkInService,
    };
  };

  describe('getCheckInStatistics', () => {
    it('calculates statistics from check-ins', async () => {
      const mockCheckIns = [
        {
          id: 'checkin-1',
          patientId: 'patient-1',
          date: '2025-01-15',
          bleeding: 3,
          pain: 2,
          mouthFeeling: 'Good',
          interdentalBrushUsed: true,
          flossUsed: false,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        },
        {
          id: 'checkin-2',
          patientId: 'patient-1',
          date: '2025-01-16',
          bleeding: 2,
          pain: 1,
          mouthFeeling: 'Excellent',
          interdentalBrushUsed: true,
          flossUsed: true,
          createdAt: '2025-01-16T10:00:00Z',
          updatedAt: '2025-01-16T10:00:00Z',
        },
        {
          id: 'checkin-3',
          patientId: 'patient-1',
          date: '2025-01-17',
          bleeding: 1,
          pain: 0,
          mouthFeeling: 'Good',
          interdentalBrushUsed: false,
          flossUsed: true,
          createdAt: '2025-01-17T10:00:00Z',
          updatedAt: '2025-01-17T10:00:00Z',
        },
      ];

      const { service, checkInService } = createService({
        checkInsReturnValue: mockCheckIns,
      });

      const result = await service.getCheckInStatistics(
        'patient-1',
        '2025-01-15',
        '2025-01-17',
      );

      expect(checkInService.getCheckInsByDateRange).toHaveBeenCalledWith(
        'patient-1',
        '2025-01-15',
        '2025-01-17',
      );

      expect(result.totalCheckIns).toBe(3);
      expect(result.dateRange.start).toBe('2025-01-15');
      expect(result.dateRange.end).toBe('2025-01-17');
      expect(result.averages.bleeding).toBeCloseTo(2, 1); // (3+2+1)/3 = 2
      expect(result.averages.pain).toBeCloseTo(1, 1); // (2+1+0)/3 = 1
      expect(result.trends.bleeding).toHaveLength(3);
      expect(result.trends.pain).toHaveLength(3);
      expect(result.trends.mouthFeeling).toHaveLength(3);
      expect(result.trends.hygieneHabits).toHaveLength(3);
    });

    it('handles empty check-ins array', async () => {
      const { service } = createService({ checkInsReturnValue: [] });

      const result = await service.getCheckInStatistics(
        'patient-1',
        '2025-01-15',
        '2025-01-17',
      );

      expect(result.totalCheckIns).toBe(0);
      expect(result.averages.bleeding).toBeUndefined();
      expect(result.averages.pain).toBeUndefined();
      expect(result.trends.bleeding).toEqual([]);
      expect(result.trends.pain).toEqual([]);
      expect(result.trends.mouthFeeling).toEqual([]);
      expect(result.trends.hygieneHabits).toEqual([]);
    });

    it('handles check-ins with missing optional fields', async () => {
      const mockCheckIns = [
        {
          id: 'checkin-1',
          patientId: 'patient-1',
          date: '2025-01-15',
          bleeding: undefined,
          pain: undefined,
          mouthFeeling: undefined,
          interdentalBrushUsed: false,
          flossUsed: false,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        },
      ];

      const { service } = createService({ checkInsReturnValue: mockCheckIns });

      const result = await service.getCheckInStatistics(
        'patient-1',
        '2025-01-15',
        '2025-01-15',
      );

      expect(result.totalCheckIns).toBe(1);
      expect(result.averages.bleeding).toBeUndefined();
      expect(result.averages.pain).toBeUndefined();
      expect(result.trends.bleeding).toHaveLength(1);
      expect(result.trends.pain).toHaveLength(1);
    });

    it('validates date range', async () => {
      const { service } = createService({});

      await expect(
        service.getCheckInStatistics('patient-1', '2025-01-17', '2025-01-15'),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });
    });

    it('calculates hygiene habits trend correctly', async () => {
      const mockCheckIns = [
        {
          id: 'checkin-1',
          patientId: 'patient-1',
          date: '2025-01-15',
          bleeding: 3,
          pain: 2,
          mouthFeeling: 'Good',
          interdentalBrushUsed: true,
          flossUsed: false,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        },
        {
          id: 'checkin-2',
          patientId: 'patient-1',
          date: '2025-01-16',
          bleeding: 2,
          pain: 1,
          mouthFeeling: 'Excellent',
          interdentalBrushUsed: true,
          flossUsed: true,
          createdAt: '2025-01-16T10:00:00Z',
          updatedAt: '2025-01-16T10:00:00Z',
        },
      ];

      const { service } = createService({ checkInsReturnValue: mockCheckIns });

      const result = await service.getCheckInStatistics(
        'patient-1',
        '2025-01-15',
        '2025-01-16',
      );

      expect(result.trends.hygieneHabits).toHaveLength(2);
      // Hygiene habits should be a combination of brush and floss usage
      expect(result.trends.hygieneHabits[0].value).toContain('brush');
      expect(result.trends.hygieneHabits[1].value).toContain('brush');
      expect(result.trends.hygieneHabits[1].value).toContain('floss');
    });
  });
});

