import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type {
  AddRiskFactorInput,
  PeriodontistRiskFactorRepositoryPort,
  RemoveRiskFactorInput,
} from './risk-factor.repository.interface';
import { mapRiskFactorRowToRecord } from './risk-factor.repository.interface';

export class RiskFactorRepository implements PeriodontistRiskFactorRepositoryPort {
  async addRiskFactor(input: AddRiskFactorInput) {
    const { patientId, periodontistId, type, details = {} } = input;

    const { data, error } = await supabase
      .from('risk_factor')
      .insert({
        patient_id: patientId,
        entered_by: periodontistId,
        type,
        details,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        error?.message ?? 'Unable to add risk factor',
        error,
      );
    }

    return mapRiskFactorRowToRecord(data);
  }

  async removeRiskFactor(input: RemoveRiskFactorInput) {
    const { riskFactorId, periodontistId } = input;

    const { error } = await supabase
      .from('risk_factor')
      .delete()
      .eq('id', riskFactorId)
      .eq('entered_by', periodontistId);

    if (error) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        error.message ?? 'Unable to remove risk factor',
        error,
      );
    }
  }

  async listByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('risk_factor')
      .select('*')
      .eq('patient_id', patientId)
      .order('entered_at', { ascending: false });

    if (error) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        error.message ?? 'Unable to fetch risk factors',
        error,
      );
    }

    return (data ?? []).map(mapRiskFactorRowToRecord);
  }
}

