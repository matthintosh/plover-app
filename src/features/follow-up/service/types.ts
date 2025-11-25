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

export type OdontogramSpace = {
  spaceId: string; // e.g., "1-2", "2-3"
  toolType: 'interdental_brush' | 'floss';
  brushSize?: string; // Required if toolType is 'interdental_brush'
};

export type Odontogram = {
  id: string;
  spaces: OdontogramSpace[];
};

export type OralHygieneRecommendation = {
  id: string;
  patientId: string;
  toothbrushType?: string;
  toothbrushBrand?: string;
  toothbrushModel?: string;
  odontogram?: Odontogram;
  enteredBy: string; // Periodontist ID
  enteredAt: string;
  updatedAt: string;
};

