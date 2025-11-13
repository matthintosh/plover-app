import type { Tables } from '@/lib/supabase/types';

type RiskFactorRow = Tables<'risk_factor'>;

export type AddRiskFactorInput = {
  patientId: string;
  periodontistId: string;
  type: RiskFactorRow['type'];
  details?: RiskFactorRow['details'];
};

export type RemoveRiskFactorInput = {
  riskFactorId: string;
  periodontistId: string;
};

export type RiskFactorRecord = {
  id: string;
  patientId: string;
  type: RiskFactorRow['type'];
  details: RiskFactorRow['details'];
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
};

export interface PeriodontistRiskFactorRepositoryPort {
  addRiskFactor(input: AddRiskFactorInput): Promise<RiskFactorRecord>;
  removeRiskFactor(input: RemoveRiskFactorInput): Promise<void>;
  listByPatientId(patientId: string): Promise<RiskFactorRecord[]>;
}

export const mapRiskFactorRowToRecord = (row: RiskFactorRow): RiskFactorRecord => ({
  id: row.id,
  patientId: row.patient_id,
  type: row.type,
  details: row.details,
  enteredBy: row.entered_by,
  enteredAt: row.entered_at,
  updatedAt: row.updated_at,
});

