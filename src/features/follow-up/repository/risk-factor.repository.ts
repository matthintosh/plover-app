import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { RiskFactorRepositoryPort } from './risk-factor.repository.interface';
import { mapRiskFactorRowToRecord } from './risk-factor.repository.interface';

export class RiskFactorRepository implements RiskFactorRepositoryPort {
  async listRiskFactorsByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('risk_factor')
      .select('*')
      .eq('patient_id', patientId)
      .order('entered_at', { ascending: false });

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    return (data ?? []).map(mapRiskFactorRowToRecord);
  }
}

