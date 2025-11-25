import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import { isOnline, queueOperation } from '@/lib/utils/offline-sync';
import type { CheckInRepositoryPort } from '../repository/check-in.repository.interface';
import { CheckInRepository } from '../repository/check-in.repository';
import type { CheckInInput, DailyCheckIn } from './types';

export class CheckInService {
  constructor(
    private readonly checkInRepository: CheckInRepositoryPort = new CheckInRepository(),
  ) {}

  async getCheckInByDate(patientId: string, date: string): Promise<DailyCheckIn | null> {
    const checkIn = await this.checkInRepository.getCheckInByDate(patientId, date);

    if (!checkIn) {
      return null;
    }

    return this.mapRecordToCheckIn(checkIn);
  }

  async getCheckInsByDateRange(
    patientId: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyCheckIn[]> {
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'Start date must be before or equal to end date',
      );
    }

    const checkIns = await this.checkInRepository.getCheckInsByDateRange(
      patientId,
      startDate,
      endDate,
    );

    return checkIns.map(this.mapRecordToCheckIn);
  }

  async createOrUpdateCheckIn(
    patientId: string,
    data: CheckInInput,
  ): Promise<DailyCheckIn> {
    // Validate input
    this.validateCheckInInput(data);

    // Get timezone-aware date (defaults to today)
    const checkInDate = data.date || this.getTodayDateString();

    // Validate date is not in the future
    const checkInDateObj = new Date(checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkInDateObj.setHours(0, 0, 0, 0);

    if (checkInDateObj > today) {
      throw new AppError(
        ErrorCodes.FUTURE_DATE,
        'Cannot create check-in for future date',
      );
    }

    // Prepare input with date
    const input: CheckInInput = {
      ...data,
      date: checkInDate,
    };

    // Check if online
    if (!isOnline()) {
      // Queue for offline sync
      await queueOperation('check-in', {
        patientId,
        input,
      });

      throw new AppError(
        ErrorCodes.OFFLINE_QUEUED,
        'Check-in queued for sync when connection is restored',
      );
    }

    try {
      const checkIn = await this.checkInRepository.createOrUpdateCheckIn(patientId, input);
      return this.mapRecordToCheckIn(checkIn);
    } catch (error) {
      // If network error and we thought we were online, queue it
      if (error instanceof AppError && error.code === ErrorCodes.NETWORK_ERROR) {
        await queueOperation('check-in', {
          patientId,
          input,
        });
        throw new AppError(
          ErrorCodes.OFFLINE_QUEUED,
          'Check-in queued for sync when connection is restored',
        );
      }
      throw error;
    }
  }

  private validateCheckInInput(data: CheckInInput): void {
    // Validate bleeding range (0-10)
    if (data.bleeding !== undefined) {
      if (data.bleeding < 0 || data.bleeding > 10) {
        throw new AppError(
          ErrorCodes.INVALID_INPUT,
          'Bleeding level must be between 0 and 10',
        );
      }
    }

    // Validate pain range (0-10)
    if (data.pain !== undefined) {
      if (data.pain < 0 || data.pain > 10) {
        throw new AppError(
          ErrorCodes.INVALID_INPUT,
          'Pain level must be between 0 and 10',
        );
      }
    }
  }

  private getTodayDateString(): string {
    // Get today's date in local timezone as YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private mapRecordToCheckIn(record: {
    id: string;
    patientId: string;
    date: string;
    bleeding?: number | null;
    pain?: number | null;
    mouthFeeling?: string | null;
    interdentalBrushUsed: boolean;
    flossUsed: boolean;
    createdAt: string;
    updatedAt: string;
  }): DailyCheckIn {
    return {
      id: record.id,
      patientId: record.patientId,
      date: record.date,
      bleeding: record.bleeding ?? undefined,
      pain: record.pain ?? undefined,
      mouthFeeling: record.mouthFeeling ?? undefined,
      interdentalBrushUsed: record.interdentalBrushUsed,
      flossUsed: record.flossUsed,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}

