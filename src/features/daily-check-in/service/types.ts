export type DailyCheckIn = {
  id: string;
  patientId: string;
  date: string;
  bleeding?: number;
  pain?: number;
  mouthFeeling?: string;
  interdentalBrushUsed: boolean;
  flossUsed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CheckInInput = {
  date?: string; // ISO date string (defaults to today)
  bleeding?: number; // 0-10
  pain?: number; // 0-10
  mouthFeeling?: string;
  interdentalBrushUsed?: boolean;
  flossUsed?: boolean;
};

