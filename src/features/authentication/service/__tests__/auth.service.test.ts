import { supabase } from '../../../../lib/supabase/client';
import { PatientRepository } from '../../repository/patient.repository';
import { PeriodontistRepository } from '../../repository/periodontist.repository';
import { AuthService } from '../auth.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signInWithOtp: jest.fn(),
        verifyOtp: jest.fn(),
        exchangeCodeForSession: jest.fn(),
        admin: {
          inviteUserByEmail: jest.fn(),
        },
      },
      functions: {
        invoke: jest.fn().mockResolvedValue({
          data: {
            id: 'patient-1',
            email: 'patient@example.com',
            periodontistId: 'periodontist-1',
            onboardingCompleted: false,
            accountStatus: 'pending',
            createdAt: 'now',
            updatedAt: 'now',
          },
          error: null,
        }),
      },
    },
  };
});

jest.mock('../../repository/periodontist.repository');
jest.mock('../../repository/patient.repository');

describe('AuthService', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;
  const MockedPeriodontistRepo = PeriodontistRepository as jest.MockedClass<typeof PeriodontistRepository>;
  const MockedPatientRepo = PatientRepository as jest.MockedClass<typeof PatientRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    MockedPeriodontistRepo.mockImplementation(() => ({
      createPeriodontist: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue({
        id: 'periodontist-1',
        email: 'dr@example.com',
        fullName: 'Dr. Tooth',
        professionalCredentials: 'DDS',
        accountStatus: 'active',
        createdAt: 'now',
        updatedAt: 'now',
      }),
      updatePeriodontist: jest.fn(),
    } as any));

    MockedPatientRepo.mockImplementation(() => ({
      createPatientForPeriodontist: jest.fn(),
      listByPeriodontistId: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(null),
      updateOnboardingStatus: jest.fn(),
    } as any));
  });

  it('registers periodontist via Supabase Auth and repository', async () => {
    const signUpMock = mockedSupabase.auth.signUp as jest.Mock;
    signUpMock.mockResolvedValue({ data: { user: { id: 'periodontist-1', email: 'dr@example.com' } }, error: null });

    const repositoryCreateMock = jest.fn();
    MockedPeriodontistRepo.mockImplementation(() => ({
      createPeriodontist: repositoryCreateMock,
      findByEmail: jest.fn(),
      updatePeriodontist: jest.fn(),
    } as any));

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    await service.registerPeriodontist({
      email: 'dr@example.com',
      password: 'secure-password',
      fullName: 'Dr. Tooth',
      professionalCredentials: 'DDS',
    });

    expect(signUpMock).toHaveBeenCalledWith({
      email: 'dr@example.com',
      password: 'secure-password',
      options: {
        data: expect.objectContaining({ full_name: 'Dr. Tooth' }),
      },
    });

    expect(repositoryCreateMock).toHaveBeenCalledWith(expect.objectContaining({ id: 'periodontist-1' }));
  });

  it('logs in periodontist via Supabase Auth password flow', async () => {
    const signInMock = mockedSupabase.auth.signInWithPassword as jest.Mock;
    signInMock.mockResolvedValue({
      data: { session: { access_token: 'token', refresh_token: 'refresh' }, user: { id: 'periodontist-1' } },
      error: null,
    });

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.loginPeriodontist({ email: 'dr@example.com', password: 'secure-password' });

    expect(signInMock).toHaveBeenCalledWith({
      email: 'dr@example.com',
      password: 'secure-password',
    });
    expect(result.accessToken).toBe('token');
    expect(result.periodontist?.id).toBe('periodontist-1');
    expect(result.user.id).toBe('periodontist-1');
  });

  it('sends patient invitation and creates patient record', async () => {
    const invokeMock = mockedSupabase.functions.invoke as jest.Mock;
    invokeMock.mockResolvedValue({
      data: {
        id: 'patient-1',
        email: 'patient@example.com',
        periodontistId: 'periodontist-1',
        onboardingCompleted: false,
        accountStatus: 'pending',
        createdAt: 'now',
        updatedAt: 'now',
      },
      error: null,
    });

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.sendPatientInvitation({
      periodontistId: 'periodontist-1',
      email: 'patient@example.com',
    });

    expect(invokeMock).toHaveBeenCalledWith('invite-patient', {
      body: { email: 'patient@example.com', periodontistId: 'periodontist-1' },
    });

    expect(result.id).toBe('patient-1');
    expect(result.email).toBe('patient@example.com');
    expect(result.periodontistId).toBe('periodontist-1');
  });

  it('exchanges magic link for session', async () => {
    const exchangeMock = mockedSupabase.auth.exchangeCodeForSession as jest.Mock;
    exchangeMock.mockResolvedValue({ data: { session: { access_token: 'token', refresh_token: 'refresh' }, user: { id: 'patient-1' } }, error: null });

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.exchangeMagicLinkCode({ code: '123456', verifier: 'verifier-token' });

    expect(exchangeMock).toHaveBeenCalledWith('123456');
    expect(result.accessToken).toBe('token');
  });

  it('requests magic link for existing patient', async () => {
    const signInWithOtpMock = mockedSupabase.auth.signInWithOtp as jest.Mock;
    signInWithOtpMock.mockResolvedValue({ data: {}, error: null });

    const findByEmailMock = jest.fn().mockResolvedValue({
      id: 'patient-1',
      email: 'patient@example.com',
      periodontistId: 'periodontist-1',
      onboardingCompleted: false,
      accountStatus: 'active',
      createdAt: 'now',
      updatedAt: 'now',
    });

    MockedPatientRepo.mockImplementation(() => ({
      createPatientForPeriodontist: jest.fn(),
      listByPeriodontistId: jest.fn(),
      findByEmail: findByEmailMock,
      updateOnboardingStatus: jest.fn(),
    } as any));

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.requestPatientMagicLink({ email: 'patient@example.com' });

    expect(findByEmailMock).toHaveBeenCalledWith('patient@example.com');
    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: 'patient@example.com',
      options: {
        emailRedirectTo: expect.stringContaining('magic-link'),
        shouldCreateUser: false,
      },
    });
    expect(result.success).toBe(true);
    expect(result.message).toContain('Magic link sent');
  });

  it('returns success message even if patient email not found (security)', async () => {
    const signInWithOtpMock = mockedSupabase.auth.signInWithOtp as jest.Mock;
    const findByEmailMock = jest.fn().mockResolvedValue(null);

    MockedPatientRepo.mockImplementation(() => ({
      createPatientForPeriodontist: jest.fn(),
      listByPeriodontistId: jest.fn(),
      findByEmail: findByEmailMock,
      updateOnboardingStatus: jest.fn(),
    } as any));

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.requestPatientMagicLink({ email: 'unknown@example.com' });

    expect(findByEmailMock).toHaveBeenCalledWith('unknown@example.com');
    expect(signInWithOtpMock).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.message).toContain('If this email is registered');
  });

  describe('OTP Authentication', () => {
    it('requests OTP code for registered patient', async () => {
      const signInWithOtpMock = mockedSupabase.auth.signInWithOtp as jest.Mock;
      signInWithOtpMock.mockResolvedValue({ data: {}, error: null });

      MockedPatientRepo.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue({
          id: 'patient-1',
          email: 'patient@example.com',
          periodontistId: 'periodontist-1',
          onboardingCompleted: false,
          accountStatus: 'active',
          createdAt: 'now',
          updatedAt: 'now',
        }),
        createPatientForPeriodontist: jest.fn(),
        listByPeriodontistId: jest.fn(),
        updateOnboardingStatus: jest.fn(),
      } as any));

      const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

      const result = await service.requestPatientOTP({ email: 'patient@example.com' });

      expect(result.success).toBe(true);
      expect(signInWithOtpMock).toHaveBeenCalledWith({
        email: 'patient@example.com',
        options: {
          shouldCreateUser: false,
        },
      });
    });

    it('does not reveal if email exists when requesting OTP', async () => {
      const signInWithOtpMock = mockedSupabase.auth.signInWithOtp as jest.Mock;
      signInWithOtpMock.mockResolvedValue({ data: {}, error: null });

      MockedPatientRepo.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null),
        createPatientForPeriodontist: jest.fn(),
        listByPeriodontistId: jest.fn(),
        updateOnboardingStatus: jest.fn(),
      } as any));

      const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

      const result = await service.requestPatientOTP({ email: 'unknown@example.com' });

      // Should return success message even if email doesn't exist (security)
      expect(result.success).toBe(true);
      expect(result.message).toContain('registered');
    });

    it('verifies valid OTP code and returns session', async () => {
      const verifyOtpMock = mockedSupabase.auth.verifyOtp as jest.Mock;
      verifyOtpMock.mockResolvedValue({
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

      const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

      const result = await service.verifyPatientOTP({
        email: 'patient@example.com',
        token: '12345678',
      });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.userId).toBe('user-1');
      expect(verifyOtpMock).toHaveBeenCalledWith({
        email: 'patient@example.com',
        token: '12345678',
        type: 'email',
      });
    });

    it('throws error for invalid OTP code', async () => {
      const verifyOtpMock = mockedSupabase.auth.verifyOtp as jest.Mock;
      verifyOtpMock.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid OTP code' },
      });

      const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

      await expect(
        service.verifyPatientOTP({
          email: 'patient@example.com',
          token: 'wrong-code',
        }),
      ).rejects.toThrow();
    });

    it('validates OTP code format (8 digits)', async () => {
      const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

      await expect(
        service.verifyPatientOTP({
          email: 'patient@example.com',
          token: '1234567', // 7 digits - invalid
        }),
      ).rejects.toThrow();

      await expect(
        service.verifyPatientOTP({
          email: 'patient@example.com',
          token: '123456789', // 9 digits - invalid
        }),
      ).rejects.toThrow();

      await expect(
        service.verifyPatientOTP({
          email: 'patient@example.com',
          token: 'abc123', // non-numeric - invalid
        }),
      ).rejects.toThrow();
    });
  });
});
