import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  containerStyle,
  inputStyle,
  ...props
}: InputProps) {
  const colorScheme = useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.text },
            hasError && { color: colors.error },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: hasError ? colors.error : isFocused ? colors.primary : colors.border,
            color: colors.text,
          },
          isFocused && styles.inputFocused,
          inputStyle,
        ]}
        placeholderTextColor={colors.textSecondary}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            { color: hasError ? colors.error : colors.textSecondary },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    minHeight: 44, // Minimum touch target size
  },
  inputFocused: {
    borderWidth: 2,
  },
  helperText: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});

