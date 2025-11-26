# API Contracts: Patient Diagnostic View

**Feature**: Patient Diagnostic View  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document defines the service layer interfaces and data contracts for the Patient Diagnostic View feature. These contracts define the API between the repository layer (data access) and the service layer (business logic), as well as between the service layer and hooks/components.

## Repository Interface

### PatientDiagnosticViewRepository

```typescript
export interface PatientDiagnosticViewRepository {
  /**
   * Get diagnosis for the authenticated patient
   * @returns Diagnosis data or null if not found
   * @throws Error if patient is not authenticated or database error occurs
   */
  getDiagnosis(): Promise<DiagnosisView | null>;

  /**
   * Get all risk factors for the authenticated patient
   * @returns Array of risk factor data (empty array if none found)
   * @throws Error if patient is not authenticated or database error occurs
   */
  getRiskFactors(): Promise<RiskFactorView[]>;

  /**
   * Get oral hygiene recommendations for the authenticated patient
   * @returns Recommendation data or null if not found
   * @throws Error if patient is not authenticated or database error occurs
   */
  getRecommendations(): Promise<OralHygieneRecommendationView | null>;

  /**
   * Get all medical information for the authenticated patient in a single call
   * @returns Comprehensive medical information object
   * @throws Error if patient is not authenticated or database error occurs
   */
  getAllMedicalInfo(): Promise<ComprehensiveMedicalInfoView>;
}
```

## Service Interface

### PatientDiagnosticViewService

```typescript
export interface PatientDiagnosticViewService {
  /**
   * Get formatted diagnosis for display
   * @returns Formatted diagnosis display model or null
   * @throws AppError if data fetch fails
   */
  getDiagnosis(): Promise<DiagnosisDisplay | null>;

  /**
   * Get formatted risk factors for display
   * @returns Array of formatted risk factor display models
   * @throws AppError if data fetch fails
   */
  getRiskFactors(): Promise<RiskFactorDisplay[]>;

  /**
   * Get formatted recommendations for display
   * @returns Formatted recommendation display model or null
   * @throws AppError if data fetch fails
   */
  getRecommendations(): Promise<OralHygieneRecommendationDisplay | null>;

  /**
   * Get all formatted medical information for comprehensive view
   * @returns Formatted comprehensive medical information display model
   * @throws AppError if data fetch fails
   */
  getComprehensiveMedicalInfo(): Promise<ComprehensiveMedicalInfoDisplay>;
}
```

## Hook Interface

### usePatientDiagnosticView

```typescript
export interface UsePatientDiagnosticViewResult {
  // Diagnosis data
  diagnosis: DiagnosisDisplay | null;
  diagnosisLoading: boolean;
  diagnosisError: Error | null;

  // Risk factors data
  riskFactors: RiskFactorDisplay[];
  riskFactorsLoading: boolean;
  riskFactorsError: Error | null;

  // Recommendations data
  recommendations: OralHygieneRecommendationDisplay | null;
  recommendationsLoading: boolean;
  recommendationsError: Error | null;

  // Comprehensive view data
  comprehensiveInfo: ComprehensiveMedicalInfoDisplay | null;
  comprehensiveLoading: boolean;
  comprehensiveError: Error | null;

  // Combined loading state (true if any data is loading)
  isLoading: boolean;

  // Combined error state (first error encountered, or null)
  error: Error | null;

  // Refetch functions
  refetchDiagnosis: () => Promise<void>;
  refetchRiskFactors: () => Promise<void>;
  refetchRecommendations: () => Promise<void>;
  refetchAll: () => Promise<void>;
}
```

### Individual Data Hooks (Optional)

```typescript
// Hook for diagnosis only
export interface UseDiagnosisResult {
  diagnosis: DiagnosisDisplay | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Hook for risk factors only
export interface UseRiskFactorsResult {
  riskFactors: RiskFactorDisplay[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Hook for recommendations only
export interface UseRecommendationsResult {
  recommendations: OralHygieneRecommendationDisplay | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

## Component Props Interfaces

### DiagnosisView Props

```typescript
export interface DiagnosisViewProps {
  diagnosis: DiagnosisDisplay | null;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}
