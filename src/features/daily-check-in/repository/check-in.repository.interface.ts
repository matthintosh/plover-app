import type { Tables } from '@/lib/supabase/types';

type DailyCheckInRow = Tables<'daily_check_in'>;

export type DailyCheckInRecord = {
  id: string;
  patientId: string;
  date: string;
  bleeding?: number | null;
  pain?: number | null;
  mouthFeeling?: string | null;
  interdentalBrushUsed: boolean;
  flossUsed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CheckInInput = {
  date: string;
  bleeding?: number;
  pain?: number;
  mouthFeeling?: string;
  interdentalBrushUsed?: boolean;
  flossUsed?: boolean;
};

export interface CheckInRepositoryPort {
  getCheckInByDate(patientId: string, date: string): Promise<DailyCheckInRecord | null>;
  getCheckInsByDateRange(
    patientId: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyCheckInRecord[]>;
  createOrUpdateCheckIn(patientId: string, data: CheckInInput): Promise<DailyCheckInRecord>;
}

export const mapDailyCheckInRowToRecord = (
  row: DailyCheckInRow,
): DailyCheckInRecord => ({
  id: row.id,
  patientId: row.patient_id,
  date: row.date,
  bleeding: row.bleeding,
  pain: row.pain,
  mouthFeeling: row.mouth_feeling,
  interdentalBrushUsed: row.interdental_brush_used,
  flossUsed: row.floss_used,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

