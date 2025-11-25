import { AppError, ErrorCodes } from '../../../../lib/utils/error-handling';
import { CheckInService } from '../../service/check-in.service';
import * as offlineSync from '../../../../lib/utils/offline-sync';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

jest.mock('../../../../lib/utils/offline-sync', () => ({
  isOnline: jest.fn(),
  queueOperation: jest.fn(),
}));

describe('CheckIn Integration - Offline Sync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queues check-in when offline', async () => {
    (offlineSync.isOnline as jest.Mock).mockReturnValue(false);
    (offlineSync.queueOperation as jest.Mock).mockResolvedValue({
      id: 'op-1',
      type: 'check-in',
      payload: { patientId: 'patient-1', input: {} },
      timestamp: Date.now(),
      retries: 0,
    });

    const service = new CheckInService();

    const input = {
      date: '2025-01-15',
      bleeding: 3,
      pain: 2,
    };

    await expect(
      service.createOrUpdateCheckIn('patient-1', input),
    ).rejects.toMatchObject({
      code: 'OFFLINE_QUEUED',
    });

    expect(offlineSync.queueOperation).toHaveBeenCalledWith('check-in', {
      patientId: 'patient-1',
      input,
    });
  });

  it('queues check-in when network error occurs', async () => {
    (offlineSync.isOnline as jest.Mock).mockReturnValue(true);
    (offlineSync.queueOperation as jest.Mock).mockResolvedValue({
      id: 'op-1',
      type: 'check-in',
      payload: { patientId: 'patient-1', input: {} },
      timestamp: Date.now(),
      retries: 0,
    });

    const checkInRepository = {
      createOrUpdateCheckIn: jest.fn().mockRejectedValue(
        new AppError(ErrorCodes.NETWORK_ERROR, 'Network error'),
      ),
    };

    const service = new CheckInService(checkInRepository as any);

    const input = {
      date: '2025-01-15',
      bleeding: 3,
      pain: 2,
    };

    await expect(
      service.createOrUpdateCheckIn('patient-1', input),
    ).rejects.toMatchObject({
      code: 'OFFLINE_QUEUED',
    });

    expect(offlineSync.queueOperation).toHaveBeenCalledWith('check-in', {
      patientId: 'patient-1',
      input,
    });
  });
});

