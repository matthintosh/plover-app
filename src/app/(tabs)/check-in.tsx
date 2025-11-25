import { LinearBackground } from '@/components/ui/LinearBackground';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { DailyCheckInForm } from '@/features/daily-check-in/components/DailyCheckInForm';
import { useCheckIn } from '@/features/daily-check-in/hooks/useCheckIn';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserFriendlyMessage, normalizeError } from '@/lib/utils/error-handling';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function CheckInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const { patient, isAuthenticated, userType, isLoading: authLoading } = useAuth();

  // Get today's date
  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const {
    checkIn,
    isLoading: checkInLoading,
    error,
    createOrUpdateCheckIn,
    isSubmitting,
  } = useCheckIn({
    patientId: patient?.id,
    date: todayDateString,
    enabled: !!patient?.id,
  });

  // Redirect if not authenticated as patient
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || userType !== 'patient')) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, isAuthenticated, userType, router]);

  if (authLoading || checkInLoading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.centeredText, { color: palette.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  const handleSubmit = async (data: Parameters<typeof createOrUpdateCheckIn>[0]) => {
    try {
      await createOrUpdateCheckIn(data);
      // Optionally navigate back or show success message
      // For now, the form will update with the new data
    } catch (err) {
      // Error is handled by the hook and displayed in the component
      console.error('[CheckInScreen] Failed to submit check-in', err);
    }
  };

  const errorMessage = error
    ? getUserFriendlyMessage(normalizeError(error))
    : null;

  return (
    <LinearBackground>
    <View style={[styles.container]}>
      <DailyCheckInForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={errorMessage}
        existingCheckIn={checkIn}
      />
    </View>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
  },
  centeredText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});

