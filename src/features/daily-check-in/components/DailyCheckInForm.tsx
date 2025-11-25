import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import type { CheckInInput, DailyCheckIn } from '../service/types';

export type DailyCheckInFormProps = {
  onSubmit: (data: CheckInInput) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  existingCheckIn?: DailyCheckIn | null;
};

type FormErrors = {
  bleeding?: string;
  pain?: string;
};

export function DailyCheckInForm({
  onSubmit,
  isLoading = false,
  error = null,
  existingCheckIn = null,
}: DailyCheckInFormProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  const [formData, setFormData] = useState<CheckInInput>({
    bleeding: undefined,
    pain: undefined,
    mouthFeeling: '',
    interdentalBrushUsed: false,
    flossUsed: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Pre-fill form with existing check-in data
  useEffect(() => {
    if (existingCheckIn) {
      setFormData({
        bleeding: existingCheckIn.bleeding,
        pain: existingCheckIn.pain,
        mouthFeeling: existingCheckIn.mouthFeeling || '',
        interdentalBrushUsed: existingCheckIn.interdentalBrushUsed,
        flossUsed: existingCheckIn.flossUsed,
      });
    }
  }, [existingCheckIn]);

  const handleChange = (field: keyof CheckInInput) => (value: string | boolean | number) => {
    if (field === 'interdentalBrushUsed' || field === 'flossUsed') {
      setFormData((prev) => ({ ...prev, [field]: value as boolean }));
    } else if (field === 'bleeding' || field === 'pain') {
      const numValue = value === '' ? undefined : Number(value);
      setFormData((prev) => ({ ...prev, [field]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as string }));
    }
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (formData.bleeding !== undefined) {
      if (formData.bleeding < 0 || formData.bleeding > 10) {
        errors.bleeding = 'Bleeding level must be between 0 and 10';
      }
    }

    if (formData.pain !== undefined) {
      if (formData.pain < 0 || formData.pain > 10) {
        errors.pain = 'Pain level must be between 0 and 10';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    await onSubmit({
      bleeding: formData.bleeding,
      pain: formData.pain,
      mouthFeeling: formData.mouthFeeling || undefined,
      interdentalBrushUsed: formData.interdentalBrushUsed,
      flossUsed: formData.flossUsed,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.title, { color: colors.text }]}>Daily Check-in</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Log your symptoms and habits for today.
      </Text>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <Input
        label="Bleeding Level (0-10)"
        placeholder="Enter bleeding level (0-10)"
        value={formData.bleeding !== undefined ? String(formData.bleeding) : ''}
        onChangeText={handleChange('bleeding')}
        keyboardType="numeric"
        error={formErrors.bleeding}
        fullWidth
        helperText="Rate your bleeding level from 0 (none) to 10 (severe)"
      />

      <Input
        label="Pain Level (0-10)"
        placeholder="Enter pain level (0-10)"
        value={formData.pain !== undefined ? String(formData.pain) : ''}
        onChangeText={handleChange('pain')}
        keyboardType="numeric"
        error={formErrors.pain}
        fullWidth
        helperText="Rate your pain level from 0 (none) to 10 (severe)"
      />

      <Input
        label="Mouth Feeling"
        placeholder="How does your mouth feel today?"
        value={formData.mouthFeeling}
        onChangeText={handleChange('mouthFeeling')}
        fullWidth
        multiline
        numberOfLines={3}
      />

      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            Interdental Brush Used
          </Text>
          <Text style={[styles.switchHelper, { color: colors.textSecondary }]}>
            Did you use an interdental brush today?
          </Text>
        </View>
        <Switch
          value={formData.interdentalBrushUsed}
          onValueChange={handleChange('interdentalBrushUsed')}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={formData.interdentalBrushUsed ? '#FFFFFF' : colors.textSecondary}
        />
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Floss Used</Text>
          <Text style={[styles.switchHelper, { color: colors.textSecondary }]}>
            Did you floss today?
          </Text>
        </View>
        <Switch
          value={formData.flossUsed}
          onValueChange={handleChange('flossUsed')}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={formData.flossUsed ? '#FFFFFF' : colors.textSecondary}
        />
      </View>

      <Button
        title={isLoading ? 'Submitting...' : existingCheckIn ? 'Update Check-in' : 'Submit Check-in'}
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        style={styles.submitButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  switchHelper: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});

