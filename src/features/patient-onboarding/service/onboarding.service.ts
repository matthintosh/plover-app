import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { OnboardingRepositoryPort } from '../repository/onboarding.repository.interface';
import { OnboardingRepository } from '../repository/onboarding.repository';
import type { OnboardingInput, OnboardingResponse } from './types';

export class OnboardingService {
  constructor(
    private readonly onboardingRepository: OnboardingRepositoryPort = new OnboardingRepository(),
  ) {}

  async getOnboardingResponse(patientId: string): Promise<OnboardingResponse | null> {
    const response = await this.onboardingRepository.getOnboardingResponseByPatientId(
      patientId,
    );

    if (!response) {
      return null;
    }

    return {
      id: response.id,
      patientId: response.patientId,
      age: response.age,
      diet: response.diet,
      sleep: response.sleep,
      bruxismClenching: response.bruxismClenching,
      completedAt: response.completedAt,
    };
  }

  async submitOnboardingResponse(
    patientId: string,
    data: OnboardingInput,
  ): Promise<OnboardingResponse> {
    // Check if onboarding already completed
    const existing = await this.onboardingRepository.getOnboardingResponseByPatientId(
      patientId,
    );

    if (existing) {
      throw new AppError(
        ErrorCodes.ALREADY_COMPLETED,
        'Onboarding questionnaire has already been completed',
      );
    }

    // Validate input
    this.validateOnboardingInput(data);

    // Create onboarding response
    const response = await this.onboardingRepository.createOnboardingResponse(
      patientId,
      data,
    );

    return {
      id: response.id,
      patientId: response.patientId,
      age: response.age,
      diet: response.diet,
      sleep: response.sleep,
      bruxismClenching: response.bruxismClenching,
      completedAt: response.completedAt,
    };
  }

  private validateOnboardingInput(data: OnboardingInput): void {
    // Validate age
    if (!data.age || data.age < 1 || data.age > 150) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'Age must be between 1 and 150',
      );
    }

    // Validate diet
    if (!data.diet || data.diet.trim().length === 0) {
      throw new AppError(ErrorCodes.INVALID_INPUT, 'Diet information is required');
    }

    // Validate sleep
    if (!data.sleep || data.sleep.trim().length === 0) {
      throw new AppError(ErrorCodes.INVALID_INPUT, 'Sleep information is required');
    }

    // bruxismClenching is boolean, so it's always valid
  }
}

