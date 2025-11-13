import type { Tables } from '@/lib/supabase/types';

type DiagnosisRow = Tables<'diagnosis'>;

export type UpsertDiagnosisInput = {
  patientId: string;
  enteredBy: string;
  type: DiagnosisRow['type'];
  grade: DiagnosisRow['grade'];
  stage: DiagnosisRow['stage'];
  notes?: string | null;
};

export type DiagnosisRecord = {
  id: string;
  patientId: string;
  type: DiagnosisRow['type'];
  grade: DiagnosisRow['grade'];
  stage: DiagnosisRow['stage'];
  notes: string | null;
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
};

export interface PeriodontistDiagnosisRepositoryPort {
  upsertDiagnosis(input: UpsertDiagnosisInput): Promise<DiagnosisRecord>;
  deleteDiagnosis(patientId: string, periodontistId: string): Promise<void>;
}

export const mapDiagnosisRowToRecord = (row: DiagnosisRow): DiagnosisRecord => ({
  id: row.id,
  patientId: row.patient_id,
  type: row.type,
  grade: row.grade,
  stage: row.stage,
  notes: row.notes ?? null,
  enteredBy: row.entered_by,
  enteredAt: row.entered_at,
  updatedAt: row.updated_at,
});

