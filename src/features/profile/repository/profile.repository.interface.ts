import type { ProfileUpdateInput, NotificationSettings, PrivacySettings } from '../service/types';

export interface ProfileRepositoryPort {
  updatePatientProfile(patientId: string, data: ProfileUpdateInput): Promise<void>;
  getNotificationSettings(patientId: string): Promise<NotificationSettings | null>;
  updateNotificationSettings(patientId: string, settings: NotificationSettings): Promise<void>;
  getPrivacySettings(patientId: string): Promise<PrivacySettings | null>;
  updatePrivacySettings(patientId: string, settings: PrivacySettings): Promise<void>;
  deletePatientAccount(patientId: string): Promise<void>;
}



