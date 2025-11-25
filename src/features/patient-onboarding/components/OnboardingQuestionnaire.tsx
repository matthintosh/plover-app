import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import type { OnboardingInput } from '../service/types';

export type OnboardingQuestionnaireProps = {
  onSubmit: (data: OnboardingInput) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
};

type FormErrors = {
  age?: string;
  diet?: string;
  sleep?: string;
};

export function OnboardingQuestionnaire({
  onSubmit,
  isLoading = false,
  error = null,
}: OnboardingQuestionnaireProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  const [formData, setFormData] = useState<OnboardingInput>({
    age: 0,
    diet: '',
    sleep: '',
    bruxismClenching: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof OnboardingInput) => (value: string | boolean) => {
    if (field === 'bruxismClenching') {
      setFormData((prev) => ({ ...prev, [field]: value as boolean }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as string }));
    }
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    const ageNum = typeof formData.age === 'string' ? parseInt(formData.age, 10) : formData.age;
    if (!ageNum || ageNum < 1 || ageNum > 150) {
      errors.age = 'Age must be between 1 and 150';
    }

    if (!formData.diet || formData.diet.trim().length === 0) {
      errors.diet = 'Diet information is required';
    }

    if (!formData.sleep || formData.sleep.trim().length === 0) {
      errors.sleep = 'Sleep information is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const ageNum = typeof formData.age === 'string' ? parseInt(formData.age, 10) : formData.age;
    await onSubmit({
      age: ageNum,
      diet: formData.diet.trim(),
      sleep: formData.sleep.trim(),
      bruxismClenching: formData.bruxismClenching,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.title, { color: colors.text }]}>Onboarding Questionnaire</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Please provide the following information to complete your profile.
      </Text>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <Input
        label="Age"
        placeholder="Enter your age"
        value={formData.age === 0 ? '' : String(formData.age)}
        onChangeText={handleChange('age')}
        keyboardType="numeric"
        error={formErrors.age}
        fullWidth
      />

      <Input
        label="Diet"
        placeholder="Describe your diet (e.g., Balanced, Vegetarian, etc.)"
        value={formData.diet}
        onChangeText={handleChange('diet')}
        error={formErrors.diet}
        fullWidth
        multiline
        numberOfLines={3}
      />

      <Input
        label="Sleep"
        placeholder="Describe your sleep patterns (e.g., 7-8 hours, irregular, etc.)"
        value={formData.sleep}
        onChangeText={handleChange('sleep')}
        error={formErrors.sleep}
        fullWidth
        multiline
        numberOfLines={3}
      />

      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            Bruxism/Clenching
          </Text>
          <Text style={[styles.switchHelper, { color: colors.textSecondary }]}>
            Do you experience teeth grinding or clenching?
          </Text>
        </View>
        <Switch
          value={formData.bruxismClenching}
          onValueChange={handleChange('bruxismClenching')}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={formData.bruxismClenching ? '#FFFFFF' : colors.textSecondary}
        />
      </View>

      <Button
        title={isLoading ? 'Submitting...' : 'Submit'}
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
    marginBottom: Spacing.xl,
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

