import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { OnboardingQuestionnaire } from '@/features/patient-onboarding/components/OnboardingQuestionnaire';
import { useOnboarding } from '@/features/patient-onboarding/hooks/useOnboarding';
import { getUserFriendlyMessage } from '@/lib/utils/error-handling';
import { normalizeError } from '@/lib/utils/error-handling';

export default function OnboardingScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const { patient, isAuthenticated, userType, isLoading: authLoading } = useAuth();

  const {
    onboardingResponse,
    isLoading: onboardingLoading,
    error,
    submitOnboarding,
    isSubmitting,
  } = useOnboarding({
    patientId: patient?.id,
    enabled: !!patient?.id,
  });

  // Redirect if not authenticated as patient
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || userType !== 'patient')) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, isAuthenticated, userType, router]);

  // Redirect if onboarding already completed
  useEffect(() => {
    if (onboardingResponse || patient?.onboardingCompleted) {
      router.replace('/(tabs)/index');
    }
  }, [onboardingResponse, patient?.onboardingCompleted, router]);

  if (authLoading || onboardingLoading) {
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

  if (onboardingResponse || patient?.onboardingCompleted) {
    return <Redirect href={{ pathname: '/(tabs)/index' }} />;
  }

  const handleSubmit = async (data: Parameters<typeof submitOnboarding>[0]) => {
    try {
      await submitOnboarding(data);
      // Navigation will happen automatically via useEffect when onboardingResponse updates
    } catch (err) {
      // Error is handled by the hook and displayed in the component
      console.error('[OnboardingScreen] Failed to submit onboarding', err);
    }
  };

  const errorMessage = error
    ? getUserFriendlyMessage(normalizeError(error))
    : null;

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <OnboardingQuestionnaire
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={errorMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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

