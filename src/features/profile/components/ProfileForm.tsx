import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import type { ProfileUpdateInput } from '../service/types';

export interface ProfileFormProps {
  initialValues?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: ProfileUpdateInput) => void | Promise<void>;
}

export function ProfileForm({
  initialValues,
  loading = false,
  error = null,
  onSubmit,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialValues?.fullName || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phoneNumber || '');

  const handleSubmit = () => {
    onSubmit({
      fullName: fullName.trim() || undefined,
      email: email.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    });
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Profile Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor={Colors.light.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.light.textSecondary}
          editable={false}
        />
        <Text style={styles.helperText}>Email cannot be changed</Text>
      </View>

      {/*<View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>*/}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={loading ? 'Saving...' : 'Save Changes'}
        onPress={handleSubmit}
        variant="primary"
        fullWidth
        disabled={loading}
        style={styles.submitButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  helperText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginBottom: Spacing.sm,
  },
});





