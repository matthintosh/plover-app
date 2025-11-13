import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export function LoginForm({ onSubmit, loading = false, error = null }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof LoginFormValues) => (text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

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

    onSubmit(values);
  };

  return (
    <View style={styles.container}>
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? 'Signing in…' : 'Sign in'}
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
