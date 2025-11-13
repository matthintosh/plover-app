import { supabase } from '../../../../lib/supabase/client';
import { PeriodontistDashboardService } from '../../service/periodontist-dashboard.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('Periodontist Dashboard Integration - Diagnosis Entry', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates diagnosis via Supabase upsert flow', async () => {
    const singleMock = jest.fn().mockResolvedValue({
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
    const selectMock = jest.fn(() => ({ single: singleMock }));
    const upsertMock = jest.fn(() => ({ select: selectMock }));

    (mockedSupabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'diagnosis') {
        return {
          upsert: upsertMock,
        } as any;
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const service = new PeriodontistDashboardService();

    const result = await service.createOrUpdateDiagnosis({
      patientId: 'patient-1',
      periodontistId: 'periodontist-1',
      type: 'periodontitis',
      grade: 2,
      stage: 3,
    });

    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        patient_id: 'patient-1',
        entered_by: 'periodontist-1',
        type: 'periodontitis',
        grade: 2,
        stage: 3,
      }),
      { onConflict: 'patient_id' },
    );

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
});

