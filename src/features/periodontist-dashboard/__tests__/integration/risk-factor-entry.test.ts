import { supabase } from '../../../../lib/supabase/client';
import { PeriodontistDashboardService } from '../../service/periodontist-dashboard.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('Periodontist Dashboard Integration - Risk Factor Entry', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds and removes risk factors via Supabase', async () => {
    const insertMock = jest.fn().mockReturnValue({
      select: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'risk-1',
            patient_id: 'patient-1',
            type: 'tobacco_use',
            details: { level: 'above_10' },
            entered_by: 'periodontist-1',
            entered_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-02T00:00:00Z',
          },
          error: null,
        }),
      })),
    });

    const deleteMock = jest.fn().mockReturnValue({
      eq: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    });

    (mockedSupabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'risk_factor') {
        return {
          insert: insertMock,
          delete: deleteMock,
        } as any;
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const service = new PeriodontistDashboardService();

    const added = await service.addRiskFactor({
      patientId: 'patient-1',
      periodontistId: 'periodontist-1',
      type: 'tobacco_use',
      details: { level: 'above_10' },
    });

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        patient_id: 'patient-1',
        type: 'tobacco_use',
        details: { level: 'above_10' },
        entered_by: 'periodontist-1',
      }),
    );
    expect(added.id).toBe('risk-1');

    await service.removeRiskFactor({
      riskFactorId: 'risk-1',
      periodontistId: 'periodontist-1',
    });

    expect(deleteMock).toHaveBeenCalled();
  });
});

