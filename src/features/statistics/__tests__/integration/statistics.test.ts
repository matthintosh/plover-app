import { CheckInService } from '../../../daily-check-in/service/check-in.service';
import { StatisticsService } from '../../service/statistics.service';

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

describe('Statistics Integration - Statistics Calculation Flow', () => {
  it('calculates statistics from check-ins through services', async () => {
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

    const checkInService = {
      getCheckInsByDateRange: jest.fn().mockResolvedValue(mockCheckIns),
    };

    const statisticsService = new StatisticsService(checkInService as any);

    const result = await statisticsService.getCheckInStatistics(
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
    expect(result.averages.bleeding).toBeCloseTo(2, 1);
    expect(result.averages.pain).toBeCloseTo(1, 1);
    expect(result.trends.bleeding).toHaveLength(3);
    expect(result.trends.pain).toHaveLength(3);
    expect(result.trends.mouthFeeling).toHaveLength(3);
    expect(result.trends.hygieneHabits).toHaveLength(3);

    // Verify trend data structure
    expect(result.trends.bleeding[0]).toEqual({
      date: '2025-01-15',
      value: 3,
    });
    expect(result.trends.pain[1]).toEqual({
      date: '2025-01-16',
      value: 1,
    });
    expect(result.trends.mouthFeeling[0]).toEqual({
      date: '2025-01-15',
      value: 'Good',
    });
    expect(result.trends.hygieneHabits[1]).toEqual({
      date: '2025-01-16',
      value: 'interdental brush, floss',
    });
  });

  it('handles empty check-ins gracefully', async () => {
    const checkInService = {
      getCheckInsByDateRange: jest.fn().mockResolvedValue([]),
    };

    const statisticsService = new StatisticsService(checkInService as any);

    const result = await statisticsService.getCheckInStatistics(
      'patient-1',
      '2025-01-15',
      '2025-01-17',
    );

    expect(result.totalCheckIns).toBe(0);
    expect(result.averages.bleeding).toBeUndefined();
    expect(result.averages.pain).toBeUndefined();
    expect(result.trends.bleeding).toEqual([]);
    expect(result.trends.pain).toEqual([]);
  });
});






