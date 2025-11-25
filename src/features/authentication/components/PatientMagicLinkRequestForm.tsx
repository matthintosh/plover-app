import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type PatientMagicLinkRequestFormProps = {
  onSubmit: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  initialEmail?: string;
};

type FormErrors = {
  email?: string;
};

export function PatientMagicLinkRequestForm({
  onSubmit,
  loading = false,
  error = null,
  success = false,
  initialEmail = '',
}: PatientMagicLinkRequestFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (text: string) => {
    setEmail(text);
    setFormErrors((prev) => ({ ...prev, email: undefined }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit(email.trim().toLowerCase());
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Magic link sent! Please check your email and click the link to sign in.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Enter your email address and we'll send you a magic link to sign in.
      </Text>

      <Input
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={handleChange}
        error={formErrors.email}
        fullWidth
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? 'Sending magic link…' : 'Send Magic Link'}
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
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: Spacing.sm,
  },
  errorText: {
    color: '#E57373',
    fontSize: 14,
  },
  successContainer: {
    padding: Spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
});

