import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { CheckInInput, CheckInRepositoryPort } from './check-in.repository.interface';
import { mapDailyCheckInRowToRecord } from './check-in.repository.interface';

export class CheckInRepository implements CheckInRepositoryPort {
  async getCheckInByDate(patientId: string, date: string) {
    const { data, error } = await supabase
      .from('daily_check_in')
      .select('*')
      .eq('patient_id', patientId)
      .eq('date', date)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    return mapDailyCheckInRowToRecord(data);
  }

  async getCheckInsByDateRange(
    patientId: string,
    startDate: string,
    endDate: string,
  ) {
    const { data, error } = await supabase
      .from('daily_check_in')
      .select('*')
      .eq('patient_id', patientId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    return (data ?? []).map(mapDailyCheckInRowToRecord);
  }

  async createOrUpdateCheckIn(patientId: string, data: CheckInInput) {
    // Use upsert to handle both create and update
    // The unique constraint on (patient_id, date) ensures one check-in per day
    const { data: insertedData, error } = await supabase
      .from('daily_check_in')
      .upsert(
        {
          patient_id: patientId,
          date: data.date,
          bleeding: data.bleeding ?? null,
          pain: data.pain ?? null,
          mouth_feeling: data.mouthFeeling ?? null,
          interdental_brush_used: data.interdentalBrushUsed ?? false,
          floss_used: data.flossUsed ?? false,
        },
        {
          onConflict: 'patient_id,date',
        },
      )
      .select()
      .single();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!insertedData) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, 'Failed to create or update check-in');
    }

    return mapDailyCheckInRowToRecord(insertedData);
  }
}

