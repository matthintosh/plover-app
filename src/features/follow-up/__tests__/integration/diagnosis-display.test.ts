import { supabase } from '../../../../lib/supabase/client';
import { DiagnosisRepository } from '../../repository/diagnosis.repository';
import { RiskFactorRepository } from '../../repository/risk-factor.repository';
import { FollowUpService } from '../../service/follow-up.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('FollowUp Integration - Diagnosis Display Flow', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves diagnosis and risk factors for a patient through repositories', async () => {
    const diagnosisMaybeSingleMock = jest.fn().mockResolvedValue({
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
    const diagnosisEqMock = jest.fn(() => ({ maybeSingle: diagnosisMaybeSingleMock }));
    const diagnosisSelectMock = jest.fn(() => ({ eq: diagnosisEqMock }));

    const riskFactorOrderMock = jest.fn().mockResolvedValue({
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
      ],
      error: null,
    });
    const riskFactorEqMock = jest.fn(() => ({ order: riskFactorOrderMock }));
    const riskFactorSelectMock = jest.fn(() => ({ eq: riskFactorEqMock }));

    (mockedSupabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'diagnosis') {
        return {
          select: diagnosisSelectMock,
          eq: diagnosisEqMock,
          maybeSingle: diagnosisMaybeSingleMock,
        } as any;
      }

      if (table === 'risk_factor') {
        return {
          select: riskFactorSelectMock,
          eq: riskFactorEqMock,
          order: riskFactorOrderMock,
        } as any;
      }

      throw new Error(`Unexpected table ${table}`);
    });

    const service = new FollowUpService(new DiagnosisRepository(), new RiskFactorRepository());

    const diagnosis = await service.getDiagnosisByPatientId('patient-1');
    const riskFactors = await service.getRiskFactorsByPatientId('patient-1');

    expect(diagnosisSelectMock).toHaveBeenCalledWith('*');
    expect(diagnosisEqMock).toHaveBeenNthCalledWith(1, 'patient_id', 'patient-1');
    expect(riskFactorSelectMock).toHaveBeenCalledWith('*');
    expect(riskFactorEqMock).toHaveBeenNthCalledWith(1, 'patient_id', 'patient-1');
    expect(riskFactorOrderMock).toHaveBeenCalled();

    expect(diagnosis).toEqual({
      id: 'diagnosis-1',
      patientId: 'patient-1',
      type: 'periodontitis',
      grade: 2,
      stage: 3,
      enteredBy: 'periodontist-1',
      enteredAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    });
    expect(riskFactors).toEqual([
      {
        id: 'risk-1',
        patientId: 'patient-1',
        type: 'diabetes',
        details: null,
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      },
    ]);
  });
});

