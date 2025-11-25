import { supabase } from '../../../../lib/supabase/client';
import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { OnboardingRepository } from '../onboarding.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('OnboardingRepository', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOnboardingResponseByPatientId', () => {
    it('returns mapped onboarding response when record is found', async () => {
      const maybeSingleMock = jest.fn().mockResolvedValue({
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

      const eqMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
      const selectMock = jest.fn(() => ({ eq: eqMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      } as any);

      const repository = new OnboardingRepository();

      const result = await repository.getOnboardingResponseByPatientId('patient-1');

      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('patient_id', 'patient-1');
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

    it('returns null when no onboarding response exists for patient', async () => {
      const maybeSingleMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const eqMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
      const selectMock = jest.fn(() => ({ eq: eqMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      } as any);

      const repository = new OnboardingRepository();

      const result = await repository.getOnboardingResponseByPatientId('patient-2');

      expect(result).toBeNull();
    });

    it('throws AppError when supabase returns an error', async () => {
      const maybeSingleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'RLS violation' },
      });

      const eqMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
      const selectMock = jest.fn(() => ({ eq: eqMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqMock,
        maybeSingle: maybeSingleMock,
      } as any);

      const repository = new OnboardingRepository();

      await expect(
        repository.getOnboardingResponseByPatientId('patient-3'),
      ).rejects.toMatchObject({
        code: ErrorCodes.NETWORK_ERROR,
      });
    });
  });

  describe('createOnboardingResponse', () => {
    it('creates and returns mapped onboarding response', async () => {
      const singleMock = jest.fn().mockResolvedValue({
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

      const insertMock = jest.fn(() => ({ select: jest.fn(() => ({ single: singleMock })) }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        insert: insertMock,
        select: jest.fn(() => ({ single: singleMock })),
      } as any);

      const repository = new OnboardingRepository();

      const result = await repository.createOnboardingResponse('patient-1', {
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: false,
      });

      expect(insertMock).toHaveBeenCalledWith({
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

    it('throws AppError when supabase returns an error', async () => {
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Unique constraint violation' },
      });

      const insertMock = jest.fn(() => ({ select: jest.fn(() => ({ single: singleMock })) }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        insert: insertMock,
        select: jest.fn(() => ({ single: singleMock })),
      } as any);

      const repository = new OnboardingRepository();

      await expect(
        repository.createOnboardingResponse('patient-1', {
          age: 35,
          diet: 'Balanced diet',
          sleep: '7-8 hours',
          bruxismClenching: false,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.NETWORK_ERROR,
      });
    });
  });
});

