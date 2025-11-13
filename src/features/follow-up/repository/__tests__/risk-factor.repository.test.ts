import { supabase } from '../../../../lib/supabase/client';
import { RiskFactorRepository } from '../risk-factor.repository';
import { ErrorCodes } from '../../../../lib/utils/error-handling';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('RiskFactorRepository', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns mapped risk factors by patient id', async () => {
    const orderMock = jest.fn().mockResolvedValue({
      data: [
        {
          id: 'risk-1',
          patient_id: 'patient-1',
          type: 'diabetes',
          details: null,
          entered_by: 'periodontist-1',
          entered_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
        },
        {
          id: 'risk-2',
          patient_id: 'patient-1',
          type: 'tobacco_use',
          details: { level: 'above_10' },
          entered_by: 'periodontist-1',
          entered_at: '2025-01-03T00:00:00Z',
          updated_at: '2025-01-04T00:00:00Z',
        },
      ],
      error: null,
    });
    const eqMock = jest.fn(() => ({ order: orderMock }));
    const selectMock = jest.fn(() => ({ eq: eqMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: selectMock,
      eq: eqMock,
    } as any);

    const repository = new RiskFactorRepository();

    const result = await repository.listRiskFactorsByPatientId('patient-1');

    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('patient_id', 'patient-1');
    expect(orderMock).toHaveBeenCalledWith('entered_at', { ascending: false });
    expect(result).toEqual([
      {
        id: 'risk-1',
        patientId: 'patient-1',
        type: 'diabetes',
        details: null,
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      },
      {
        id: 'risk-2',
        patientId: 'patient-1',
        type: 'tobacco_use',
        details: { level: 'above_10' },
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-04T00:00:00Z',
      },
    ]);
  });

  it('returns empty array when no risk factors exist', async () => {
    const orderMock = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const eqMock = jest.fn(() => ({ order: orderMock }));
    const selectMock = jest.fn(() => ({ eq: eqMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: selectMock,
      eq: eqMock,
    } as any);

    const repository = new RiskFactorRepository();

    const result = await repository.listRiskFactorsByPatientId('patient-2');

    expect(result).toEqual([]);
    expect(orderMock).toHaveBeenCalledWith('entered_at', { ascending: false });
  });

  it('throws AppError when supabase returns error', async () => {
    const orderMock = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'RLS violation' },
    });
    const eqMock = jest.fn(() => ({ order: orderMock }));
    const selectMock = jest.fn(() => ({ eq: eqMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: selectMock,
      eq: eqMock,
    } as any);

    const repository = new RiskFactorRepository();

    await expect(repository.listRiskFactorsByPatientId('patient-3')).rejects.toMatchObject({
      code: ErrorCodes.NETWORK_ERROR,
    });
    expect(orderMock).toHaveBeenCalledWith('entered_at', { ascending: false });
  });
});

