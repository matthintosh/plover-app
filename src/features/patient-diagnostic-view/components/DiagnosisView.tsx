/**
 * DiagnosisView Component
 * 
 * Displays patient diagnosis information (gingivitis or periodontitis).
 * Shows grade and stage for periodontitis diagnoses.
 */

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePatientDiagnosticView } from '../hooks/usePatientDiagnosticView';
import {
    EMPTY_DIAGNOSIS_MESSAGE,
    ERROR_MESSAGES,
} from '../service/constants';

export interface DiagnosisViewProps {
  onRetry?: () => void;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = React.memo(({
  onRetry,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const {
    diagnosis,
    diagnosisLoading,
    diagnosisError,
    refetchDiagnosis,
  } = usePatientDiagnosticView();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      refetchDiagnosis();
    }
  };

  // Loading state
  if (diagnosisLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Skeleton width="60%" height={24} style={styles.skeletonTitle} />
        <Skeleton width="40%" height={16} style={styles.skeletonDetail} />
        <Skeleton width="50%" height={12} style={styles.skeletonTimestamp} />
      </View>
    );
  }

  // Error state
  if (diagnosisError) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.errorText, { color: palette.error }]}>
          {ERROR_MESSAGES.DIAGNOSIS}
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

  // Empty state
  if (!diagnosis) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
          {EMPTY_DIAGNOSIS_MESSAGE}
        </Text>
      </View>
    );
  }

  // Display diagnosis
  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}>
      <Text style={[styles.title, { color: palette.text }]}>
        {diagnosis.displayLabel}
      </Text>

      {diagnosis.type === 'periodontitis' && (
        <View style={styles.detailsRow}>
          {diagnosis.gradeLabel && (
            <Text style={[styles.detailText, { color: palette.textSecondary }]}>
              {diagnosis.gradeLabel}
            </Text>
          )}
          {diagnosis.stageLabel && (
            <Text style={[styles.detailText, { color: palette.textSecondary }]}>
              {diagnosis.stageLabel}
            </Text>
          )}
        </View>
      )}

      {diagnosis.type === 'gingivitis' && (
        <Text style={[styles.detailText, { color: palette.textSecondary }]}>
          No grade or stage required.
        </Text>
      )}

      <Text style={[styles.timestampText, { color: palette.textSecondary }]}>
        Last updated: {diagnosis.lastUpdated}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  detailText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  retryButton: {
    marginTop: Spacing.sm,
  },
  skeletonTitle: {
    marginBottom: Spacing.xs,
  },
  skeletonDetail: {
    marginBottom: Spacing.sm,
  },
  skeletonTimestamp: {
    marginTop: Spacing.xs,
  },
});

