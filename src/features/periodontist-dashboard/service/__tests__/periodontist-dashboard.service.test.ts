import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import { PeriodontistDashboardService } from '../periodontist-dashboard.service';
import type { DiagnosisRecord } from '../../repository/diagnosis.repository.interface';
import type { RiskFactorRecord } from '../../repository/risk-factor.repository.interface';

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('PeriodontistDashboardService', () => {
  const createService = () => {
    const diagnosisRepository = {
      upsertDiagnosis: jest.fn().mockResolvedValue({
        id: 'diagnosis-1',
        patientId: 'patient-1',
        type: 'periodontitis',
        grade: 2,
        stage: 3,
        notes: null,
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      } satisfies DiagnosisRecord),
      deleteDiagnosis: jest.fn(),
    };

    const riskFactorRepository = {
      addRiskFactor: jest.fn().mockResolvedValue({
        id: 'risk-1',
        patientId: 'patient-1',
        type: 'tobacco_use',
        details: { level: 'above_10' },
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      } satisfies RiskFactorRecord),
      removeRiskFactor: jest.fn(),
      listByPatientId: jest.fn(),
    };

    const service = new PeriodontistDashboardService(
      diagnosisRepository as any,
      riskFactorRepository as any,
    );

    return { service, diagnosisRepository, riskFactorRepository };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates or updates diagnosis with required grade and stage for periodontitis', async () => {
    const { service, diagnosisRepository } = createService();

    const result = await service.createOrUpdateDiagnosis({
      patientId: 'patient-1',
      periodontistId: 'periodontist-1',
      type: 'periodontitis',
      grade: 2,
      stage: 3,
    });

    expect(diagnosisRepository.upsertDiagnosis).toHaveBeenCalledWith({
      patientId: 'patient-1',
      enteredBy: 'periodontist-1',
      type: 'periodontitis',
      grade: 2,
      stage: 3,
      notes: null,
    });
    expect(result.type).toBe('periodontitis');
  });

  it('throws INVALID_INPUT when grade or stage missing for periodontitis', async () => {
    const { service } = createService();

    await expect(
      service.createOrUpdateDiagnosis({
        patientId: 'patient-1',
        periodontistId: 'periodontist-1',
        type: 'periodontitis',
        grade: null,
        stage: 3,
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.INVALID_INPUT,
    });
  });

  it('adds risk factor with required tobacco level', async () => {
    const { service, riskFactorRepository } = createService();

    const result = await service.addRiskFactor({
      patientId: 'patient-1',
      periodontistId: 'periodontist-1',
      type: 'tobacco_use',
      details: { level: 'above_10' },
    });

    expect(riskFactorRepository.addRiskFactor).toHaveBeenCalledWith({
      patientId: 'patient-1',
      periodontistId: 'periodontist-1',
      type: 'tobacco_use',
      details: { level: 'above_10' },
    });
    expect(result.details).toEqual({ level: 'above_10' });
  });

  it('throws INVALID_INPUT when tobacco risk factor missing level detail', async () => {
    const { service } = createService();

    await expect(
      service.addRiskFactor({
        patientId: 'patient-1',
        periodontistId: 'periodontist-1',
        type: 'tobacco_use',
        details: {},
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('removes risk factor via repository', async () => {
    const { service, riskFactorRepository } = createService();

    await service.removeRiskFactor({
      riskFactorId: 'risk-1',
      periodontistId: 'periodontist-1',
    });

    expect(riskFactorRepository.removeRiskFactor).toHaveBeenCalledWith({
      riskFactorId: 'risk-1',
      periodontistId: 'periodontist-1',
    });
  });
});

