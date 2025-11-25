import { ProfileService } from '../profile.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('ProfileService', () => {
  const createService = ({
    updateProfileSuccess = true,
    updateNotificationSuccess = true,
    updatePrivacySuccess = true,
    deleteAccountSuccess = true,
  }: {
    updateProfileSuccess?: boolean;
    updateNotificationSuccess?: boolean;
    updatePrivacySuccess?: boolean;
    deleteAccountSuccess?: boolean;
  } = {}) => {
    const profileRepository = {
      updatePatientProfile: jest.fn().mockResolvedValue(undefined),
      getNotificationSettings: jest.fn().mockResolvedValue({
        emailNotifications: true,
        pushNotifications: true,
        checkInReminders: true,
        articleUpdates: false,
      }),
      updateNotificationSettings: jest.fn().mockResolvedValue(undefined),
      getPrivacySettings: jest.fn().mockResolvedValue({
        dataSharing: true,
        analytics: true,
      }),
      updatePrivacySettings: jest.fn().mockResolvedValue(undefined),
      deletePatientAccount: jest.fn().mockResolvedValue(undefined),
    };

    return {
      service: new ProfileService(profileRepository as any),
      profileRepository,
    };
  };

  describe('updateProfile', () => {
    it('updates profile through repository', async () => {
      const { service, profileRepository } = createService();

      await service.updateProfile('patient-1', {
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
      });

      expect(profileRepository.updatePatientProfile).toHaveBeenCalledWith('patient-1', {
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
      });
    });
  });

  describe('getNotificationSettings', () => {
    it('returns notification settings from repository', async () => {
      const { service, profileRepository } = createService();

      const result = await service.getNotificationSettings('patient-1');

      expect(profileRepository.getNotificationSettings).toHaveBeenCalledWith('patient-1');
      expect(result).toBeTruthy();
      expect(result?.emailNotifications).toBe(true);
    });
  });

  describe('updateNotificationSettings', () => {
    it('updates notification settings through repository', async () => {
      const { service, profileRepository } = createService();

      const settings = {
        emailNotifications: false,
        pushNotifications: true,
        checkInReminders: true,
        articleUpdates: true,
      };

      await service.updateNotificationSettings('patient-1', settings);

      expect(profileRepository.updateNotificationSettings).toHaveBeenCalledWith(
        'patient-1',
        settings,
      );
    });
  });

  describe('getPrivacySettings', () => {
    it('returns privacy settings from repository', async () => {
      const { service, profileRepository } = createService();

      const result = await service.getPrivacySettings('patient-1');

      expect(profileRepository.getPrivacySettings).toHaveBeenCalledWith('patient-1');
      expect(result).toBeTruthy();
      expect(result?.dataSharing).toBe(true);
    });
  });

  describe('updatePrivacySettings', () => {
    it('updates privacy settings through repository', async () => {
      const { service, profileRepository } = createService();

      const settings = {
        dataSharing: false,
        analytics: false,
      };

      await service.updatePrivacySettings('patient-1', settings);

      expect(profileRepository.updatePrivacySettings).toHaveBeenCalledWith('patient-1', settings);
    });
  });

  describe('deleteAccount', () => {
    it('deletes account through repository', async () => {
      const { service, profileRepository } = createService();

      await service.deleteAccount('patient-1');

      expect(profileRepository.deletePatientAccount).toHaveBeenCalledWith('patient-1');
    });
  });

  describe('contactSupport', () => {
    it('sends support contact message', async () => {
      const { service } = createService();

      // For now, contactSupport might just log or send to a service
      // In production, this would send an email or create a support ticket
      await expect(
        service.contactSupport('patient-1', {
          subject: 'Help needed',
          message: 'I need assistance',
          category: 'technical',
        }),
      ).resolves.not.toThrow();
    });
  });
});

