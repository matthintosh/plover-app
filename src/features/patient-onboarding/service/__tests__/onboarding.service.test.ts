import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { OnboardingService } from '../onboarding.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('OnboardingService', () => {
  const createService = ({
    repositoryReturnValue = null,
    createReturnValue = null,
  }: {
    repositoryReturnValue?: any;
    createReturnValue?: any;
  }) => {
    const onboardingRepository = {
      getOnboardingResponseByPatientId: jest
        .fn()
        .mockResolvedValue(repositoryReturnValue),
      createOnboardingResponse: jest.fn().mockResolvedValue(createReturnValue),
    };

    return {
      service: new OnboardingService(onboardingRepository as any),
      onboardingRepository,
    };
  };

  describe('getOnboardingResponse', () => {
    it('returns onboarding response for patient when available', async () => {
      const mockResponse = {
        id: 'onboarding-1',
        patientId: 'patient-1',
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: false,
        completedAt: '2025-01-15T10:00:00Z',
      };

      const { service, onboardingRepository } = createService({
        repositoryReturnValue: mockResponse,
      });

      const result = await service.getOnboardingResponse('patient-1');

      expect(onboardingRepository.getOnboardingResponseByPatientId).toHaveBeenCalledWith(
        'patient-1',
      );
      expect(result).toEqual(mockResponse);
    });

    it('returns null when repository returns null', async () => {
      const { service } = createService({ repositoryReturnValue: null });

      const result = await service.getOnboardingResponse('patient-2');

      expect(result).toBeNull();
    });
  });

  describe('submitOnboardingResponse', () => {
    it('creates onboarding response successfully', async () => {
      const mockCreatedResponse = {
        id: 'onboarding-1',
        patientId: 'patient-1',
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: false,
        completedAt: '2025-01-15T10:00:00Z',
      };

      const { service, onboardingRepository } = createService({
        createReturnValue: mockCreatedResponse,
      });

      const input = {
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: false,
      };

      const result = await service.submitOnboardingResponse('patient-1', input);

      expect(onboardingRepository.createOnboardingResponse).toHaveBeenCalledWith(
        'patient-1',
        input,
      );
      expect(result).toEqual(mockCreatedResponse);
    });

    it('throws error when onboarding already completed', async () => {
      const mockExistingResponse = {
        id: 'onboarding-1',
        patientId: 'patient-1',
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: false,
        completedAt: '2025-01-15T10:00:00Z',
      };

      const { service, onboardingRepository } = createService({
        repositoryReturnValue: mockExistingResponse,
      });

      const input = {
        age: 40,
        diet: 'Vegetarian',
        sleep: '6-7 hours',
        bruxismClenching: true,
      };

      await expect(
        service.submitOnboardingResponse('patient-1', input),
      ).rejects.toMatchObject({
        code: ErrorCodes.ALREADY_COMPLETED,
      });

      expect(onboardingRepository.createOnboardingResponse).not.toHaveBeenCalled();
    });

    it('validates required fields', async () => {
      const { service } = createService({});

      await expect(
        service.submitOnboardingResponse('patient-1', {
          age: 0,
          diet: '',
          sleep: '',
          bruxismClenching: false,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });
    });

    it('validates age range', async () => {
      const { service } = createService({});

      await expect(
        service.submitOnboardingResponse('patient-1', {
          age: 0,
          diet: 'Balanced',
          sleep: '7-8 hours',
          bruxismClenching: false,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });

      await expect(
        service.submitOnboardingResponse('patient-1', {
          age: 151,
          diet: 'Balanced',
          sleep: '7-8 hours',
          bruxismClenching: false,
        }),
      ).rejects.toMatchObject({
        code: ErrorCodes.INVALID_INPUT,
      });
    });
  });
});

