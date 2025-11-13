import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type {
  PeriodontistRepositoryPort,
  CreatePeriodontistInput,
  UpdatePeriodontistInput,
  PeriodontistProfile,
} from './periodontist.repository.interface';
import { mapPeriodontistRowToProfile } from './periodontist.repository.interface';

export class PeriodontistRepository implements PeriodontistRepositoryPort {
  async createPeriodontist(input: CreatePeriodontistInput): Promise<PeriodontistProfile> {
    const { id, email, fullName, professionalCredentials = null } = input;

    const { data, error } = await supabase.rpc('create_periodontist_profile', {
      p_id: id,
      p_email: email,
      p_full_name: fullName,
      p_professional_credentials: professionalCredentials,
    });

    if (error || !data) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error?.message ?? 'Failed to create periodontist', error);
    }

    return mapPeriodontistRowToProfile(data);
  }

  async findByEmail(email: string): Promise<PeriodontistProfile | null> {
    const { data, error } = await supabase
      .from('periodontist')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    return mapPeriodontistRowToProfile(data);
  }

  async updatePeriodontist(
    id: string,
    input: UpdatePeriodontistInput,
  ): Promise<PeriodontistProfile> {
    const payload: Record<string, unknown> = {};

    if (input.fullName !== undefined) {
      payload.full_name = input.fullName;
    }

    if (input.professionalCredentials !== undefined) {
      payload.professional_credentials = input.professionalCredentials;
    }

    if (input.accountStatus !== undefined) {
      payload.account_status = input.accountStatus;
    }

    const { data, error } = await supabase
      .from('periodontist')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error?.message ?? 'Failed to update periodontist', error);
    }

    return mapPeriodontistRowToProfile(data);
  }
}
