import { supabase } from '../../../../lib/supabase/client';
import { PatientRepository } from '../patient.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('PatientRepository', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates patient linked to periodontist', async () => {
    const singleMock = jest.fn().mockResolvedValue({
      data: {
        id: 'patient-1',
        email: 'patient@example.com',
        periodontist_id: 'periodontist-1',
        onboarding_completed: false,
        account_status: 'pending',
        created_at: 'now',
        updated_at: 'now',
      },
      error: null,
    });

    const insertSpy = jest.fn(() => ({ select: jest.fn(() => ({ single: singleMock })) }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      insert: insertSpy,
      select: jest.fn(() => ({ single: singleMock })),
    } as any);

    const repository = new PatientRepository();

    const result = await repository.createPatientForPeriodontist({
      id: 'patient-1',
      email: 'patient@example.com',
      periodontistId: 'periodontist-1',
    });

    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'patient-1',
        periodontist_id: 'periodontist-1',
        email: 'patient@example.com',
      })
    );
    expect(result.id).toBe('patient-1');
  });

  it('lists patients by periodontist id', async () => {
    const eqMock = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'patient-1',
          email: 'patient@example.com',
          periodontist_id: 'periodontist-1',
          onboarding_completed: false,
          account_status: 'pending',
          created_at: 'now',
          updated_at: 'now',
        },
      ],
      error: null,
    });

    const selectMock = jest.fn(() => ({ eq: eqMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: selectMock,
    } as any);

    const repository = new PatientRepository();

    const result = await repository.listByPeriodontistId('periodontist-1');

    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('periodontist_id', 'periodontist-1');
    expect(result[0].periodontistId).toBe('periodontist-1');
  });

  it('finds patient by email', async () => {
    const maybeSingleMock = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    const selectMock = jest.fn(() => ({
      eq: jest.fn(() => ({ maybeSingle: maybeSingleMock })),
    }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: selectMock,
    } as any);

    const repository = new PatientRepository();

    const result = await repository.findByEmail('patient@example.com');

    expect(selectMock).toHaveBeenCalledWith('*');
    expect(result).toBeNull();
  });
});
