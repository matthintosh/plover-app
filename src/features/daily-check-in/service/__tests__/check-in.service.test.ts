import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { CheckInService } from '../check-in.service';

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

describe('CheckInService', () => {
  const createService = ({
    repositoryReturnValue = null,
    createReturnValue = null,
    dateRangeReturnValue = [],
  }: {
    repositoryReturnValue?: any;
    createReturnValue?: any;
    dateRangeReturnValue?: any[];
  }) => {
    const checkInRepository = {
      getCheckInByDate: jest.fn().mockResolvedValue(repositoryReturnValue),
      getCheckInsByDateRange: jest.fn().mockResolvedValue(dateRangeReturnValue),
      createOrUpdateCheckIn: jest.fn().mockResolvedValue(createReturnValue),
    };

    return {
      service: new CheckInService(checkInRepository as any),
      checkInRepository,
    };
  };

  describe('getCheckInByDate', () => {
    it('returns check-in for date when available', async () => {
      const mockCheckIn = {
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
      };

      const { service, checkInRepository } = createService({
        repositoryReturnValue: mockCheckIn,
      });

      const result = await service.getCheckInByDate('patient-1', '2025-01-15');

      expect(checkInRepository.getCheckInByDate).toHaveBeenCalledWith(
        'patient-1',
        '2025-01-15',
      );
      expect(result).toEqual(mockCheckIn);
    });

    it('returns null when repository returns null', async () => {
      const { service } = createService({ repositoryReturnValue: null });

      const result = await service.getCheckInByDate('patient-1', '2025-01-15');

      expect(result).toBeNull();
    });
  });

  describe('getCheckInsByDateRange', () => {
    it('returns check-ins for date range', async () => {
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
      ];

      const { service, checkInRepository } = createService({
        dateRangeReturnValue: mockCheckIns,
      });

      const result = await service.getCheckInsByDateRange(
        'patient-1',
        '2025-01-15',
        '2025-01-16',
      );

      expect(checkInRepository.getCheckInsByDateRange).toHaveBeenCalledWith(
        'patient-1',
        '2025-01-15',
        '2025-01-16',
      );
      expect(result).toEqual(mockCheckIns);
    });

    it('validates date range', async () => {
      const { service } = createService({});

      await expect(
        service.getCheckInsByDateRange('patient-1', '2025-01-16', '2025-01-15'),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });
    });
  });

  describe('createOrUpdateCheckIn', () => {
    it('creates check-in successfully', async () => {
      const mockCreatedCheckIn = {
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
      };

      const { service, checkInRepository } = createService({
        createReturnValue: mockCreatedCheckIn,
      });

      const input = {
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
      };

      const result = await service.createOrUpdateCheckIn('patient-1', input);

      expect(checkInRepository.createOrUpdateCheckIn).toHaveBeenCalledWith(
        'patient-1',
        input,
      );
      expect(result).toEqual(mockCreatedCheckIn);
    });

    it('validates bleeding range', async () => {
      const { service } = createService({});

      await expect(
        service.createOrUpdateCheckIn('patient-1', {
          date: '2025-01-15',
          bleeding: 11,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });

      await expect(
        service.createOrUpdateCheckIn('patient-1', {
          date: '2025-01-15',
          bleeding: -1,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });
    });

    it('validates pain range', async () => {
      const { service } = createService({});

      await expect(
        service.createOrUpdateCheckIn('patient-1', {
          date: '2025-01-15',
          pain: 11,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });

      await expect(
        service.createOrUpdateCheckIn('patient-1', {
          date: '2025-01-15',
          pain: -1,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });
    });

    it('prevents future dates', async () => {
      const { service } = createService({});

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      await expect(
        service.createOrUpdateCheckIn('patient-1', {
          date: tomorrowStr,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.FUTURE_DATE,
      });
    });

    it('defaults to today if date not provided', async () => {
      const mockCreatedCheckIn = {
        id: 'checkin-1',
        patientId: 'patient-1',
        date: new Date().toISOString().split('T')[0],
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { service, checkInRepository } = createService({
        createReturnValue: mockCreatedCheckIn,
      });

      const input = {
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
      };

      await service.createOrUpdateCheckIn('patient-1', input);

      const callArgs = checkInRepository.createOrUpdateCheckIn.mock.calls[0];
      expect(callArgs[1].date).toBeDefined();
      expect(new Date(callArgs[1].date).getTime()).toBeLessThanOrEqual(
        new Date().getTime(),
      );
    });
  });
});

