export type DiagnosisType = 'gingivitis' | 'periodontitis';

export type Diagnosis = {
  id: string;
  patientId: string;
  type: DiagnosisType;
  grade: number | null;
  stage: number | null;
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
};

export type RiskFactorType =
  | 'diabetes'
  | 'tobacco_use'
  | 'cardiovascular_disease'
  | 'cancer_hormonotherapy';

export type RiskFactorDetails = Record<string, unknown> | null;

export type RiskFactor = {
  id: string;
  patientId: string;
  type: RiskFactorType;
  details: RiskFactorDetails;
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
};

