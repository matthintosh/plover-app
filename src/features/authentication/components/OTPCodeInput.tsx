import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export interface OTPCodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
  loading?: boolean;
}

export function OTPCodeInput({
  value,
  onChangeText,
  error = null,
  loading = false,
}: OTPCodeInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const handleChangeText = (text: string) => {
    // Only allow numeric input and limit to 8 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 8);
    onChangeText(numericText);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: palette.text }]}>Enter OTP Code</Text>
      <TextInput
        testID="otp-input"
        style={[
          styles.input,
          {
            borderColor: error ? palette.error : palette.border,
            color: palette.text,
            backgroundColor: palette.surface,
          },
        ]}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        maxLength={8}
        editable={!loading}
        placeholder="Enter 8-digit code"
        placeholderTextColor={palette.textSecondary}
        accessibilityLabel="OTP code input"
        accessibilityHint="Enter the 8-digit OTP code sent to your email"
      />
      {error ? (
        <Text style={[styles.errorText, { color: palette.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 4,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
});
