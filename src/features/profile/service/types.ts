export type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  checkInReminders: boolean;
  articleUpdates: boolean;
};

export type PrivacySettings = {
  dataSharing: boolean;
  analytics: boolean;
};

export type ProfileUpdateInput = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
};

export type SupportContactInput = {
  subject: string;
  message: string;
  category?: 'technical' | 'account' | 'medical' | 'other';
};





