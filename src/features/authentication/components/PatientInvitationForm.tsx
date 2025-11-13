import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type PatientInvitationFormValues = {
  email: string;
};

export type PatientInvitationFormProps = {
  onSubmit: (values: PatientInvitationFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export function PatientInvitationForm({ onSubmit, loading = false, error = null }: PatientInvitationFormProps) {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setFieldError('Email is required');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setFieldError('Enter a valid email address');
      return false;
    }

    setFieldError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({ email });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Patient email"
        placeholder="Patient email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setFieldError(null);
        }}
        error={fieldError ?? undefined}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? 'Sending…' : 'Send invitation'}
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
