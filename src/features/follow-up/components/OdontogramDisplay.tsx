import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Odontogram } from '../service/types';

export interface OdontogramDisplayProps {
  odontogram: Odontogram | null | undefined;
  isLoading?: boolean;
  error?: string | null;
}

// Standard dental numbering: 32 teeth = 31 interdental spaces
// Format: "1-2", "2-3", ..., "31-32"
const generateSpaceIds = (): string[] => {
  const spaces: string[] = [];
  for (let i = 1; i <= 31; i++) {
    spaces.push(`${i}-${i + 1}`);
  }
  return spaces;
};

export const OdontogramDisplay: React.FC<OdontogramDisplayProps> = ({
  odontogram,
  isLoading = false,
  error = null,
}) => {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading odontogram...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  if (!odontogram || odontogram.spaces.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No odontogram data available.
        </Text>
      </View>
    );
  }

  // Create a map of spaceId -> space data for quick lookup
  const spaceMap = new Map(
    odontogram.spaces.map((space) => [space.spaceId, space]),
  );

  const allSpaces = generateSpaceIds();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.text }]}>Odontogram</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Recommended tools for each interdental space
      </Text>

      <View style={styles.grid}>
        {allSpaces.map((spaceId) => {
          const space = spaceMap.get(spaceId);
          const hasRecommendation = !!space;

          return (
            <View
              key={spaceId}
              style={[
                styles.spaceItem,
                {
                  backgroundColor: hasRecommendation
                    ? colors.primary + '20'
                    : colors.surface,
                  borderColor: hasRecommendation ? colors.primary : colors.border,
                },
              ]}>
              <Text style={[styles.spaceId, { color: colors.text }]}>{spaceId}</Text>
              {space ? (
                <View style={styles.spaceInfo}>
                  <Text style={[styles.toolType, { color: colors.text }]}>
                    {space.toolType === 'interdental_brush'
                      ? 'Interdental Brush'
                      : 'Floss'}
                  </Text>
                  {space.brushSize && (
                    <Text style={[styles.brushSize, { color: colors.textSecondary }]}>
                      Size: {space.brushSize}
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={[styles.noRecommendation, { color: colors.textSecondary }]}>
                  No recommendation
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <Text style={[styles.legendTitle, { color: colors.text }]}>Legend</Text>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: colors.primary + '20', borderColor: colors.primary },
            ]}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>
            Has recommendation
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>
            No recommendation
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
    color: Colors.light.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  spaceItem: {
    width: '30%',
    padding: Spacing.sm,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 80,
  },
  spaceId: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  spaceInfo: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  toolType: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.light.text,
  },
  brushSize: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  noRecommendation: {
    fontSize: 10,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
  },
  legend: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: Spacing.sm,
    gap: Spacing.sm,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.light.textSecondary,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.light.error,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.xl,
    color: Colors.light.textSecondary,
  },
});





