/**
 * RecommendationsView Component
 * 
 * Displays oral hygiene recommendations (toothbrush type, brand, model)
 * prescribed by the periodontist.
 */

import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePatientDiagnosticView } from '../hooks/usePatientDiagnosticView';
import {
    EMPTY_RECOMMENDATIONS_MESSAGE,
    ERROR_MESSAGES,
} from '../service/constants';

export interface RecommendationsViewProps {
  onRetry?: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = React.memo(({
  onRetry,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const {
    recommendations,
    recommendationsLoading,
    recommendationsError,
    refetchRecommendations,
  } = usePatientDiagnosticView();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      refetchRecommendations();
    }
  };

  // Loading state
  if (recommendationsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Skeleton width="50%" height={20} style={styles.skeletonTitle} />
        <SkeletonText lines={2} width="100%" />
      </View>
    );
  }

  // Error state
  if (recommendationsError) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.errorText, { color: palette.error }]}>
          {ERROR_MESSAGES.RECOMMENDATIONS}
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
  if (!recommendations) {
    return (
      <View style={[styles.container, { backgroundColor: palette.surface }]}>
        <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
          {EMPTY_RECOMMENDATIONS_MESSAGE}
        </Text>
      </View>
    );
  }

  // Display recommendations
  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}>
      <Text style={[styles.title, { color: palette.text }]}>
        Oral Hygiene Recommendations
      </Text>

      <View style={styles.recommendationContent}>
        {recommendations.toothbrushType && (
          <View style={styles.recommendationRow}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>
              Type:
            </Text>
            <Text style={[styles.value, { color: palette.text }]}>
              {recommendations.toothbrushType}
            </Text>
          </View>
        )}

        {recommendations.toothbrushBrand && (
          <View style={styles.recommendationRow}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>
              Brand:
            </Text>
            <Text style={[styles.value, { color: palette.text }]}>
              {recommendations.toothbrushBrand}
            </Text>
          </View>
        )}

        {recommendations.toothbrushModel && (
          <View style={styles.recommendationRow}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>
              Model:
            </Text>
            <Text style={[styles.value, { color: palette.text }]}>
              {recommendations.toothbrushModel}
            </Text>
          </View>
        )}

        {recommendations.formattedRecommendation && (
          <Text
            style={[
              styles.formattedRecommendation,
              { color: palette.text },
            ]}
          >
            {recommendations.formattedRecommendation}
          </Text>
        )}

        <Text
          style={[styles.timestampText, { color: palette.textSecondary }]}
        >
          Last updated: {recommendations.lastUpdated}
        </Text>
      </View>
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
  recommendationContent: {
    gap: Spacing.sm,
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 60,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  formattedRecommendation: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
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
    marginBottom: Spacing.md,
  },
});

