import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';

export type RegistrationFormValues = {
  fullName: string;
  email: string;
  password: string;
  professionalCredentials?: string;
};

export type RegistrationFormProps = {
  onSubmit: (values: RegistrationFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

type FormErrors = Partial<Record<keyof RegistrationFormValues, string>>;

export function RegistrationForm({ onSubmit, loading = false, error = null }: RegistrationFormProps) {
  const [values, setValues] = useState<RegistrationFormValues>({
    fullName: '',
    email: '',
    password: '',
    professionalCredentials: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof RegistrationFormValues) => (text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!values.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    }

    if (!values.password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({ ...values, professionalCredentials: values.professionalCredentials?.trim() || undefined });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Full name"
        placeholder="Full name"
        value={values.fullName}
        onChangeText={handleChange('fullName')}
        error={formErrors.fullName}
      />

      <Input
        label="Email"
        placeholder="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={values.email}
        onChangeText={handleChange('email')}
        error={formErrors.email}
      />

      <Input
        label="Password"
        placeholder="Password"
        secureTextEntry
        value={values.password}
        onChangeText={handleChange('password')}
        error={formErrors.password}
      />

      <Input
        label="Professional credentials (optional)"
        placeholder="e.g. DDS"
        value={values.professionalCredentials ?? ''}
        onChangeText={handleChange('professionalCredentials')}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? 'Creating account…' : 'Create account'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  errorText: {
    color: '#E57373',
    fontSize: 14,
  },
});
