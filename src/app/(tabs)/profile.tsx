import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { LinearBackground } from '@/components/ui/LinearBackground';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AccountDeletion } from '@/features/profile/components/AccountDeletion';
import { NotificationSettingsComponent } from '@/features/profile/components/NotificationSettings';
import { PrivacySettingsComponent } from '@/features/profile/components/PrivacySettings';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { SupportContact } from '@/features/profile/components/SupportContact';
import { useProfile } from '@/features/profile/hooks/useProfile';
import type {
  NotificationSettings,
  PrivacySettings,
} from '@/features/profile/service/types';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const { patient, isAuthenticated, userType, isLoading: authLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    updateProfile,
    isUpdating,
    getNotificationSettings,
    updateNotificationSettings,
    isUpdatingNotifications,
    getPrivacySettings,
    updatePrivacySettings,
    isUpdatingPrivacy,
    deleteAccount,
    isDeleting,
    contactSupport,
    isContactingSupport,
  } = useProfile({
    patientId: patient?.id,
    enabled: isAuthenticated && userType === 'patient',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(
    null,
  );
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [privacyError, setPrivacyError] = useState<string | null>(null);
  const [supportError, setSupportError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (patient?.id) {
        try {
          const notifications = await getNotificationSettings();
          setNotificationSettings(notifications);
          const privacy = await getPrivacySettings();
          setPrivacySettings(privacy);
        } catch (err) {
          console.error('Failed to load settings:', err);
        }
      }
    };

    loadSettings();
  }, [patient?.id, getNotificationSettings, getPrivacySettings]);

  const handleUpdateProfile = async (values: any) => {
    try {
      setProfileError(null);
      await updateProfile(values);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile');
    }
  };

  const handleUpdateNotifications = async (settings: NotificationSettings) => {
    try {
      setNotificationError(null);
      await updateNotificationSettings(settings);
      setNotificationSettings(settings);
    } catch (err: any) {
      setNotificationError(err.message || 'Failed to update notification settings');
    }
  };

  const handleUpdatePrivacy = async (settings: PrivacySettings) => {
    try {
      setPrivacyError(null);
      await updatePrivacySettings(settings);
      setPrivacySettings(settings);
    } catch (err: any) {
      setPrivacyError(err.message || 'Failed to update privacy settings');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Sign out after account deletion
      await logout();
    } catch (err: any) {
      alert(err.message || 'Failed to delete account');
    }
  };

  const handleContactSupport = async (input: any) => {
    try {
      setSupportError(null);
      await contactSupport(input);
      alert('Support message sent successfully. We will get back to you soon.');
    } catch (err: any) {
      setSupportError(err.message || 'Failed to send support message');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Redirect to login page after logout
      router.replace('/(auth)/login');
    } catch (err: any) {
      setIsLoggingOut(false);
      alert(err.message || 'Failed to logout. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <Text style={[styles.loadingText, { color: palette.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  return (
    <LinearBackground>
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Profile</Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Manage your account settings and preferences
        </Text>
      </View>

      <ProfileForm
        initialValues={{
          fullName: undefined, // Could be loaded from patient metadata
          email: patient?.email,
          phoneNumber: undefined, // Could be loaded from patient metadata
        }}
        loading={isUpdating}
        error={profileError}
        onSubmit={handleUpdateProfile}
      />

      <NotificationSettingsComponent
        initialSettings={notificationSettings}
        loading={isUpdatingNotifications}
        error={notificationError}
        onLoadSettings={getNotificationSettings}
        onSave={handleUpdateNotifications}
      />

      <PrivacySettingsComponent
        initialSettings={privacySettings}
        loading={isUpdatingPrivacy}
        error={privacyError}
        onLoadSettings={getPrivacySettings}
        onSave={handleUpdatePrivacy}
      />

      <SupportContact
        onSubmit={handleContactSupport}
        loading={isContactingSupport}
        error={supportError}
      />

      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          loading={isLoggingOut}
          variant="outline"
          fullWidth
          accessibilityLabel="Logout"
          accessibilityHint="Sign out of your account"
        />
      </View>

      <AccountDeletion onDelete={handleDeleteAccount} loading={isDeleting} />
    </ScrollView>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  logoutSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
});

