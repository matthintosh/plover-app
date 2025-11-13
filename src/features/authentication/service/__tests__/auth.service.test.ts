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
        exchangeCodeForSession: jest.fn(),
        admin: {
          inviteUserByEmail: jest.fn(),
        },
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
      findByEmail: jest.fn(),
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
    const inviteMock = mockedSupabase.auth.admin.inviteUserByEmail as jest.Mock;
    inviteMock.mockResolvedValue({ data: { user: { id: 'patient-1', email: 'patient@example.com' } }, error: null });

    const patientCreateMock = jest.fn();
    MockedPatientRepo.mockImplementation(() => ({
      createPatientForPeriodontist: patientCreateMock,
      listByPeriodontistId: jest.fn(),
      findByEmail: jest.fn(),
    } as any));

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    await service.sendPatientInvitation({
      periodontistId: 'periodontist-1',
      email: 'patient@example.com',
    });

    expect(inviteMock).toHaveBeenCalledWith('patient@example.com', {
      data: { invited_by: 'periodontist-1' },
    });

    expect(patientCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'patient-1',
        email: 'patient@example.com',
        periodontistId: 'periodontist-1',
      })
    );
  });

  it('exchanges magic link for session', async () => {
    const exchangeMock = mockedSupabase.auth.exchangeCodeForSession as jest.Mock;
    exchangeMock.mockResolvedValue({ data: { session: { access_token: 'token', refresh_token: 'refresh' }, user: { id: 'patient-1' } }, error: null });

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.exchangeMagicLinkCode({ code: '123456', verifier: 'verifier-token' });

    expect(exchangeMock).toHaveBeenCalledWith('123456');
    expect(result.accessToken).toBe('token');
  });
});
