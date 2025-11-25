import type { DiagnosisRepositoryPort } from '../repository/diagnosis.repository.interface';
import { DiagnosisRepository } from '../repository/diagnosis.repository';
import type { RiskFactorRepositoryPort } from '../repository/risk-factor.repository.interface';
import { RiskFactorRepository } from '../repository/risk-factor.repository';
import type { RecommendationRepositoryPort } from '../repository/recommendation.repository.interface';
import { RecommendationRepository } from '../repository/recommendation.repository';
import type {
  Diagnosis,
  RiskFactor,
  OralHygieneRecommendation,
  OdontogramSpace,
} from './types';

export class FollowUpService {
  constructor(
    private readonly diagnosisRepository: DiagnosisRepositoryPort = new DiagnosisRepository(),
    private readonly riskFactorRepository: RiskFactorRepositoryPort = new RiskFactorRepository(),
    private readonly recommendationRepository: RecommendationRepositoryPort = new RecommendationRepository(),
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

  async getRecommendationByPatientId(
    patientId: string,
  ): Promise<OralHygieneRecommendation | null> {
    return await this.recommendationRepository.getRecommendationByPatientId(patientId);
  }

  async createOrUpdateRecommendation(
    patientId: string,
    periodontistId: string,
    data: {
      toothbrushType?: string;
      toothbrushBrand?: string;
      toothbrushModel?: string;
      odontogram?: {
        spaces: OdontogramSpace[];
      };
    },
  ): Promise<OralHygieneRecommendation> {
    return await this.recommendationRepository.createOrUpdateRecommendation(
      patientId,
      periodontistId,
      data,
    );
  }
}

