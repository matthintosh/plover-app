import type { Tables } from '@/lib/supabase/types';

type PatientRow = Tables<'patient'>;

export type PatientProfile = {
  id: string;
  email: string;
  periodontistId: string;
  onboardingCompleted: boolean;
  accountStatus: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type CreatePatientInput = {
  id: string;
  email: string;
  periodontistId: string;
};

export interface PatientRepositoryPort {
  createPatientForPeriodontist(input: CreatePatientInput): Promise<PatientProfile>;
  listByPeriodontistId(periodontistId: string): Promise<PatientProfile[]>;
  findByEmail(email: string): Promise<PatientProfile | null>;
  updateOnboardingStatus(patientId: string, completed: boolean): Promise<PatientProfile>;
}

export const mapPatientRowToProfile = (row: PatientRow): PatientProfile => ({
  id: row.id,
  email: row.email,
  periodontistId: row.periodontist_id,
  onboardingCompleted: row.onboarding_completed,
  accountStatus: row.account_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
