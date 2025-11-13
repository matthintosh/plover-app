import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { LinearBackground } from '@/components/ui/LinearBackground';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/authentication/hooks/useAuth';

export default function PeriodontistProtectedLayout() {
  const { isLoading, isAuthenticated, userType } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated && userType !== 'periodontist') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  return <LinearBackground>
    <Slot />
  </LinearBackground>;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
});
