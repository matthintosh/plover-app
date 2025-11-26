import { ProfileService } from '../../service/profile.service';
import { ProfileRepository } from '../../repository/profile.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('ProfileService - Profile Update Integration', () => {
  const createService = () => {
    const profileRepository = new ProfileRepository();
    return {
      service: new ProfileService(profileRepository),
      profileRepository,
    };
  };

  it('updates profile through service and repository', async () => {
    const { service, profileRepository } = createService();

    jest.spyOn(profileRepository, 'updatePatientProfile').mockResolvedValue(undefined);

    await service.updateProfile('patient-1', {
      fullName: 'John Doe',
      phoneNumber: '+1234567890',
    });

    expect(profileRepository.updatePatientProfile).toHaveBeenCalledWith('patient-1', {
      fullName: 'John Doe',
      phoneNumber: '+1234567890',
    });
  });

  it('updates notification settings through service', async () => {
    const { service, profileRepository } = createService();

    const settings = {
      emailNotifications: false,
      pushNotifications: true,
      checkInReminders: true,
      articleUpdates: true,
    };

    jest.spyOn(profileRepository, 'updateNotificationSettings').mockResolvedValue(undefined);

    await service.updateNotificationSettings('patient-1', settings);

    expect(profileRepository.updateNotificationSettings).toHaveBeenCalledWith(
      'patient-1',
      settings,
    );
  });

  it('updates privacy settings through service', async () => {
    const { service, profileRepository } = createService();

    const settings = {
      dataSharing: false,
      analytics: false,
    };

    jest.spyOn(profileRepository, 'updatePrivacySettings').mockResolvedValue(undefined);

    await service.updatePrivacySettings('patient-1', settings);

    expect(profileRepository.updatePrivacySettings).toHaveBeenCalledWith('patient-1', settings);
  });
});





