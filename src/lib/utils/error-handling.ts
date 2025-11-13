/**
 * Error Handling Utilities
 * 
 * Provides standardized error handling patterns for the application.
 * All errors should be handled gracefully with meaningful user messages.
 */

export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Common error codes used throughout the application
 */
export const ErrorCodes = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Not found errors
  NOT_FOUND: 'NOT_FOUND',
  PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  
  // Conflict errors
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  DUPLICATE_RISK_FACTOR: 'DUPLICATE_RISK_FACTOR',
  
  // Business logic errors
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  ALREADY_COMPLETED: 'ALREADY_COMPLETED',
  FUTURE_DATE: 'FUTURE_DATE',
  
  // Offline errors
  OFFLINE_QUEUED: 'OFFLINE_QUEUED',
} as const;

/**
 * Converts various error types to a standardized ServiceError format
 */
export function normalizeError(error: unknown): ServiceError {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    // Check if it's a Supabase error
    if ('code' in error && typeof error.code === 'string') {
      return {
        code: error.code,
        message: error.message,
        details: error,
      };
    }

    // Generic error
    return {
      code: ErrorCodes.NETWORK_ERROR,
      message: error.message || 'An unexpected error occurred',
      details: error,
    };
  }

  // Unknown error type
  return {
    code: ErrorCodes.NETWORK_ERROR,
    message: 'An unexpected error occurred',
    details: error,
  };
}

/**
 * Gets a user-friendly error message from an error
 */
export function getUserFriendlyMessage(error: ServiceError): string {
  const messages: Record<string, string> = {
    [ErrorCodes.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
    [ErrorCodes.UNAUTHORIZED]: 'You are not authorized to perform this action.',
    [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid email or password.',
    [ErrorCodes.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
    [ErrorCodes.INVALID_TOKEN]: 'Invalid or expired link. Please request a new invitation.',
    [ErrorCodes.INVALID_INPUT]: 'Please check your input and try again.',
    [ErrorCodes.PATIENT_NOT_FOUND]: 'Patient not found.',
    [ErrorCodes.EMAIL_ALREADY_EXISTS]: 'This email is already registered.',
    [ErrorCodes.ACCOUNT_INACTIVE]: 'Your account is inactive. Please contact support.',
    [ErrorCodes.OFFLINE_QUEUED]: 'Your request has been queued and will sync when online.',
  };

  return messages[error.code] || error.message || 'An unexpected error occurred';
}

/**
 * Logs an error appropriately (never logs sensitive data)
 */
export function logError(error: ServiceError, context?: string): void {
  if (__DEV__) {
    console.error(`[${context || 'Error'}]`, {
      code: error.code,
      message: error.message,
      // Only log details in development, and sanitize sensitive data
      details: error.details,
    });
  }
  // In production, you would send to error tracking service (e.g., Sentry)
  // but never log sensitive data like passwords, tokens, etc.
}