```

### RiskFactorsView Props

```typescript
export interface RiskFactorsViewProps {
  riskFactors: RiskFactorDisplay[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}
```

### RecommendationsView Props

```typescript
export interface RecommendationsViewProps {
  recommendations: OralHygieneRecommendationDisplay | null;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}
```

### ComprehensiveMedicalView Props

```typescript
export interface ComprehensiveMedicalViewProps {
  medicalInfo: ComprehensiveMedicalInfoDisplay | null;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}
```

## Error Types

### AppError

```typescript
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

## Data Contracts

### Request Contracts

No request parameters needed - all methods use authenticated patient context from Supabase session.

### Response Contracts

#### Diagnosis Response

```typescript
// Success Response
{
  success: true;
  data: DiagnosisDisplay | null;
}

// Error Response
{
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  }
}
```

#### Risk Factors Response

```typescript
// Success Response
{
  success: true;
  data: RiskFactorDisplay[];
}

// Error Response
{
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  }
}
```

#### Recommendations Response

```typescript
// Success Response
{
  success: true;
  data: OralHygieneRecommendationDisplay | null;
}

// Error Response
{
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  }
}
```

#### Comprehensive Medical Info Response

```typescript
// Success Response
{
  success: true;
  data: ComprehensiveMedicalInfoDisplay;
}

// Error Response
{
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  }
}
```

## Implementation Notes

### Repository Implementation

- Uses Supabase client with authenticated session
- RLS policies automatically filter data to patient's records
- Returns raw database models (DiagnosisView, RiskFactorView, etc.)
- Handles database errors and converts to AppError

### Service Implementation

- Uses repository to fetch data
- Transforms raw data to display models
- Handles formatting (dates, labels, etc.)
- Provides user-friendly error messages
- Validates data integrity

### Hook Implementation

- Uses React Query for data fetching and caching
- Calls service methods
- Manages loading and error states
- Provides refetch capabilities
- Combines multiple queries for comprehensive view

### Component Implementation

- Receives formatted data from hooks
- Handles rendering logic
- Displays empty states when data is null/empty
- Shows error states with retry options
- Implements accessibility features

## Testing Contracts

### Repository Tests

- Mock Supabase client
- Test RLS policy enforcement
- Test error handling
- Test data transformation from database to view models

### Service Tests

- Mock repository
- Test data formatting logic
- Test error handling and transformation
- Test edge cases (null data, partial data)

### Hook Tests

- Mock service
- Test React Query integration
- Test loading/error states
- Test refetch functionality

### Component Tests

- Mock hooks
- Test rendering with data
- Test empty states
- Test error states
- Test accessibility

## Performance Contracts

### Response Time Requirements

- Diagnosis fetch: < 500ms (p95)
- Risk factors fetch: < 500ms (p95)
- Recommendations fetch: < 500ms (p95)
- Comprehensive info fetch: < 1000ms (p95) - parallel queries

### Caching Requirements

- Cache duration: 5 minutes (staleTime)
- Cache invalidation: Manual refetch or automatic after expiry
- Cache key: Based on patient ID and data type

### Data Size Limits

- Diagnosis: < 1KB per record
- Risk factors: < 5KB total (typically 0-4 records)
- Recommendations: < 1KB per record
- Comprehensive view: < 10KB total

## Security Contracts

### Authentication

- All methods require authenticated patient session
- Repository uses Supabase authenticated client
- Service validates authentication before data access

### Authorization

- RLS policies enforce patient-only access
- No additional authorization checks needed
- Service layer trusts repository/RLS for security

### Data Privacy

- No sensitive data exposed in error messages
- User-friendly error messages only
- Detailed errors logged server-side only

