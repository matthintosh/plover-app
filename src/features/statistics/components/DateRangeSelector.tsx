import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type DateRangePreset = '7d' | '30d' | '90d' | 'custom';

export type DateRangeSelectorProps = {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
};

export function DateRangeSelector({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangeSelectorProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  const presets = useMemo(() => {
    const today = new Date();
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      '7d': {
        label: '7 days',
        start: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
        end: formatDate(today),
      },
      '30d': {
        label: '30 days',
        start: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
        end: formatDate(today),
      },
      '90d': {
        label: '90 days',
        start: formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)),
        end: formatDate(today),
      },
    };
  }, []);

  const handlePresetSelect = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      // For custom, we'd ideally show a date picker, but for now we'll just keep current dates
      return;
    }

    const presetData = presets[preset];
    if (presetData) {
      onDateRangeChange(presetData.start, presetData.end);
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.presetsContainer}>
        {Object.entries(presets).map(([key, preset]) => {
          const isActive =
            startDate === preset.start && endDate === preset.end;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.presetButton,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
              onPress={() => handlePresetSelect(key as DateRangePreset)}>
              <Text
                style={[
                  styles.presetText,
                  {
                    color: isActive ? colors.background : colors.text,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}>
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.dateRangeDisplay}>
        <Text style={[styles.dateRangeText, { color: colors.textSecondary }]}>
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  presetButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  dateRangeDisplay: {
    alignItems: 'center',
  },
  dateRangeText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});




