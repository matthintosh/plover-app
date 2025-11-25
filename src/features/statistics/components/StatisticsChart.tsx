import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TrendData } from '../service/types';

export type StatisticsChartProps = {
  title: string;
  data: TrendData[];
  maxValue?: number; // For numeric charts (bleeding, pain)
  unit?: string; // Unit label (e.g., "out of 10")
  color?: string;
};

export function StatisticsChart({
  title,
  data,
  maxValue = 10,
  unit = '',
  color,
}: StatisticsChartProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];
  const chartColor = color || colors.primary;

  if (data.length === 0) {
    return null;
  }

  // Determine if data is numeric
  const isNumeric = data.every((d) => typeof d.value === 'number' || d.value === null);

  // Calculate max value for scaling
  const numericValues = data
    .map((d) => (typeof d.value === 'number' ? d.value : 0))
    .filter((v) => v > 0);
  const actualMax = numericValues.length > 0 ? Math.max(...numericValues, maxValue) : maxValue;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          {data.map((item, index) => {
            if (isNumeric) {
              const value = typeof item.value === 'number' ? item.value : 0;
              const percentage = actualMax > 0 ? (value / actualMax) * 100 : 0;
              const barHeight = Math.max(percentage * 2, 4); // Minimum 4px height

              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: chartColor,
                          opacity: value > 0 ? 1 : 0.3,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValue, { color: colors.text }]}>
                    {value > 0 ? value : '-'}
                  </Text>
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              );
            }

            // For non-numeric data (mouth feeling, hygiene habits)
            return (
              <View key={index} style={styles.textDataContainer}>
                <Text style={[styles.textDataValue, { color: colors.text }]}>
                  {String(item.value)}
                </Text>
                <Text style={[styles.textDataLabel, { color: colors.textSecondary }]}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {unit && (
        <Text style={[styles.unitLabel, { color: colors.textSecondary }]}>
          Scale: 0-{maxValue} {unit}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
    color: Colors.light.text,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: Spacing.md,
    minHeight: 150,
  },
  barContainer: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 40,
  },
  barWrapper: {
    height: 100,
    width: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  textDataContainer: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 80,
    paddingVertical: Spacing.sm,
  },
  textDataValue: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    textAlign: 'center',
    color: Colors.light.text,
  },
  textDataLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  unitLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});




