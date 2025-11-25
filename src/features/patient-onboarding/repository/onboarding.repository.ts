import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type {
  OnboardingRepositoryPort,
  OnboardingResponseInput,
} from './onboarding.repository.interface';
import { mapOnboardingResponseRowToRecord } from './onboarding.repository.interface';

export class OnboardingRepository implements OnboardingRepositoryPort {
  async getOnboardingResponseByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('onboarding_response')
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    return mapOnboardingResponseRowToRecord(data);
  }

  async createOnboardingResponse(patientId: string, data: OnboardingResponseInput) {
    const { data: insertedData, error } = await supabase
      .from('onboarding_response')
      .insert({
        patient_id: patientId,
        age: data.age,
        diet: data.diet,
        sleep: data.sleep,
        bruxism_clenching: data.bruxismClenching,
      })
      .select()
      .single();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!insertedData) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Failed to create onboarding response',
      );
    }

    return mapOnboardingResponseRowToRecord(insertedData);
  }
}

