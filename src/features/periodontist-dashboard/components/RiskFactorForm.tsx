import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import type { RiskFactor } from '@/features/follow-up/service/types';

export type RiskFactorFormValues = {
  type: RiskFactor['type'] | null;
  details: Record<string, unknown>;
};

export interface RiskFactorFormProps {
  loading?: boolean;
  error?: string | null;
  existingRiskFactors: RiskFactor[];
  onSubmit: (values: { type: RiskFactor['type']; details: Record<string, unknown> }) => void | Promise<void>;
  onRemove: (riskFactorId: string) => void | Promise<void>;
}

const RISK_FACTOR_TYPES: RiskFactor['type'][] = [
  'diabetes',
  'tobacco_use',
  'cardiovascular_disease',
  'cancer_hormonotherapy',
];

const TOBACCO_LEVELS = [
  { label: 'Below 10 cigarettes/day', value: 'below_10' },
  { label: 'Above 10 cigarettes/day', value: 'above_10' },
];

export const RiskFactorForm: React.FC<RiskFactorFormProps> = ({
  loading = false,
  error = null,
  existingRiskFactors,
  onSubmit,
  onRemove,
}) => {
  const [selectedType, setSelectedType] = useState<RiskFactor['type'] | null>(null);
  const [selectedTobaccoLevel, setSelectedTobaccoLevel] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const hasTobaccoType = selectedType === 'tobacco_use';

  const handleSubmit = () => {
    if (!selectedType) {
      setFormError('Select a risk factor to add.');
      return;
    }

    if (selectedType === 'tobacco_use' && !selectedTobaccoLevel) {
      setFormError('Select tobacco usage level.');
      return;
    }

    setFormError(null);

    onSubmit({
      type: selectedType,
      details:
        selectedType === 'tobacco_use'
          ? { level: selectedTobaccoLevel }
          : {},
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Risk Factors</Text>

      <View style={styles.typeGrid}>
        {RISK_FACTOR_TYPES.map((type) => {
          const selected = selectedType === type;

          return (
            <Pressable
              key={type}
              accessibilityRole="button"
              onPress={() => setSelectedType(type)}
              style={[styles.typeChip, selected && styles.typeChipSelected]}>
              <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {hasTobaccoType ? (
        <View style={styles.tobaccoContainer}>
          <Text style={styles.tobaccoLabel}>Tobacco usage level</Text>
          <View style={styles.typeGrid}>
            {TOBACCO_LEVELS.map((level) => {
              const selected = selectedTobaccoLevel === level.value;
              return (
                <Pressable
                  key={level.value}
                  accessibilityRole='button'
                  onPress={() => setSelectedTobaccoLevel(level.value)}
                  style={[styles.typeChip, selected && styles.typeChipSelected]}>
                  <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                    {level.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? 'Adding…' : 'Add Risk Factor'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />

      {existingRiskFactors.length ? (
        <View style={styles.listContainer}>
          <Text style={styles.sectionLabel}>Existing Factors</Text>
          {existingRiskFactors.map((riskFactor) => (
            <View key={riskFactor.id} style={styles.existingItem}>
              <View style={styles.existingCopy}>
                <Text style={styles.existingTitle}>
                  {riskFactor.type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </Text>
                {riskFactor.type === 'tobacco_use' && typeof riskFactor.details === 'object' ? (
                  <Text style={styles.existingSubtitle}>
                    Level:{' '}
                    {riskFactor.details?.level === 'above_10'
                      ? 'Above 10 cigarettes/day'
                      : riskFactor.details?.level === 'below_10'
                        ? 'Below 10 cigarettes/day'
                        : 'Not specified'}
                  </Text>
                ) : null}
              </View>
              <Button
                title="Remove"
                variant="outline"
                size="sm"
                onPress={() => onRemove(riskFactor.id)}
                disabled={loading}
              />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  typeChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeChipText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  typeChipTextSelected: {
    color: Colors.light.background,
  },
  tobaccoContainer: {
    gap: Spacing.sm,
  },
  tobaccoLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
  },
  listContainer: {
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderColor: Colors.light.border,
    paddingTop: Spacing.sm,
  },
  existingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  existingCopy: {
    gap: 4,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  existingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  existingSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});

