import type { Diagnosis, RiskFactor } from '@/features/follow-up/service/types';

export type DiagnosisFormValues = {
  type: Diagnosis['type'];
  grade: number | null;
  stage: number | null;
  notes?: string;
};

export type CreateOrUpdateDiagnosisInput = {
  patientId: string;
  periodontistId: string;
  type: Diagnosis['type'];
  grade: number | null;
  stage: number | null;
  notes?: string | null;
};

export type AddRiskFactorInput = {
  patientId: string;
  periodontistId: string;
  type: RiskFactor['type'];
  details?: Record<string, unknown>;
};

export type RemoveRiskFactorInput = {
  riskFactorId: string;
  periodontistId: string;
  patientId?: string;
};

