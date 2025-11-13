import { FollowUpService } from '../follow-up.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('FollowUpService', () => {
  const createService = ({
    diagnosisReturnValue = null,
    riskFactorReturnValue = [],
  }: {
    diagnosisReturnValue?: any;
    riskFactorReturnValue?: any[];
  }) => {
    const diagnosisRepository = {
      getDiagnosisByPatientId: jest.fn().mockResolvedValue(diagnosisReturnValue),
    };
    const riskFactorRepository = {
      listRiskFactorsByPatientId: jest.fn().mockResolvedValue(riskFactorReturnValue),
    };

    return {
      service: new FollowUpService(
        diagnosisRepository as any,
        riskFactorRepository as any,
      ),
      diagnosisRepository,
      riskFactorRepository,
    };
  };

  it('returns diagnosis for patient when available', async () => {
    const mockDiagnosis = {
      id: 'diagnosis-1',
      patientId: 'patient-1',
      type: 'periodontitis',
      grade: 2,
      stage: 3,
      enteredBy: 'periodontist-1',
      enteredAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    };

    const { service, diagnosisRepository } = createService({
      diagnosisReturnValue: mockDiagnosis,
    });

    const result = await service.getDiagnosisByPatientId('patient-1');

    expect(diagnosisRepository.getDiagnosisByPatientId).toHaveBeenCalledWith('patient-1');
    expect(result).toEqual(mockDiagnosis);
  });

  it('returns risk factors for patient when available', async () => {
    const mockRiskFactors = [
      {
        id: 'risk-1',
        patientId: 'patient-1',
        type: 'diabetes',
        details: null,
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      },
    ];

    const { service, riskFactorRepository } = createService({
      riskFactorReturnValue: mockRiskFactors,
    });

    const result = await service.getRiskFactorsByPatientId('patient-1');

    expect(riskFactorRepository.listRiskFactorsByPatientId).toHaveBeenCalledWith('patient-1');
    expect(result).toEqual(mockRiskFactors);
  });

  it('returns null diagnosis when repository returns null', async () => {
    const { service } = createService({ diagnosisReturnValue: null });

    const result = await service.getDiagnosisByPatientId('patient-2');

    expect(result).toBeNull();
  });
});

