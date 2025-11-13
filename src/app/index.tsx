import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { WelcomeScreen } from '@/features/authentication/components/WelcomeScreen';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootRedirect() {
  const { isLoading, isAuthenticated, userType } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  if (userType === 'periodontist') {
    return <Redirect href="/(periodontist)/dashboard" />;
  }

  if (userType === 'patient') {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

