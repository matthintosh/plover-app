/**
 * Plover App Theme System
 * 
 * Wellness-oriented, calm, and reassuring design system inspired by Headspace.
 * All colors, typography, spacing, and shadows must come from this theme.
 * Uses semantic color names for better maintainability.
 */

import { Platform } from 'react-native';

// Primary brand colors (calm, wellness-oriented)
const primaryLight = '#8A7DFF'; // Soft teal-blue
const primaryDark = '#6BB3C7'; // Lighter teal for dark mode

export const Colors = {
  light: {
    // Semantic colors
    primary: primaryLight,
    secondary: '#7FB3A8', // Soft green
    accent: '#F5A623', // Warm accent
    
    // Status colors
    success: '#4CAF50',
    error: '#E57373',
    warning: '#FFB74D',
    info: '#64B5F6',
    
    // Text colors
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    textDisabled: '#BDC3C7',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // Border and divider
    border: '#E1E8ED',
    divider: '#E1E8ED',
    
    // Legacy support
    tint: primaryLight,
    icon: '#7F8C8D',
    tabIconDefault: '#7F8C8D',
    tabIconSelected: primaryLight,
  },
  dark: {
    // Semantic colors
    primary: primaryDark,
    secondary: '#8FC4B9',
    accent: '#FFB74D',
    
    // Status colors
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFA726',
    info: '#42A5F5',
    
    // Text colors
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textDisabled: '#687076',
    
    // Background colors
    background: '#151718',
    backgroundSecondary: '#1F2122',
    surface: '#1F2122',
    surfaceElevated: '#2A2D2E',
    
    // Border and divider
    border: '#2A2D2E',
    divider: '#2A2D2E',
    
    // Legacy support
    tint: primaryDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryDark,
  },
};

// Spacing scale (8px base unit)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadows (elevation-based for mobile)
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
