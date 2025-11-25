import type { User } from '@supabase/supabase-js';
import type { PeriodontistProfile } from '../repository/periodontist.repository.interface';
import type { PatientProfile } from '../repository/patient.repository.interface';

export type RegisterPeriodontistInput = {
  email: string;
  password: string;
  fullName: string;
  professionalCredentials?: string | null;
};

export type LoginPeriodontistInput = {
  email: string;
  password: string;
};

export type SendPatientInvitationInput = {
  periodontistId: string;
  email: string;
};

export type ExchangeMagicLinkCodeInput = {
  code: string;
  verifier: string;
};

export type RequestPatientMagicLinkInput = {
  email: string;
};

export type RegisterPeriodontistResult = PeriodontistProfile;
export type LoginPeriodontistResult = {
  accessToken: string;
  refreshToken: string | null;
  userId: string;
  periodontist: PeriodontistProfile | null;
  user: User;
};
export type SendPatientInvitationResult = PatientProfile;
export type ExchangeMagicLinkCodeResult = {
  accessToken: string;
  refreshToken: string | null;
  userId: string;
};
export type RequestPatientMagicLinkResult = {
  success: boolean;
  message: string;
};

export type RequestPatientOTPInput = {
  email: string;
};

export type RequestPatientOTPResult = {
  success: boolean;
  message: string;
};

export type VerifyPatientOTPInput = {
  email: string;
  token: string;
};

export type VerifyPatientOTPResult = {
  accessToken: string;
  refreshToken: string | null;
  userId: string;
  user: User;
};
