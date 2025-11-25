import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type AuthMethod = 'magic-link' | 'otp';

export interface AuthMethodSelectorProps {
  selectedMethod: AuthMethod;
  onMethodChange: (method: AuthMethod) => void;
}

export function AuthMethodSelector({
  selectedMethod,
  onMethodChange,
}: AuthMethodSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: palette.text }]}>Choose authentication method</Text>
      <View style={[styles.selector, { backgroundColor: palette.surface }]}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            selectedMethod === 'magic-link' && [
              styles.methodButtonActive,
              { backgroundColor: palette.primary },
            ],
            selectedMethod !== 'magic-link' && { borderColor: palette.border },
          ]}
          onPress={() => onMethodChange('magic-link')}
          accessibilityRole="button"
          accessibilityLabel="Magic link authentication"
          accessibilityHint="Receive a magic link via email to sign in"
          accessibilityState={{ selected: selectedMethod === 'magic-link' }}>
          <Text
            style={[
              styles.methodButtonText,
              {
                color:
                  selectedMethod === 'magic-link' ? palette.background : palette.textSecondary,
              },
              selectedMethod === 'magic-link' && styles.methodButtonTextActive,
            ]}>
            Magic Link
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.methodButton,
            selectedMethod === 'otp' && [
              styles.methodButtonActive,
              { backgroundColor: palette.primary },
            ],
            selectedMethod !== 'otp' && { borderColor: palette.border },
          ]}
          onPress={() => onMethodChange('otp')}
          accessibilityRole="button"
          accessibilityLabel="OTP code authentication"
          accessibilityHint="Receive a one-time password code via email to sign in"
          accessibilityState={{ selected: selectedMethod === 'otp' }}>
          <Text
            style={[
              styles.methodButtonText,
              {
                color: selectedMethod === 'otp' ? palette.background : palette.textSecondary,
              },
              selectedMethod === 'otp' && styles.methodButtonTextActive,
            ]}>
            OTP Code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  selector: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    gap: 4,
    backgroundColor: Colors.light.surface,
  },
  methodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  methodButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  methodButtonTextActive: {
    color: Colors.light.background,
    fontWeight: '600',
  },
});
