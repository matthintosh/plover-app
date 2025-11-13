import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/authentication/hooks/useAuth';

export default function PatientProtectedLayout() {
  const { isLoading, isAuthenticated, userType } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
});
