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

describe('Magic Link Compatibility with Method Selection', () => {
  let authService: AuthService;
  const mockSupabase = require('../../../../lib/supabase/client').supabase;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(undefined, new PatientRepository());
  });

  it('magic link flow works when method selection UI is present', async () => {
    const email = 'patient@example.com';

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

    // Mock magic link request (uses signInWithOtp with emailRedirectTo)
    mockSupabase.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await authService.requestPatientMagicLink({ email });

    expect(result.success).toBe(true);
    expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email,
      options: {
        emailRedirectTo: expect.stringContaining('magic-link'),
        shouldCreateUser: false,
      },
    });
  });

  it('magic link exchange still works after method selection', async () => {
    const code = 'magic-link-code';

    mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
        user: {
          id: 'user-1',
          email: 'patient@example.com',
        },
      },
      error: null,
    });

    const result = await authService.exchangeMagicLinkCode({
      code,
      verifier: 'verifier-token',
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.userId).toBe('user-1');
  });
});
