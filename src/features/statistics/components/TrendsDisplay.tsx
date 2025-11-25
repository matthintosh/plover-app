import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { StatisticsChart } from './StatisticsChart';
import type { CheckInStatistics } from '../service/types';

export type TrendsDisplayProps = {
  statistics: CheckInStatistics | null;
  isLoading?: boolean;
  error?: string | null;
};

export function TrendsDisplay({
  statistics,
  isLoading = false,
  error = null,
}: TrendsDisplayProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading statistics...
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

  if (!statistics || statistics.totalCheckIns === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No check-in data available for the selected date range.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Total Check-ins
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {statistics.totalCheckIns}
          </Text>
        </View>
        {statistics.averages.bleeding !== undefined && (
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Avg. Bleeding
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {statistics.averages.bleeding.toFixed(1)}/10
            </Text>
          </View>
        )}
        {statistics.averages.pain !== undefined && (
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Avg. Pain</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {statistics.averages.pain.toFixed(1)}/10
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chartsContainer}>
        {statistics.trends.bleeding.length > 0 && (
          <StatisticsChart
            title="Bleeding Trend"
            data={statistics.trends.bleeding}
            maxValue={10}
            unit="out of 10"
            color={colors.error}
          />
        )}

        {statistics.trends.pain.length > 0 && (
          <StatisticsChart
            title="Pain Trend"
            data={statistics.trends.pain}
            maxValue={10}
            unit="out of 10"
            color={colors.primary}
          />
        )}

        {statistics.trends.mouthFeeling.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Mouth Feeling Trend</Text>
            <View style={styles.textTrendContainer}>
              {statistics.trends.mouthFeeling.map((item, index) => (
                <View key={index} style={styles.textTrendItem}>
                  <Text style={[styles.textTrendValue, { color: colors.text }]}>
                    {String(item.value)}
                  </Text>
                  <Text style={[styles.textTrendDate, { color: colors.textSecondary }]}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {statistics.trends.hygieneHabits.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Hygiene Habits Trend</Text>
            <View style={styles.textTrendContainer}>
              {statistics.trends.hygieneHabits.map((item, index) => (
                <View key={index} style={styles.textTrendItem}>
                  <Text style={[styles.textTrendValue, { color: colors.text }]}>
                    {String(item.value)}
                  </Text>
                  <Text style={[styles.textTrendDate, { color: colors.textSecondary }]}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface,
    borderRadius: Spacing.md,
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chartsContainer: {
    gap: Spacing.lg,
  },
  chartSection: {
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
    color: Colors.light.text,
  },
  textTrendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  textTrendItem: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  textTrendValue: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    color: Colors.light.text,
    textAlign: 'center',
  },
  textTrendDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});




