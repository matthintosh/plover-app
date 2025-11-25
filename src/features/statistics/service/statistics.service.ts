import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import { CheckInService } from '@/features/daily-check-in/service/check-in.service';
import type { DailyCheckIn } from '@/features/daily-check-in/service/types';
import type { CheckInStatistics, TrendData } from './types';

export class StatisticsService {
  constructor(
    private readonly checkInService: CheckInService = new CheckInService(),
  ) {}

  async getCheckInStatistics(
    patientId: string,
    startDate: string,
    endDate: string,
  ): Promise<CheckInStatistics> {
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'Start date must be before or equal to end date',
      );
    }

    // Get check-ins for the date range
    const checkIns = await this.checkInService.getCheckInsByDateRange(
      patientId,
      startDate,
      endDate,
    );

    // Calculate statistics
    return this.calculateStatistics(checkIns, startDate, endDate);
  }

  private calculateStatistics(
    checkIns: DailyCheckIn[],
    startDate: string,
    endDate: string,
  ): CheckInStatistics {
    const totalCheckIns = checkIns.length;

    // Calculate averages
    const bleedingValues = checkIns
      .map((c) => c.bleeding)
      .filter((v): v is number => v !== undefined);
    const painValues = checkIns
      .map((c) => c.pain)
      .filter((v): v is number => v !== undefined);

    const averages = {
      bleeding:
        bleedingValues.length > 0
          ? bleedingValues.reduce((sum, val) => sum + val, 0) / bleedingValues.length
          : undefined,
      pain:
        painValues.length > 0
          ? painValues.reduce((sum, val) => sum + val, 0) / painValues.length
          : undefined,
    };

    // Calculate trends
    const bleedingTrend: TrendData[] = checkIns.map((checkIn) => ({
      date: checkIn.date,
      value: checkIn.bleeding ?? null,
    }));

    const painTrend: TrendData[] = checkIns.map((checkIn) => ({
      date: checkIn.date,
      value: checkIn.pain ?? null,
    }));

    const mouthFeelingTrend: TrendData[] = checkIns.map((checkIn) => ({
      date: checkIn.date,
      value: checkIn.mouthFeeling ?? 'N/A',
    }));

    const hygieneHabitsTrend: TrendData[] = checkIns.map((checkIn) => {
      const habits: string[] = [];
      if (checkIn.interdentalBrushUsed) {
        habits.push('interdental brush');
      }
      if (checkIn.flossUsed) {
        habits.push('floss');
      }
      return {
        date: checkIn.date,
        value: habits.length > 0 ? habits.join(', ') : 'none',
      };
    });

    return {
      totalCheckIns,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      averages,
      trends: {
        bleeding: bleedingTrend,
        pain: painTrend,
        mouthFeeling: mouthFeelingTrend,
        hygieneHabits: hygieneHabitsTrend,
      },
    };
  }
}




