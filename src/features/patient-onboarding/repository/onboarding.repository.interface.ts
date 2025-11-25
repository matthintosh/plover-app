import type { Tables } from '@/lib/supabase/types';

type OnboardingResponseRow = Tables<'onboarding_response'>;

export type OnboardingResponseRecord = {
  id: string;
  patientId: string;
  age: number;
  diet: string;
  sleep: string;
  bruxismClenching: boolean;
  completedAt: string;
};

export type OnboardingResponseInput = {
  age: number;
  diet: string;
  sleep: string;
  bruxismClenching: boolean;
};

export interface OnboardingRepositoryPort {
  getOnboardingResponseByPatientId(
    patientId: string,
  ): Promise<OnboardingResponseRecord | null>;
  createOnboardingResponse(
    patientId: string,
    data: OnboardingResponseInput,
  ): Promise<OnboardingResponseRecord>;
}

export const mapOnboardingResponseRowToRecord = (
  row: OnboardingResponseRow,
): OnboardingResponseRecord => ({
  id: row.id,
  patientId: row.patient_id,
  age: row.age,
  diet: row.diet,
  sleep: row.sleep,
  bruxismClenching: row.bruxism_clenching,
  completedAt: row.completed_at,
});

