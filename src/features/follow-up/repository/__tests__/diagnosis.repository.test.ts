import { supabase } from '../../../../lib/supabase/client';
import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { DiagnosisRepository } from '../diagnosis.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('DiagnosisRepository', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns mapped diagnosis when record is found', async () => {
    const maybeSingleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'diagnosis-1',
        patient_id: 'patient-1',
        type: 'periodontitis',
        grade: 2,
        stage: 3,
        entered_by: 'periodontist-1',
        entered_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
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

    const repository = new DiagnosisRepository();

    const result = await repository.getDiagnosisByPatientId('patient-1');

    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('patient_id', 'patient-1');
    expect(result).toEqual({
      id: 'diagnosis-1',
      patientId: 'patient-1',
      type: 'periodontitis',
      grade: 2,
      stage: 3,
      enteredBy: 'periodontist-1',
      enteredAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    });
  });

  it('returns null when no diagnosis exists for patient', async () => {
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

    const repository = new DiagnosisRepository();

    const result = await repository.getDiagnosisByPatientId('patient-2');

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

    const repository = new DiagnosisRepository();

    await expect(repository.getDiagnosisByPatientId('patient-3')).rejects.toMatchObject({
      code: ErrorCodes.NETWORK_ERROR,
    });
  });
});

