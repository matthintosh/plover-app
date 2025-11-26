import { Redirect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { DiagnosisDisplay } from '@/features/follow-up/components/DiagnosisDisplay';
import { OdontogramDisplay } from '@/features/follow-up/components/OdontogramDisplay';
import { RiskFactorsDisplay } from '@/features/follow-up/components/RiskFactorsDisplay';
import { useFollowUp } from '@/features/follow-up/hooks/useFollowUp';
import { useRecommendation } from '@/features/follow-up/hooks/useRecommendation';
import { DateRangeSelector } from '@/features/statistics/components/DateRangeSelector';
import { EmptyState } from '@/features/statistics/components/EmptyState';
import { TrendsDisplay } from '@/features/statistics/components/TrendsDisplay';
import { useStatistics } from '@/features/statistics/hooks/useStatistics';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

  const {
    recommendation,
    isLoading: recommendationLoading,
    error: recommendationError,
    refetch: refetchRecommendation,
  } = useRecommendation({
    patientId: patient?.id,
    enabled: !!patient?.id,
  });

  // Statistics date range state
  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [statisticsStartDate, setStatisticsStartDate] = useState<string>(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const year = thirtyDaysAgo.getFullYear();
    const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
    const day = String(thirtyDaysAgo.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [statisticsEndDate, setStatisticsEndDate] = useState<string>(todayDateString);

  const {
    statistics,
    isLoading: statisticsLoading,
    error: statisticsError,
  } = useStatistics({
    patientId: patient?.id,
    startDate: statisticsStartDate,
    endDate: statisticsEndDate,
    enabled: !!patient?.id && isAuthenticated && userType === 'patient',
  });

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setStatisticsStartDate(startDate);
    setStatisticsEndDate(endDate);
  };

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetch(), refetchRecommendation()]);
  }, [refetch, refetchRecommendation]);

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
          Welcome{patient?.fullName ? `, ${patient.fullName}` : patient?.email ? `, ${patient.email}` : ''}
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

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>
          Oral Hygiene Recommendations
        </Text>
        {recommendation && (
          <View style={styles.recommendationInfo}>
            {recommendation.toothbrushType && (
              <Text style={[styles.infoText, { color: palette.text }]}>
                Toothbrush Type: {recommendation.toothbrushType}
              </Text>
            )}
            {recommendation.toothbrushBrand && (
              <Text style={[styles.infoText, { color: palette.text }]}>
                Brand: {recommendation.toothbrushBrand}
              </Text>
            )}
            {recommendation.toothbrushModel && (
              <Text style={[styles.infoText, { color: palette.text }]}>
                Model: {recommendation.toothbrushModel}
              </Text>
            )}
          </View>
        )}
        <OdontogramDisplay
          odontogram={recommendation?.odontogram}
          isLoading={recommendationLoading}
          error={recommendationError?.message ?? null}
        />
      </View>

      {/* Statistics Section */}
      <Card style={styles.statisticsCard}>
        <View style={styles.statisticsHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Statistics & Trends</Text>
        </View>
        <DateRangeSelector
          startDate={statisticsStartDate}
          endDate={statisticsEndDate}
          onDateRangeChange={handleDateRangeChange}
        />
        {statisticsLoading ? (
          <View style={styles.statisticsLoading}>
            <Text style={[styles.loadingText, { color: palette.textSecondary }]}>
              Loading statistics...
            </Text>
          </View>
        ) : statisticsError ? (
          <View style={styles.statisticsError}>
            <Text style={[styles.errorText, { color: palette.error }]}>
              {statisticsError.message || 'Failed to load statistics'}
            </Text>
          </View>
        ) : statistics && statistics.totalCheckIns > 0 ? (
          <TrendsDisplay statistics={statistics} />
        ) : (
          <EmptyState
            title="No Statistics Available"
            message="Complete your first daily check-in to see statistics and trends."
          />
        )}
      </Card>
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
  recommendationInfo: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  statisticsCard: {
    marginTop: Spacing.md,
  },
  statisticsHeader: {
    marginBottom: Spacing.md,
  },
  statisticsLoading: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  statisticsError: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
});

