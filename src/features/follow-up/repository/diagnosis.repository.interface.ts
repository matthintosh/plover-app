import type { Tables } from '@/lib/supabase/types';

type DiagnosisRow = Tables<'diagnosis'>;

export type DiagnosisRecord = {
  id: string;
  patientId: string;
  type: DiagnosisRow['type'];
  grade: DiagnosisRow['grade'];
  stage: DiagnosisRow['stage'];
  enteredBy: string;
  enteredAt: string;
  updatedAt: string;
};

export interface DiagnosisRepositoryPort {
  getDiagnosisByPatientId(patientId: string): Promise<DiagnosisRecord | null>;
}

export const mapDiagnosisRowToRecord = (row: DiagnosisRow): DiagnosisRecord => ({
  id: row.id,
  patientId: row.patient_id,
  type: row.type,
  grade: row.grade,
  stage: row.stage,
  enteredBy: row.entered_by,
  enteredAt: row.entered_at,
  updatedAt: row.updated_at,
});

