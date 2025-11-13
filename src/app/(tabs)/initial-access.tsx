import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { DiagnosisDisplay } from '@/features/follow-up/components/DiagnosisDisplay';
import { RiskFactorsDisplay } from '@/features/follow-up/components/RiskFactorsDisplay';
import { useFollowUp } from '@/features/follow-up/hooks/useFollowUp';

export default function InitialAccessScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { patient, isAuthenticated, userType, isLoading: authLoading } = useAuth();

  const {
    diagnosis,
    riskFactors,
    isLoading: followUpLoading,
    isFetching,
    error,
    refetch,
  } = useFollowUp({
    patientId: patient?.id,
    enabled: !!patient?.id,
  });

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (authLoading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={[styles.centeredText, { color: palette.textSecondary }]}>
          Preparing your records…
        </Text>
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  const errorMessage = error ? error.message : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.backgroundSecondary }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={handleRefresh}
          tintColor={palette.primary}
        />
      }>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: palette.text }]}>
          Welcome{patient?.email ? `, ${patient.email}` : ''}
        </Text>
        <Text style={[styles.subheading, { color: palette.textSecondary }]}>
          Here is the information your periodontist shared to help you get started.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Diagnosis</Text>
        <DiagnosisDisplay
          diagnosis={diagnosis}
          isLoading={followUpLoading && !diagnosis}
          error={errorMessage}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Risk Factors</Text>
        <RiskFactorsDisplay
          riskFactors={riskFactors}
          isLoading={followUpLoading && !riskFactors.length}
          error={errorMessage}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
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
  header: {
    gap: Spacing.sm,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
  },
  subheading: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
});

