import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { ProfileService } from '../service/profile.service';
import type {
  ProfileUpdateInput,
  NotificationSettings,
  PrivacySettings,
  SupportContactInput,
} from '../service/types';

export interface UseProfileOptions {
  patientId?: string | null;
  enabled?: boolean;
}

export interface UseProfileResult {
  updateProfile: (data: ProfileUpdateInput) => Promise<void>;
  isUpdating: boolean;
  getNotificationSettings: () => Promise<NotificationSettings | null>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  isUpdatingNotifications: boolean;
  getPrivacySettings: () => Promise<PrivacySettings | null>;
  updatePrivacySettings: (settings: PrivacySettings) => Promise<void>;
  isUpdatingPrivacy: boolean;
  deleteAccount: () => Promise<void>;
  isDeleting: boolean;
  contactSupport: (input: SupportContactInput) => Promise<void>;
  isContactingSupport: boolean;
}

export const useProfile = ({
  patientId,
  enabled = true,
}: UseProfileOptions): UseProfileResult => {
  const queryClient = useQueryClient();
  const profileService = useMemo(() => new ProfileService(), []);
  const isEnabled = enabled && !!patientId;

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateInput) =>
      profileService.updateProfile(patientId as string, data),
    onSuccess: async () => {
      // Invalidate patient queries
      await queryClient.invalidateQueries({
        queryKey: ['patient', patientId],
      });
    },
  });

  const updateNotificationMutation = useMutation({
    mutationFn: (settings: NotificationSettings) =>
      profileService.updateNotificationSettings(patientId as string, settings),
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: (settings: PrivacySettings) =>
      profileService.updatePrivacySettings(patientId as string, settings),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => profileService.deleteAccount(patientId as string),
    onSuccess: async () => {
      // Invalidate all queries and redirect will happen via auth state change
      await queryClient.clear();
    },
  });

  const contactSupportMutation = useMutation({
    mutationFn: (input: SupportContactInput) =>
      profileService.contactSupport(patientId as string, input),
  });

  const getNotificationSettings = async () => {
    if (!patientId) {
      return null;
    }
    return await profileService.getNotificationSettings(patientId);
  };

  const getPrivacySettings = async () => {
    if (!patientId) {
      return null;
    }
    return await profileService.getPrivacySettings(patientId);
  };

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    getNotificationSettings,
    updateNotificationSettings: updateNotificationMutation.mutateAsync,
    isUpdatingNotifications: updateNotificationMutation.isPending,
    getPrivacySettings,
    updatePrivacySettings: updatePrivacyMutation.mutateAsync,
    isUpdatingPrivacy: updatePrivacyMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeleting: deleteAccountMutation.isPending,
    contactSupport: contactSupportMutation.mutateAsync,
    isContactingSupport: contactSupportMutation.isPending,
  };
};



