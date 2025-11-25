import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { ProfileRepositoryPort } from './profile.repository.interface';
import type {
  ProfileUpdateInput,
  NotificationSettings,
  PrivacySettings,
} from '../service/types';

// Store notification and privacy settings in patient metadata (JSONB field)
// For now, we'll use a simple approach storing in patient table metadata
// In production, these could be separate tables

export class ProfileRepository implements ProfileRepositoryPort {
  async updatePatientProfile(patientId: string, data: ProfileUpdateInput): Promise<void> {
    const updateData: Record<string, any> = {};

    // Note: email updates would require Supabase Auth update, handled separately
    if (data.fullName !== undefined) {
      updateData.full_name = data.fullName;
    }
    if (data.phoneNumber !== undefined) {
      updateData.phone_number = data.phoneNumber;
    }

    if (Object.keys(updateData).length === 0) {
      return;
    }

    const { error } = await supabase
      .from('patient')
      .update(updateData)
      .eq('id', patientId);

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }
  }

  async getNotificationSettings(patientId: string): Promise<NotificationSettings | null> {
    // For now, return default settings
    // In production, these would be stored in patient metadata or separate table
    return {
      emailNotifications: true,
      pushNotifications: true,
      checkInReminders: true,
      articleUpdates: false,
    };
  }

  async updateNotificationSettings(
    patientId: string,
    settings: NotificationSettings,
  ): Promise<void> {
    // Store in patient metadata (JSONB field)
    // For now, we'll use a metadata field if it exists, otherwise skip
    // In production, this would be a separate table or metadata column
    const { error } = await supabase
      .from('patient')
      .update({
        notification_settings: settings,
      })
      .eq('id', patientId);

    if (error) {
      // If metadata column doesn't exist, we'll handle gracefully
      // In production, ensure metadata column exists
      console.warn('Notification settings update failed:', error);
    }
  }

  async getPrivacySettings(patientId: string): Promise<PrivacySettings | null> {
    // For now, return default settings
    return {
      dataSharing: true,
      analytics: true,
    };
  }

  async updatePrivacySettings(patientId: string, settings: PrivacySettings): Promise<void> {
    // Store in patient metadata
    const { error } = await supabase
      .from('patient')
      .update({
        privacy_settings: settings,
      })
      .eq('id', patientId);

    if (error) {
      console.warn('Privacy settings update failed:', error);
    }
  }

  async deletePatientAccount(patientId: string): Promise<void> {
    // Delete patient record (cascade will handle related records)
    const { error } = await supabase.from('patient').delete().eq('id', patientId);

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    // Note: Supabase Auth user deletion should be handled separately via admin API
    // This is a sensitive operation and should require additional confirmation
  }
}



