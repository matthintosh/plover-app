/**
 * Medical Information Page
 * 
 * Displays comprehensive medical information including diagnosis,
 * risk factors, and oral hygiene recommendations.
 */

import { LinearBackground } from '@/components/ui/LinearBackground';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { ComprehensiveMedicalView } from '@/features/patient-diagnostic-view/components/ComprehensiveMedicalView';
import { Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function MedicalInfoScreen() {
  const { isAuthenticated, userType, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated or not a patient
  if (!authLoading && (!isAuthenticated || userType !== 'patient')) {
    return <Redirect href="/(auth)/login" />;
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <LinearBackground>
        <View style={styles.container} />
      </LinearBackground>
    );
  }

  return (
    <LinearBackground>
      <View style={styles.container}>
        <ComprehensiveMedicalView />
      </View>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

