import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { DiagnosisRepositoryPort } from './diagnosis.repository.interface';
import { mapDiagnosisRowToRecord } from './diagnosis.repository.interface';

export class DiagnosisRepository implements DiagnosisRepositoryPort {
  async getDiagnosisByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('diagnosis')
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    return mapDiagnosisRowToRecord(data);
  }
}

