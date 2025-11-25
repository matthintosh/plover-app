import { supabase } from '../../../../lib/supabase/client';
import { PatientRepository } from '../../repository/patient.repository';
import { PeriodontistRepository } from '../../repository/periodontist.repository';
import { AuthService } from '../../service/auth.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
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

describe('Authentication Integration Flow', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;
  const MockedPeriodontistRepo = PeriodontistRepository as jest.MockedClass<typeof PeriodontistRepository>;
  const MockedPatientRepo = PatientRepository as jest.MockedClass<typeof PatientRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a periodontist and stores profile data', async () => {
    const signUpMock = mockedSupabase.auth.signUp as jest.Mock;
    signUpMock.mockResolvedValue({
      data: { user: { id: 'periodontist-1', email: 'dr@example.com' } },
      error: null,
    });

    const createPeriodontistMock = jest.fn().mockResolvedValue({ id: 'periodontist-1', email: 'dr@example.com' });
    MockedPeriodontistRepo.mockImplementation(() => ({
      createPeriodontist: createPeriodontistMock,
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

    expect(createPeriodontistMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'periodontist-1', email: 'dr@example.com' })
    );
  });

  it('invites a patient and creates patient profile', async () => {
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

    MockedPatientRepo.mockImplementation(() => ({
      createPatientForPeriodontist: jest.fn(),
      listByPeriodontistId: jest.fn(),
      findByEmail: jest.fn(),
      updateOnboardingStatus: jest.fn(),
    } as any));

    const service = new AuthService(new PeriodontistRepository(), new PatientRepository());

    const result = await service.sendPatientInvitation({ periodontistId: 'periodontist-1', email: 'patient@example.com' });

    expect(invokeMock).toHaveBeenCalledWith('invite-patient', {
      body: { email: 'patient@example.com', periodontistId: 'periodontist-1' },
    });

    expect(result.id).toBe('patient-1');
    expect(result.email).toBe('patient@example.com');
    expect(result.periodontistId).toBe('periodontist-1');
  });
});
