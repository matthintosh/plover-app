/**
 * Service Layer for Patient Diagnostic View
 * 
 * Provides business logic for formatting and transforming patient medical
 * information for display. Uses the repository layer for data access.
 */

import type { PatientDiagnosticViewRepository } from '../repository/patient-diagnostic-view.repository.interface';
import { PatientDiagnosticViewRepositoryImpl } from '../repository/patient-diagnostic-view.repository';
import type {
  DiagnosisDisplay,
  RiskFactorDisplay,
  OralHygieneRecommendationDisplay,
  ComprehensiveMedicalInfoDisplay,
  DiagnosisView,
  RiskFactorView,
  RiskFactorType,
  RiskFactorDetails,
  OralHygieneRecommendationView,
} from './types';
// Service interface is defined inline - no separate interface file needed
export interface PatientDiagnosticViewServiceInterface {
  getDiagnosis(): Promise<DiagnosisDisplay | null>;
  getRiskFactors(): Promise<RiskFactorDisplay[]>;
  getRecommendations(): Promise<OralHygieneRecommendationDisplay | null>;
  getComprehensiveMedicalInfo(): Promise<ComprehensiveMedicalInfoDisplay>;
}

export class PatientDiagnosticViewService
  implements PatientDiagnosticViewServiceInterface
{
  constructor(
    private readonly repository: PatientDiagnosticViewRepository = new PatientDiagnosticViewRepositoryImpl(),
  ) {}

  /**
   * Get formatted diagnosis for display
   */
  async getDiagnosis(): Promise<DiagnosisDisplay | null> {
    const diagnosis = await this.repository.getDiagnosis();
    if (!diagnosis) {
      return null;
    }

    return this.formatDiagnosis(diagnosis);
  }

  /**
   * Get formatted risk factors for display
   */
  async getRiskFactors(): Promise<RiskFactorDisplay[]> {
    const riskFactors = await this.repository.getRiskFactors();
    return riskFactors.map((rf) => this.formatRiskFactor(rf));
  }

  /**
   * Get formatted recommendations for display
   */
  async getRecommendations(): Promise<OralHygieneRecommendationDisplay | null> {
    const recommendation = await this.repository.getRecommendations();
    if (!recommendation) {
      return null;
    }

    return this.formatRecommendation(recommendation);
  }

  /**
   * Get all formatted medical information for comprehensive view
   */
  async getComprehensiveMedicalInfo(): Promise<ComprehensiveMedicalInfoDisplay> {
    const medicalInfo = await this.repository.getAllMedicalInfo();

    return {
      diagnosis: medicalInfo.diagnosis
        ? this.formatDiagnosis(medicalInfo.diagnosis)
        : null,
      riskFactors: medicalInfo.riskFactors.map((rf) =>
        this.formatRiskFactor(rf),
      ),
      recommendation: medicalInfo.recommendation
        ? this.formatRecommendation(medicalInfo.recommendation)
        : null,
      hasAnyData:
        !!medicalInfo.diagnosis ||
        medicalInfo.riskFactors.length > 0 ||
        !!medicalInfo.recommendation,
    };
  }

  /**
   * Format diagnosis for display
   */
  private formatDiagnosis(diagnosis: DiagnosisView): DiagnosisDisplay {
    return {
      type: diagnosis.type,
      displayLabel:
        diagnosis.type === 'gingivitis' ? 'Gingivitis' : 'Periodontitis',
      grade: diagnosis.grade,
      stage: diagnosis.stage,
      gradeLabel: diagnosis.grade ? `Grade ${diagnosis.grade}` : null,
      stageLabel: diagnosis.stage ? `Stage ${diagnosis.stage}` : null,
      lastUpdated: this.formatDate(diagnosis.updatedAt),
    };
  }

  /**
   * Format risk factor for display
   */
  private formatRiskFactor(riskFactor: RiskFactorView): RiskFactorDisplay {
    const typeLabels: Record<RiskFactorType, string> = {
      diabetes: 'Diabetes',
      tobacco_use: 'Tobacco Use',
      cardiovascular_disease: 'Cardiovascular Disease',
      cancer_hormonotherapy: 'Cancer with Hormonotherapy',
    };

    return {
      id: riskFactor.id,
      type: riskFactor.type,
      displayLabel: typeLabels[riskFactor.type],
      details: riskFactor.details,
      formattedDetails: this.formatRiskFactorDetails(
        riskFactor.type,
        riskFactor.details,
      ),
      lastUpdated: this.formatDate(riskFactor.updatedAt),
    };
  }

  /**
   * Format risk factor details for display
   */
  private formatRiskFactorDetails(
    type: RiskFactorType,
    details: RiskFactorDetails | null,
  ): string {
    if (!details) {
      return '';
    }

    if (type === 'tobacco_use' && details.level) {
      return `Level: ${details.level.charAt(0).toUpperCase() + details.level.slice(1)}`;
    }

    if (details.notes) {
      return details.notes;
    }

    return '';
  }

  /**
   * Format recommendation for display
   */
  private formatRecommendation(
    recommendation: OralHygieneRecommendationView,
  ): OralHygieneRecommendationDisplay {
    const parts: string[] = [];
    if (recommendation.toothbrushType) {
      parts.push(recommendation.toothbrushType);
    }
    if (recommendation.toothbrushBrand) {
      parts.push(recommendation.toothbrushBrand);
    }
    if (recommendation.toothbrushModel) {
      parts.push(recommendation.toothbrushModel);
    }

    return {
      toothbrushType: recommendation.toothbrushType,
      toothbrushBrand: recommendation.toothbrushBrand,
      toothbrushModel: recommendation.toothbrushModel,
      formattedRecommendation:
        parts.length > 0 ? parts.join(' - ') : 'No recommendation available',
      lastUpdated: this.formatDate(recommendation.updatedAt),
    };
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }
}
