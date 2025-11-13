import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import { Spacing, BorderRadius } from '@/constants/theme';

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  isActive?: boolean;
}

export interface BottomTabBarProps {
  tabs: TabItem[];
}

export function BottomTabBar({ tabs }: BottomTabBarProps) {
  const colorScheme = useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
        },
      ]}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            tab.isActive && {
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
          onPress={tab.onPress}
          activeOpacity={0.7}
        >
          {tab.icon && <View style={styles.iconContainer}>{tab.icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: tab.isActive ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minHeight: 44, // Minimum touch target size
  },
  iconContainer: {
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

