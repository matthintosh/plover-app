import React from 'react';
import { View, StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}: CardProps) {
  const colorScheme = useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      backgroundColor: variant === 'elevated' ? colors.surfaceElevated : colors.surface,
    };

    const variantStyles: Record<typeof variant, ViewStyle> = {
      default: {},
      elevated: Shadows.md,
      outlined: {
        borderWidth: 1,
        borderColor: colors.border,
      },
    };

    const paddingStyles: Record<NonNullable<CardProps['padding']>, ViewStyle> = {
      none: {},
      sm: { padding: Spacing.sm },
      md: { padding: Spacing.md },
      lg: { padding: Spacing.lg },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
    };
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

