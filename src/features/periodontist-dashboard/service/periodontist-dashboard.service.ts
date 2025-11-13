import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { Diagnosis } from '@/features/follow-up/service/types';
import type {
  PeriodontistDiagnosisRepositoryPort,
  DiagnosisRecord,
} from '../repository/diagnosis.repository.interface';
import { DiagnosisRepository } from '../repository/diagnosis.repository';
import type {
  PeriodontistRiskFactorRepositoryPort,
  RiskFactorRecord,
} from '../repository/risk-factor.repository.interface';
import { RiskFactorRepository } from '../repository/risk-factor.repository';
import type {
  AddRiskFactorInput,
  CreateOrUpdateDiagnosisInput,
  RemoveRiskFactorInput,
} from './types';

export class PeriodontistDashboardService {
  constructor(
    private readonly diagnosisRepository: PeriodontistDiagnosisRepositoryPort = new DiagnosisRepository(),
    private readonly riskFactorRepository: PeriodontistRiskFactorRepositoryPort = new RiskFactorRepository(),
  ) {}

  private static validateDiagnosisInput(input: CreateOrUpdateDiagnosisInput) {
    if (input.type === 'periodontitis') {
      if (input.grade == null || input.stage == null) {
        throw new AppError(
          ErrorCodes.INVALID_INPUT,
          'Grade and stage are required for periodontitis diagnoses.',
        );
      }

      if (input.grade < 1 || input.grade > 4 || input.stage < 1 || input.stage > 4) {
        throw new AppError(
          ErrorCodes.INVALID_INPUT,
          'Grade and stage must be between 1 and 4 for periodontitis.',
        );
      }
    }

    if (input.type === 'gingivitis') {
      input.grade = null;
      input.stage = null;
    }
  }

  private static validateRiskFactorInput(input: AddRiskFactorInput) {
    if (input.type === 'tobacco_use') {
      const level = input.details?.level;

      if (level !== 'below_10' && level !== 'above_10') {
        throw new AppError(
          ErrorCodes.INVALID_INPUT,
          'Tobacco use requires selecting usage level.',
        );
      }
    }
  }

  async createOrUpdateDiagnosis(input: CreateOrUpdateDiagnosisInput): Promise<Diagnosis> {
    PeriodontistDashboardService.validateDiagnosisInput(input);

    const record: DiagnosisRecord = await this.diagnosisRepository.upsertDiagnosis({
      patientId: input.patientId,
      enteredBy: input.periodontistId,
      type: input.type,
      grade: input.type === 'periodontitis' ? input.grade : null,
      stage: input.type === 'periodontitis' ? input.stage : null,
      notes: input.notes ?? null,
    });

    return {
      id: record.id,
      patientId: record.patientId,
      type: record.type,
      grade: record.grade,
      stage: record.stage,
      enteredBy: record.enteredBy,
      enteredAt: record.enteredAt,
      updatedAt: record.updatedAt,
    };
  }

  async addRiskFactor(input: AddRiskFactorInput) {
    PeriodontistDashboardService.validateRiskFactorInput(input);

    const record: RiskFactorRecord = await this.riskFactorRepository.addRiskFactor(input);

    return record;
  }

  async removeRiskFactor(input: RemoveRiskFactorInput) {
    await this.riskFactorRepository.removeRiskFactor({
      riskFactorId: input.riskFactorId,
      periodontistId: input.periodontistId,
    });
  }
}

