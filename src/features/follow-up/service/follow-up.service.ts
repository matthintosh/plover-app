import type { DiagnosisRepositoryPort } from '../repository/diagnosis.repository.interface';
import { DiagnosisRepository } from '../repository/diagnosis.repository';
import type { RiskFactorRepositoryPort } from '../repository/risk-factor.repository.interface';
import { RiskFactorRepository } from '../repository/risk-factor.repository';
import type { Diagnosis, RiskFactor } from './types';

export class FollowUpService {
  constructor(
    private readonly diagnosisRepository: DiagnosisRepositoryPort = new DiagnosisRepository(),
    private readonly riskFactorRepository: RiskFactorRepositoryPort = new RiskFactorRepository(),
  ) {}

  async getDiagnosisByPatientId(patientId: string): Promise<Diagnosis | null> {
    const diagnosis = await this.diagnosisRepository.getDiagnosisByPatientId(patientId);

    if (!diagnosis) {
      return null;
    }

    return {
      id: diagnosis.id,
      patientId: diagnosis.patientId,
      type: diagnosis.type,
      grade: diagnosis.grade,
      stage: diagnosis.stage,
      enteredBy: diagnosis.enteredBy,
      enteredAt: diagnosis.enteredAt,
      updatedAt: diagnosis.updatedAt,
    };
  }

  async getRiskFactorsByPatientId(patientId: string): Promise<RiskFactor[]> {
    const riskFactors = await this.riskFactorRepository.listRiskFactorsByPatientId(patientId);

    return riskFactors.map((riskFactor) => ({
      id: riskFactor.id,
      patientId: riskFactor.patientId,
      type: riskFactor.type,
      details: riskFactor.details,
      enteredBy: riskFactor.enteredBy,
      enteredAt: riskFactor.enteredAt,
      updatedAt: riskFactor.updatedAt,
    }));
  }
}

