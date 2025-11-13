import type { Tables } from '@/lib/supabase/types';

type RiskFactorRow = Tables<'risk_factor'>;

export type RiskFactorRecord = {
  id: string;
  patientId: string;
  type: RiskFactorRow['type'];
  details: RiskFactorRow['details'];
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
};

export interface RiskFactorRepositoryPort {
  listRiskFactorsByPatientId(patientId: string): Promise<RiskFactorRecord[]>;
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

