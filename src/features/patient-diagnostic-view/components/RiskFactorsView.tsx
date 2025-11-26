/**
 * RiskFactorsView Component
 * 
 * Displays all risk factors associated with the patient's periodontal health.
 */

import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePatientDiagnosticView } from '../hooks/usePatientDiagnosticView';
import {
    EMPTY_RISK_FACTORS_MESSAGE,
    ERROR_MESSAGES,
} from '../service/constants';

export interface RiskFactorsViewProps {
  onRetry?: () => void;
}

export const RiskFactorsView: React.FC<RiskFactorsViewProps> = React.memo(({
  onRetry,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const {
    riskFactors,
    riskFactorsLoading,
    riskFactorsError,
    refetchRiskFactors,
  } = usePatientDiagnosticView();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      refetchRiskFactors();
    }
  };

  // Loading state
  if (riskFactorsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Skeleton width="40%" height={20} style={styles.skeletonTitle} />
        <SkeletonText lines={3} width="100%" />
      </View>
    );
  }

  // Error state
  if (riskFactorsError) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.errorText, { color: palette.error }]}>
          {ERROR_MESSAGES.RISK_FACTORS}
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
  if (!riskFactors || riskFactors.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
          {EMPTY_RISK_FACTORS_MESSAGE}
        </Text>
      </View>
    );
  }

  // Display risk factors
  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}>
      <Text style={[styles.title, { color: palette.text }]}>
        Risk Factors
      </Text>
      <ScrollView style={styles.list}>
        {riskFactors.map((riskFactor) => (
          <View
            key={riskFactor.id}
            style={[
              styles.riskFactorItem,
              { borderColor: palette.border },
            ]}
          >
            <Text style={[styles.riskFactorType, { color: palette.text }]}>
              {riskFactor.displayLabel}
            </Text>
            {riskFactor.formattedDetails && (
              <Text
                style={[
                  styles.riskFactorDetails,
                  { color: palette.textSecondary },
                ]}
              >
                {riskFactor.formattedDetails}
              </Text>
            )}
            <Text
              style={[
                styles.timestampText,
                { color: palette.textSecondary },
              ]}
            >
              Last updated: {riskFactor.lastUpdated}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: Spacing.md,
  },
  list: {
    maxHeight: 400,
  },
  riskFactorItem: {
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: Spacing.sm,
    borderWidth: 1,
  },
  riskFactorType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  riskFactorDetails: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  timestampText: {
    fontSize: 12,
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
    marginBottom: Spacing.md,
  },
});

