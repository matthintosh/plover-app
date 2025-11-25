import { supabase } from '../../../../lib/supabase/client';
import { CheckInRepository } from '../../repository/check-in.repository';
import { CheckInService } from '../../service/check-in.service';

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

describe('CheckIn Integration - Daily Check-in Flow', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates check-in through repository and service', async () => {
    const getMaybeSingleMock = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const getEqMock = jest.fn(() => ({ maybeSingle: getMaybeSingleMock }));
    const getSelectMock = jest.fn(() => ({ eq: getEqMock }));

    const createSingleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'checkin-1',
        patient_id: 'patient-1',
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouth_feeling: 'Good',
        interdental_brush_used: true,
        floss_used: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
      error: null,
    });

    const selectMock = jest.fn(() => ({ single: createSingleMock }));
    const upsertMock = jest.fn(() => ({ select: selectMock }));

    (mockedSupabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'daily_check_in') {
        return {
          select: getSelectMock,
          eq: getEqMock,
          maybeSingle: getMaybeSingleMock,
          upsert: upsertMock,
        } as any;
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const service = new CheckInService(new CheckInRepository());

    const input = {
      date: '2025-01-15',
      bleeding: 3,
      pain: 2,
      mouthFeeling: 'Good',
      interdentalBrushUsed: true,
      flossUsed: false,
    };

    const result = await service.createOrUpdateCheckIn('patient-1', input);

    expect(upsertMock).toHaveBeenCalled();
    expect(result).toEqual({
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
    });
  });

  it('updates existing check-in for the same date', async () => {
    const getMaybeSingleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'checkin-1',
        patient_id: 'patient-1',
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouth_feeling: 'Good',
        interdental_brush_used: true,
        floss_used: false,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
      error: null,
    });
    const getEqMock = jest.fn(() => ({ maybeSingle: getMaybeSingleMock }));
    const getSelectMock = jest.fn(() => ({ eq: getEqMock }));

    const updateSingleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'checkin-1',
        patient_id: 'patient-1',
        date: '2025-01-15',
        bleeding: 5,
        pain: 4,
        mouth_feeling: 'Better',
        interdental_brush_used: true,
        floss_used: true,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T11:00:00Z',
      },
      error: null,
    });

    const selectMock = jest.fn(() => ({ single: updateSingleMock }));
    const upsertMock = jest.fn(() => ({ select: selectMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: getSelectMock,
      eq: getEqMock,
      maybeSingle: getMaybeSingleMock,
      upsert: upsertMock,
    } as any);

    const service = new CheckInService(new CheckInRepository());

    const input = {
      date: '2025-01-15',
      bleeding: 5,
      pain: 4,
      mouthFeeling: 'Better',
      interdentalBrushUsed: true,
      flossUsed: true,
    };

    const result = await service.createOrUpdateCheckIn('patient-1', input);

    expect(upsertMock).toHaveBeenCalled();
    expect(result.bleeding).toBe(5);
    expect(result.pain).toBe(4);
    expect(result.mouthFeeling).toBe('Better');
  });
});

