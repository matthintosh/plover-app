import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  variant = 'rectangular',
}: SkeletonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: typeof height === 'number' ? height / 2 : 50,
          width: height,
        };
      case 'text':
        return {
          borderRadius: borderRadius,
          height: height,
        };
      default:
        return {
          borderRadius: borderRadius,
          height: height,
        };
    }
  };

  return (
    <View
      style={[
        styles.skeleton,
        {
          backgroundColor: palette.surface,
          width,
          ...getVariantStyles(),
        },
        style,
      ]}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  width?: number | string;
  lastLineWidth?: number | string;
  lineHeight?: number;
  spacing?: number;
}

export function SkeletonText({
  lines = 3,
  width = '100%',
  lastLineWidth = '60%',
  lineHeight = 16,
  spacing = 8,
}: SkeletonTextProps) {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : width}
          height={lineHeight}
          style={index < lines - 1 ? { marginBottom: spacing } : undefined}
        />
      ))}
    </View>
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  descriptionLines?: number;
}

export function SkeletonCard({
  showAvatar = false,
  showTitle = true,
  showDescription = true,
  descriptionLines = 2,
}: SkeletonCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: palette.surface }]}>
      {showAvatar && (
        <Skeleton variant="circular" height={48} style={styles.avatar} />
      )}
      <View style={styles.cardContent}>
        {showTitle && <Skeleton width="80%" height={20} style={styles.title} />}
        {showDescription && (
          <SkeletonText
            lines={descriptionLines}
            width="100%"
            lastLineWidth="70%"
            lineHeight={14}
            spacing={6}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.light.surface,
  },
  textContainer: {
    width: '100%',
  },
  card: {
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.light.surface,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  avatar: {
    marginBottom: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.xs,
  },
});
