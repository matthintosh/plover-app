import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import type { RiskFactor } from '../service/types';

export interface RiskFactorsDisplayProps {
  riskFactors: RiskFactor[];
  isLoading?: boolean;
  error?: string | null;
}

const formatRiskFactorType = (type: RiskFactor['type']) => {
  switch (type) {
    case 'tobacco_use':
      return 'Tobacco Use';
    case 'cardiovascular_disease':
      return 'Cardiovascular Disease';
    case 'cancer_hormonotherapy':
      return 'Cancer (Hormonotherapy)';
    default:
      return 'Diabetes';
  }
};

const formatLevelDetail = (details: RiskFactor['details']) => {
  if (!details || typeof details !== 'object') {
    return null;
  }

  const level = (details as Record<string, unknown>).level;

  if (typeof level !== 'string') {
    return null;
  }

  const normalized = level.replace(/_/g, ' ');

  return normalized
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const RiskFactorsDisplay: React.FC<RiskFactorsDisplayProps> = ({
  riskFactors,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading risk factors...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!riskFactors.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No risk factors recorded yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {riskFactors.map((riskFactor) => {
        const level = formatLevelDetail(riskFactor.details);

        return (
          <View key={riskFactor.id} style={styles.item}>
            <Text style={styles.title}>{formatRiskFactorType(riskFactor.type)}</Text>
            {level ? <Text style={styles.detailText}>{level}</Text> : null}
            <Text style={styles.timestampText}>
              Last updated {new Date(riskFactor.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  item: {
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  timestampText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
  },
});

