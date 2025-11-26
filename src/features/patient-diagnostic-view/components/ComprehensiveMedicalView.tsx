/**
 * ComprehensiveMedicalView Component
 * 
 * Displays all patient medical information (diagnosis, risk factors, recommendations)
 * together in a unified view.
 */

import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePatientDiagnosticView } from '../hooks/usePatientDiagnosticView';
import {
    EMPTY_COMPREHENSIVE_MESSAGE,
    ERROR_MESSAGES,
} from '../service/constants';
import { DiagnosisView } from './DiagnosisView';
import { RecommendationsView } from './RecommendationsView';
import { RiskFactorsView } from './RiskFactorsView';

export interface ComprehensiveMedicalViewProps {
  onRetry?: () => void;
}

export const ComprehensiveMedicalView: React.FC<
  ComprehensiveMedicalViewProps
> = ({ onRetry }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const {
    comprehensiveInfo,
    comprehensiveLoading,
    comprehensiveError,
    isLoading,
    refetchAll,
  } = usePatientDiagnosticView();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      refetchAll();
    }
  };

  // Loading state
  if (comprehensiveLoading || isLoading) {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <SkeletonCard showTitle={true} showDescription={true} />
          <SkeletonCard showTitle={true} showDescription={true} />
          <SkeletonCard showTitle={true} showDescription={true} />
        </View>
      </ScrollView>
    );
  }

  // Error state
  if (comprehensiveError) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.errorText, { color: palette.error }]}>
          {ERROR_MESSAGES.COMPREHENSIVE}
        </Text>
        <Button
          title="Retry"
          onPress={handleRetry}
          variant="outline"
          style={styles.retryButton}
        />
      </View>
    );
  }

  // Empty state - no data at all
  if (
    !comprehensiveInfo ||
    (!comprehensiveInfo.diagnosis &&
      comprehensiveInfo.riskFactors.length === 0 &&
      !comprehensiveInfo.recommendation)
  ) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
          {EMPTY_COMPREHENSIVE_MESSAGE}
        </Text>
      </View>
    );
  }

  // Display comprehensive information
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={[styles.pageTitle, { color: palette.text }]}>
          Medical Information
        </Text>

        {/* Diagnosis Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Diagnosis
          </Text>
          <DiagnosisView onRetry={onRetry} />
        </View>

        {/* Risk Factors Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Risk Factors
          </Text>
          <RiskFactorsView onRetry={onRetry} />
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>
            Recommendations
          </Text>
          <RecommendationsView onRetry={onRetry} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: 16,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  retryButton: {
    marginTop: Spacing.sm,
  },
});

