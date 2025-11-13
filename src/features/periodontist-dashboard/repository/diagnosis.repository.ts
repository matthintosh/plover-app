import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type {
  PeriodontistDiagnosisRepositoryPort,
  UpsertDiagnosisInput,
} from './diagnosis.repository.interface';
import { mapDiagnosisRowToRecord } from './diagnosis.repository.interface';

export class DiagnosisRepository implements PeriodontistDiagnosisRepositoryPort {
  async upsertDiagnosis(input: UpsertDiagnosisInput) {
    const { patientId, enteredBy, type, grade, stage, notes = null } = input;

    const { data, error } = await supabase
      .from('diagnosis')
      .upsert(
        {
          patient_id: patientId,
          entered_by: enteredBy,
          type,
          grade,
          stage,
          notes,
        },
        { onConflict: 'patient_id' },
      )
      .select('*')
      .single();

    if (error || !data) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        error?.message ?? 'Unable to save diagnosis',
        error,
      );
    }

    return mapDiagnosisRowToRecord(data);
  }

  async deleteDiagnosis(patientId: string, periodontistId: string) {
    const { error } = await supabase
      .from('diagnosis')
      .delete()
      .eq('patient_id', patientId)
      .eq('entered_by', periodontistId);

    if (error) {
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        error.message ?? 'Unable to delete diagnosis',
        error,
      );
    }
  }
}

