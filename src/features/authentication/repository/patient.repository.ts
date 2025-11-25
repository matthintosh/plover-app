import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { CreatePatientInput, PatientProfile, PatientRepositoryPort } from './patient.repository.interface';
import { mapPatientRowToProfile } from './patient.repository.interface';

export class PatientRepository implements PatientRepositoryPort {
  async createPatientForPeriodontist(input: CreatePatientInput): Promise<PatientProfile> {
    const { id, email, periodontistId } = input;

    const { data, error } = await supabase
      .from('patient')
      .insert({
        id,
        email,
        periodontist_id: periodontistId,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error?.message ?? 'Failed to create patient', error);
    }

    return mapPatientRowToProfile(data);
  }

  async listByPeriodontistId(periodontistId: string): Promise<PatientProfile[]> {
    const { data, error } = await supabase
      .from('patient')
      .select('*')
      .eq('periodontist_id', periodontistId);

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    return (data ?? []).map(mapPatientRowToProfile);
  }

  async findByEmail(email: string): Promise<PatientProfile | null> {
    const { data, error } = await supabase
      .from('patient')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    return mapPatientRowToProfile(data);
  }

  async updateOnboardingStatus(patientId: string, completed: boolean): Promise<PatientProfile> {
    const { data, error } = await supabase
      .from('patient')
      .update({
        onboarding_completed: completed,
        account_status: completed ? 'active' : 'pending',
      })
      .eq('id', patientId)
      .select('*')
      .single();

    if (error || !data) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        error?.message ?? 'Failed to update patient onboarding status',
        error,
      );
    }

    return mapPatientRowToProfile(data);
  }
}
