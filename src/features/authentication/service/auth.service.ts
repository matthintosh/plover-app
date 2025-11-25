import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes, normalizeError } from '@/lib/utils/error-handling';
import { makeRedirectUri } from 'expo-auth-session';
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
  RequestPatientMagicLinkInput,
  RequestPatientMagicLinkResult,
  RequestPatientOTPInput,
  RequestPatientOTPResult,
  SendPatientInvitationInput,
  SendPatientInvitationResult,
  VerifyPatientOTPInput,
  VerifyPatientOTPResult,
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

    // Call Edge Function to invite patient (requires admin privileges)
    const { data, error } = await supabase.functions.invoke('invite-patient', {
      body: { email, periodontistId },
    });

    if (error || !data) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        error?.message ?? data?.error ?? 'Unable to send invitation',
        error,
      );
    }

    // Map the response to PatientProfile
    return {
      id: data.id,
      email: data.email,
      periodontistId: data.periodontistId,
      onboardingCompleted: data.onboardingCompleted ?? false,
      accountStatus: data.accountStatus ?? 'pending',
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };
  }

  async exchangeMagicLinkCode(
    input: ExchangeMagicLinkCodeInput,
  ): Promise<ExchangeMagicLinkCodeResult> {
    const { code } = input;

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

  async requestPatientMagicLink(
    input: RequestPatientMagicLinkInput,
  ): Promise<RequestPatientMagicLinkResult> {
    const { email } = input;

    // First, verify that the email belongs to a patient
    const patient = await this.patientRepository.findByEmail(email.toLowerCase());

    if (!patient) {
      // Don't reveal if email exists or not for security
      // Return success message anyway to prevent email enumeration
      return {
        success: true,
        message: 'If this email is registered as a patient, you will receive a magic link shortly.',
      };
    }

    // Get the base URL for redirects
    // Supabase will redirect to this URL after email verification
    // The URL should be configured in Supabase dashboard under Authentication > URL Configuration
    const getRedirectUrl = () => {
      // For web, use the current origin with the magic-link route
      if (typeof window !== 'undefined' && window.location) {
        return `${window.location.origin}/(auth)/magic-link`;
      }
      // For mobile/Expo, use makeRedirectUri with the path parameter
      // This ensures the redirect URL includes the correct route for Expo Router
      return makeRedirectUri({
        path: '/(auth)/magic-link',
      });
    };


    // Send magic link using Supabase Auth signInWithOtp
    // This will send an email with a magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: getRedirectUrl(),
        shouldCreateUser: false, // Don't create new users, only allow existing patients
      },
    });

    if (error) {
      // Don't reveal specific errors for security
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Unable to send magic link. Please try again later.',
        error,
      );
    }

    return {
      success: true,
      message: 'Magic link sent! Please check your email and click the link to sign in.',
    };
  }

  async requestPatientOTP(input: RequestPatientOTPInput): Promise<RequestPatientOTPResult> {
    const { email } = input;

    // First, verify that the email belongs to a patient
    const patient = await this.patientRepository.findByEmail(email.toLowerCase());

    if (!patient) {
      // Don't reveal if email exists or not for security
      // Return success message anyway to prevent email enumeration
      return {
        success: true,
        message: 'If this email is registered as a patient, you will receive an OTP code shortly.',
      };
    }

    // Send OTP code using Supabase Auth signInWithOtp
    // This will send an email with a 6-digit OTP code
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        shouldCreateUser: false, // Don't create new users, only allow existing patients
      },
    });

    if (error) {
      // Don't reveal specific errors for security
      throw new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Unable to send OTP code. Please try again later.',
        error,
      );
    }

    return {
      success: true,
      message: 'OTP code sent! Please check your email and enter the 8-digit code to sign in.',
    };
  }

  async verifyPatientOTP(input: VerifyPatientOTPInput): Promise<VerifyPatientOTPResult> {
    const { email, token } = input;

    // Validate OTP code format: must be exactly 8 digits
    if (!/^\d{8}$/.test(token)) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'OTP code must be exactly 8 digits',
      );
    }

    // Verify OTP code with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token,
      type: 'email',
    });

    if (error || !data.session || !data.user) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        error?.message ?? 'Invalid or expired OTP code. Please request a new code.',
        error,
      );
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      userId: data.user.id,
      user: data.user,
    };
  }
}
