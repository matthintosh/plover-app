import { AuthService } from '../../service/auth.service';
import { PatientRepository } from '../../repository/patient.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      auth: {
        signInWithOtp: jest.fn(),
        exchangeCodeForSession: jest.fn(),
      },
    },
  };
});

describe('Magic Link Regression Tests', () => {
  let authService: AuthService;
  const mockSupabase = require('../../../../lib/supabase/client').supabase;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(undefined, new PatientRepository());
  });

  it('magic link request behavior unchanged', async () => {
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
      error: null,
    });

    const result = await authService.requestPatientMagicLink({ email });

    // Verify same behavior as before
    expect(result.success).toBe(true);
    expect(result.message).toContain('Magic link sent');
    expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: expect.stringContaining('magic-link'),
        shouldCreateUser: false,
      },
    });
  });

  it('magic link exchange behavior unchanged', async () => {
    const code = 'test-code';

    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'token',
          refresh_token: 'refresh',
        },
        user: {
          id: 'user-1',
        },
      },
      error: null,
    });

    const result = await authService.exchangeMagicLinkCode({
      code,
      verifier: 'verifier',
    });

    // Verify same behavior as before
    expect(result.accessToken).toBe('token');
    expect(result.refreshToken).toBe('refresh');
    expect(result.userId).toBe('user-1');
  });

  it('security behavior unchanged - does not reveal email existence', async () => {
    jest.spyOn(PatientRepository.prototype, 'findByEmail').mockResolvedValue(null);

    const result = await authService.requestPatientMagicLink({
      email: 'unknown@example.com',
    });

    // Should still return success message even if email doesn't exist
    expect(result.success).toBe(true);
    expect(result.message).toContain('If this email is registered');
    // Should not call Supabase if email doesn't exist
    expect(mockSupabase.auth.signInWithOtp).not.toHaveBeenCalled();
  });
});
