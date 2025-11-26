/**
 * Constants for Patient Diagnostic View Feature
 * 
 * Centralized constants for empty state messages and other feature-specific constants.
 */

export const EMPTY_DIAGNOSIS_MESSAGE =
  'No diagnosis information is available. Your periodontist will enter this information after your examination.';

export const EMPTY_RISK_FACTORS_MESSAGE =
  'No risk factors have been documented. Your periodontist will update this information as needed.';

export const EMPTY_RECOMMENDATIONS_MESSAGE =
  'No oral hygiene recommendations are available. Your periodontist will provide recommendations based on your treatment plan.';

export const EMPTY_COMPREHENSIVE_MESSAGE =
  'No medical information is available. Your periodontist will enter this information after your examination.';

// React Query cache configuration
export const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Error messages
export const ERROR_MESSAGES = {
  DIAGNOSIS: 'Unable to load diagnosis information. Please check your connection and try again.',
  RISK_FACTORS: 'Unable to load risk factors. Please check your connection and try again.',
  RECOMMENDATIONS: 'Unable to load recommendations. Please check your connection and try again.',
  COMPREHENSIVE: 'Unable to load medical information. Please check your connection and try again.',
  NETWORK: 'Network connection failed. Please check your internet connection.',
} as const;

