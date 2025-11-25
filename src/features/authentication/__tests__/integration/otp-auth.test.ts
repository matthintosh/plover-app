import { AuthService } from '../../service/auth.service';
import { PatientRepository } from '../../repository/patient.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      auth: {
        signInWithOtp: jest.fn(),
        verifyOtp: jest.fn(),
      },
    },
  };
});

describe('OTP Authentication Integration', () => {
  let authService: AuthService;
  const mockSupabase = require('../../../../lib/supabase/client').supabase;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(undefined, new PatientRepository());
  });

  it('completes full OTP authentication flow', async () => {
    const email = 'patient@example.com';
    const otpCode = '12345678';

    // Mock patient exists
    jest.spyOn(PatientRepository.prototype, 'findByEmail').mockResolvedValue({
      id: 'patient-1',
      email,
      periodontistId: 'periodontist-1',
      onboardingCompleted: false,
      accountStatus: 'active',
      createdAt: 'now',
      updatedAt: 'now',
    });

    // Mock OTP request
    mockSupabase.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: null,
    });

    // Mock OTP verification
    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
        user: {
          id: 'user-1',
          email,
        },
      },
      error: null,
    });

    // Step 1: Request OTP
    const requestResult = await authService.requestPatientOTP({ email });
    expect(requestResult.success).toBe(true);

    // Step 2: Verify OTP
    const verifyResult = await authService.verifyPatientOTP({
      email,
      token: otpCode,
    });

    expect(verifyResult.accessToken).toBe('access-token');
    expect(verifyResult.userId).toBe('user-1');
  });

  it('handles expired OTP code', async () => {
    const email = 'patient@example.com';
    const expiredCode = '12345678';

    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Token has expired' },
    });

    await expect(
      authService.verifyPatientOTP({
        email,
        token: expiredCode,
      }),
    ).rejects.toThrow();
  });

  it('handles rate limiting for OTP requests', async () => {
    const email = 'patient@example.com';

    jest.spyOn(PatientRepository.prototype, 'findByEmail').mockResolvedValue({
      id: 'patient-1',
      email,
      periodontistId: 'periodontist-1',
      onboardingCompleted: false,
      accountStatus: 'active',
      createdAt: 'now',
      updatedAt: 'now',
    });

    mockSupabase.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: { message: 'Too many requests' },
    });

    await expect(authService.requestPatientOTP({ email })).rejects.toThrow();
  });
});
