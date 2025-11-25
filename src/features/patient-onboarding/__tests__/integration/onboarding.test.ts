import { supabase } from '../../../../lib/supabase/client';
import { OnboardingRepository } from '../../repository/onboarding.repository';
import { OnboardingService } from '../../service/onboarding.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('Onboarding Integration - Questionnaire Flow', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits onboarding response through repository and service', async () => {
    const getMaybeSingleMock = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const getEqMock = jest.fn(() => ({ maybeSingle: getMaybeSingleMock }));
    const getSelectMock = jest.fn(() => ({ eq: getEqMock }));

    const createSingleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'onboarding-1',
        patient_id: 'patient-1',
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxism_clenching: false,
        completed_at: '2025-01-15T10:00:00Z',
      },
      error: null,
    });
    const createInsertMock = jest.fn(() => ({
      select: jest.fn(() => ({ single: createSingleMock })),
    }));

    (mockedSupabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'onboarding_response') {
        return {
          select: getSelectMock,
          eq: getEqMock,
          maybeSingle: getMaybeSingleMock,
          insert: createInsertMock,
        } as any;
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const service = new OnboardingService(new OnboardingRepository());

    const input = {
      age: 35,
      diet: 'Balanced diet',
      sleep: '7-8 hours',
      bruxismClenching: false,
    };

    const result = await service.submitOnboardingResponse('patient-1', input);

    expect(getSelectMock).toHaveBeenCalledWith('*');
    expect(getEqMock).toHaveBeenCalledWith('patient_id', 'patient-1');
    expect(createInsertMock).toHaveBeenCalledWith({
      patient_id: 'patient-1',
      age: 35,
      diet: 'Balanced diet',
      sleep: '7-8 hours',
      bruxism_clenching: false,
    });

    expect(result).toEqual({
      id: 'onboarding-1',
      patientId: 'patient-1',
      age: 35,
      diet: 'Balanced diet',
      sleep: '7-8 hours',
      bruxismClenching: false,
      completedAt: '2025-01-15T10:00:00Z',
    });
  });

  it('prevents duplicate onboarding submissions', async () => {
    const getMaybeSingleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'onboarding-1',
        patient_id: 'patient-1',
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxism_clenching: false,
        completed_at: '2025-01-15T10:00:00Z',
      },
      error: null,
    });
    const getEqMock = jest.fn(() => ({ maybeSingle: getMaybeSingleMock }));
    const getSelectMock = jest.fn(() => ({ eq: getEqMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: getSelectMock,
      eq: getEqMock,
      maybeSingle: getMaybeSingleMock,
    } as any);

    const service = new OnboardingService(new OnboardingRepository());

    const input = {
      age: 40,
      diet: 'Vegetarian',
      sleep: '6-7 hours',
      bruxismClenching: true,
    };

    await expect(
      service.submitOnboardingResponse('patient-1', input),
    ).rejects.toMatchObject({
      code: 'ALREADY_COMPLETED',
    });
  });
});

