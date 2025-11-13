import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes, normalizeError } from '@/lib/utils/error-handling';
import {
    PatientRepository,
} from '../repository/patient.repository';
import {
    PeriodontistRepository,
} from '../repository/periodontist.repository';
import type {
    ExchangeMagicLinkCodeInput,
    ExchangeMagicLinkCodeResult,
    LoginPeriodontistInput,
    LoginPeriodontistResult,
    RegisterPeriodontistInput,
    RegisterPeriodontistResult,
    SendPatientInvitationInput,
    SendPatientInvitationResult,
} from './types';

export class AuthService {
  constructor(
    private readonly periodontistRepository = new PeriodontistRepository(),
    private readonly patientRepository = new PatientRepository(),
  ) {}

  async registerPeriodontist(
    input: RegisterPeriodontistInput,
  ): Promise<RegisterPeriodontistResult> {
    const { email, password, fullName, professionalCredentials = null } = input;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          professional_credentials: professionalCredentials,
        },
      },
    });

    if (error || !data.user) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        error?.message ?? 'Unable to register periodontist',
        error,
      );
    }

    const profile = await this.periodontistRepository.createPeriodontist({
      id: data.user.id,
      email,
      fullName,
      professionalCredentials,
    });

    return profile;
  }

  async loginPeriodontist(
    input: LoginPeriodontistInput,
  ): Promise<LoginPeriodontistResult> {
    const { email, password } = input;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      throw new AppError(
        ErrorCodes.INVALID_CREDENTIALS,
        error?.message ?? 'Invalid email or password',
        error,
      );
    }

    const periodontist = await this.periodontistRepository.findByEmail(email);

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token ?? null,
      userId: data.user.id,
      periodontist: periodontist ?? null,
      user: data.user,
    };
  }

  async sendPatientInvitation(
    input: SendPatientInvitationInput,
  ): Promise<SendPatientInvitationResult> {
    const { periodontistId, email } = input;

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { invited_by: periodontistId },
    });

    if (error || !data?.user) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        error?.message ?? 'Unable to send invitation',
        error,
      );
    }

    const patientProfile = await this.patientRepository.createPatientForPeriodontist({
      id: data.user.id,
      email,
      periodontistId,
    });

    return patientProfile;
  }

  async exchangeMagicLinkCode(
    input: ExchangeMagicLinkCodeInput,
  ): Promise<ExchangeMagicLinkCodeResult> {
    const { code, verifier: _verifier } = input;

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.session || !data.user) {
        throw new AppError(
          ErrorCodes.INVALID_TOKEN,
          error?.message ?? 'Invalid or expired magic link',
          error,
        );
      }

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token ?? null,
        userId: data.user.id,
      };
    } catch (err) {
      const normalized = normalizeError(err);
      throw new AppError(normalized.code, normalized.message, normalized.details);
    }
  }
}
