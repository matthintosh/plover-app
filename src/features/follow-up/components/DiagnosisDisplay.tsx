import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { Diagnosis } from '../service/types';

export interface DiagnosisDisplayProps {
  diagnosis: Diagnosis | null;
  isLoading?: boolean;
  error?: string | null;
}

const formatDiagnosisType = (type: Diagnosis['type']) => {
  if (type === 'periodontitis') {
    return 'Periodontitis';
  }

  return 'Gingivitis';
};

export const DiagnosisDisplay: React.FC<DiagnosisDisplayProps> = ({
  diagnosis,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading diagnosis...</Text>
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

  if (!diagnosis) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No diagnosis recorded yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatDiagnosisType(diagnosis.type)}</Text>
      {diagnosis.type === 'periodontitis' ? (
        <View style={styles.detailsRow}>
          {typeof diagnosis.grade === 'number' && (
            <Text style={styles.detailText}>Grade {diagnosis.grade}</Text>
          )}
          {typeof diagnosis.stage === 'number' && (
            <Text style={styles.detailText}>Stage {diagnosis.stage}</Text>
          )}
        </View>
      ) : (
        <Text style={styles.detailText}>No grade or stage required.</Text>
      )}
      <Text style={styles.timestampText}>
        Last updated {new Date(diagnosis.updatedAt).toLocaleDateString()}
      </Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  detailText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginRight: Spacing.md,
  },
  timestampText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
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

