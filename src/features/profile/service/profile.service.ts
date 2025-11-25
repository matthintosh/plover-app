import type { ProfileRepositoryPort } from '../repository/profile.repository.interface';
import { ProfileRepository } from '../repository/profile.repository';
import type {
  ProfileUpdateInput,
  NotificationSettings,
  PrivacySettings,
  SupportContactInput,
} from './types';

export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepositoryPort = new ProfileRepository(),
  ) {}

  async updateProfile(patientId: string, data: ProfileUpdateInput): Promise<void> {
    return await this.profileRepository.updatePatientProfile(patientId, data);
  }

  async getNotificationSettings(patientId: string): Promise<NotificationSettings | null> {
    return await this.profileRepository.getNotificationSettings(patientId);
  }

  async updateNotificationSettings(
    patientId: string,
    settings: NotificationSettings,
  ): Promise<void> {
    return await this.profileRepository.updateNotificationSettings(patientId, settings);
  }

  async getPrivacySettings(patientId: string): Promise<PrivacySettings | null> {
    return await this.profileRepository.getPrivacySettings(patientId);
  }

  async updatePrivacySettings(patientId: string, settings: PrivacySettings): Promise<void> {
    return await this.profileRepository.updatePrivacySettings(patientId, settings);
  }

  async deleteAccount(patientId: string): Promise<void> {
    return await this.profileRepository.deletePatientAccount(patientId);
  }

  async contactSupport(patientId: string, input: SupportContactInput): Promise<void> {
    // In production, this would send an email or create a support ticket
    // For now, we'll just log it
    console.log('Support contact:', {
      patientId,
      ...input,
    });

    // TODO: Implement actual support contact submission
    // This could use Supabase Edge Function or external service
  }
}



