# Quickstart: Patient Diagnostic View Feature

**Feature**: Patient Diagnostic View  
**Date**: 2025-01-27  
**Status**: Implementation Guide

## Overview

This guide helps developers implement the Patient Diagnostic View feature, which allows patients to view their diagnosis, risk factors, and oral hygiene recommendations. The feature follows the established feature-based architecture pattern used throughout the Plover application.

## Prerequisites

- Existing database tables: `diagnosis`, `risk_factor`, `oral_hygiene_recommendation`
- RLS policies already configured
- Supabase client configured
- React Query set up
- TypeScript strict mode enabled

## Implementation Steps

### Step 1: Create Feature Directory Structure

```bash
mkdir -p src/features/patient-diagnostic-view/{repository,service,hooks,components,__tests__/{integration,unit}}
```

### Step 2: Implement Repository Layer

**File**: `src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.interface.ts`

```typescript
// Define interface (see contracts/api-contracts.md)
```

**File**: `src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.ts`

```typescript
// Implement Supabase queries
// Use existing Supabase client from src/lib/supabase/client.ts
// RLS policies automatically filter data
```

**Key Points**:
- Use `supabase.from('diagnosis').select('*').maybeSingle()` for diagnosis
- Use `supabase.from('risk_factor').select('*')` for risk factors
- Use `supabase.from('oral_hygiene_recommendation').select('*').maybeSingle()` for recommendations
- Handle errors and convert to AppError

### Step 3: Implement Service Layer

**File**: `src/features/patient-diagnostic-view/service/types.ts`

```typescript
// Define all TypeScript types (see data-model.md)
```

**File**: `src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts`

```typescript
// Implement service methods
// Transform raw data to display models
// Format dates, labels, etc.
// Handle error cases
```

**Key Points**:
- Format diagnosis type labels ("Gingivitis", "Periodontitis")
- Format grade/stage labels ("Grade 1", "Stage 2")
- Format risk factor type labels
- Format recommendation display strings
- Handle null/empty data gracefully

### Step 4: Implement Custom Hook

**File**: `src/features/patient-diagnostic-view/hooks/usePatientDiagnosticView.ts`

```typescript
// Use React Query for data fetching
// Call service methods
// Manage loading/error states
// Provide refetch functions
```

**Key Points**:
- Use `useQuery` for individual data types
- Use `useQueries` or multiple `useQuery` hooks for comprehensive view
- Configure React Query with 5-minute staleTime
- Provide combined loading/error states
- Export refetch functions

### Step 5: Implement Components

**File**: `src/features/patient-diagnostic-view/components/DiagnosisView.tsx`

```typescript
// Display diagnosis information
// Show empty state if null
// Show error state with retry
// Use theme system for styling
```

**File**: `src/features/patient-diagnostic-view/components/RiskFactorsView.tsx`

```typescript
// Display list of risk factors
// Show empty state if empty array
// Format risk factor details
// Use theme system for styling
```

**File**: `src/features/patient-diagnostic-view/components/RecommendationsView.tsx`

```typescript
// Display recommendations
// Show empty state if null
// Format recommendation string
// Use theme system for styling
```

**File**: `src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx`

```typescript
// Compose all three components
// Display in organized sections
// Handle partial data (some sections empty)
// Use theme system for styling
```

**Key Points**:
- Use existing UI components from `src/components/ui/`
- Follow design system from `src/constants/theme.ts`
- Implement accessibility features (labels, hints)
- Handle loading states with skeletons
- Handle error states with retry buttons
- Handle empty states with helpful messages

### Step 6: Create Page

**File**: `src/app/(tabs)/medical-info.tsx`

```typescript
// Use ComprehensiveMedicalView component
// Use usePatientDiagnosticView hook
// Handle navigation
// Use LinearBackground for consistent styling
```

**Key Points**:
- Use Expo Router for navigation
- Add to tab navigation if needed
- Use existing layout patterns
- Handle authentication state

### Step 7: Write Tests

#### Repository Tests

**File**: `src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.repository.test.ts`

```typescript
// Mock Supabase client
// Test each repository method
// Test error handling
// Test RLS policy enforcement
```

#### Service Tests

**File**: `src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.service.test.ts`

```typescript
// Mock repository
// Test data formatting
// Test error handling
// Test edge cases
```

#### Component Tests

**File**: `src/features/patient-diagnostic-view/components/__tests__/DiagnosisView.test.tsx`

```typescript
// Test rendering with data
// Test empty state
// Test error state
// Test accessibility
```

#### Integration Tests

**File**: `src/features/patient-diagnostic-view/__tests__/integration/patient-diagnostic-view.test.ts`

```typescript
// Test complete flow
// Test data fetching
// Test error scenarios
// Test RLS enforcement
```

## Code Examples

### Repository Implementation Example

```typescript
import { supabase } from '@/lib/supabase/client';
import { DiagnosisView } from '../service/types';
import { PatientDiagnosticViewRepository } from './patient-diagnostic-view.repository.interface';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';

export class PatientDiagnosticViewRepositoryImpl 
  implements PatientDiagnosticViewRepository {
  
  async getDiagnosis(): Promise<DiagnosisView | null> {
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .select('*')
        .maybeSingle();

      if (error) {
        throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
      }

      return data ? this.mapToDiagnosisView(data) : null;
    } catch (error) {
      // Handle and rethrow
      throw error;
    }
  }

  private mapToDiagnosisView(data: any): DiagnosisView {
    return {
      id: data.id,
      type: data.type,
      grade: data.grade,
      stage: data.stage,
      enteredAt: data.entered_at,
      updatedAt: data.updated_at,
    };
  }
}
```

### Service Implementation Example

```typescript
import { PatientDiagnosticViewRepository } from '../repository/patient-diagnostic-view.repository.interface';
import { DiagnosisDisplay, DiagnosisView } from './types';

export class PatientDiagnosticViewService {
  constructor(
    private repository: PatientDiagnosticViewRepository
  ) {}

  async getDiagnosis(): Promise<DiagnosisDisplay | null> {
    const diagnosis = await this.repository.getDiagnosis();
    if (!diagnosis) return null;

    return this.formatDiagnosis(diagnosis);
  }

  private formatDiagnosis(diagnosis: DiagnosisView): DiagnosisDisplay {
    return {
      type: diagnosis.type,
      displayLabel: diagnosis.type === 'gingivitis' 
        ? 'Gingivitis' 
        : 'Periodontitis',
      grade: diagnosis.grade,
      stage: diagnosis.stage,
      gradeLabel: diagnosis.grade ? `Grade ${diagnosis.grade}` : null,
      stageLabel: diagnosis.stage ? `Stage ${diagnosis.stage}` : null,
      lastUpdated: this.formatDate(diagnosis.updatedAt),
    };
  }

  private formatDate(dateString: string): string {
    // Format date for display
    return new Date(dateString).toLocaleDateString();
  }
}
```

### Hook Implementation Example

```typescript
import { useQuery } from '@tanstack/react-query';
import { PatientDiagnosticViewService } from '../service/patient-diagnostic-view.service';
import { useMemo } from 'react';

export function usePatientDiagnosticView() {
  const service = useMemo(
    () => new PatientDiagnosticViewService(/* repository */),
    []
  );

  const {
    data: diagnosis,
    isLoading: diagnosisLoading,
    error: diagnosisError,
    refetch: refetchDiagnosis,
  } = useQuery({
    queryKey: ['patient-diagnostic-view', 'diagnosis'],
    queryFn: () => service.getDiagnosis(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Similar for risk factors and recommendations...

  return {
    diagnosis,
    diagnosisLoading,
    diagnosisError,
    refetchDiagnosis,
    // ... other fields
  };
}
```

### Component Implementation Example

```typescript
import { DiagnosisViewProps } from './types';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export function DiagnosisView({
  diagnosis,
  isLoading,
  error,
  onRetry,
}: DiagnosisViewProps) {
  if (isLoading) {
    return <DiagnosisSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Unable to load diagnosis information.
        </Text>
        {onRetry && (
          <Button title="Retry" onPress={onRetry} />
        )}
      </View>
    );
  }

  if (!diagnosis) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No diagnosis information is available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Diagnosis</Text>
      <Text style={styles.value}>{diagnosis.displayLabel}</Text>
      {diagnosis.gradeLabel && (
        <Text style={styles.detail}>{diagnosis.gradeLabel}</Text>
      )}
      {diagnosis.stageLabel && (
        <Text style={styles.detail}>{diagnosis.stageLabel}</Text>
      )}
      <Text style={styles.updated}>
        Last updated: {diagnosis.lastUpdated}
      </Text>
    </View>
  );
}
```

## Testing Checklist

- [ ] Repository tests pass (80% coverage)
- [ ] Service tests pass (80% coverage)
- [ ] Component tests pass (60% coverage)
- [ ] Integration tests pass
- [ ] All tests run in CI/CD
- [ ] Manual testing on iOS
- [ ] Manual testing on Android
- [ ] Accessibility testing
- [ ] Performance testing (load times < 2-3s)

## Common Issues & Solutions

### Issue: RLS Policy Not Working

**Solution**: Ensure Supabase client is using authenticated session. Check that `auth.uid()` matches patient ID.

### Issue: Data Not Loading

**Solution**: Check React Query cache configuration. Verify service methods are being called. Check network tab for API errors.

### Issue: Empty States Not Showing

**Solution**: Ensure components handle null/empty data correctly. Check that service returns null for missing data, not empty objects.

### Issue: Performance Issues

**Solution**: Use React Query caching. Implement parallel queries for comprehensive view. Use React.memo for expensive components.

## Next Steps

1. Implement repository layer
2. Implement service layer
3. Implement hooks
4. Implement components
5. Create page
6. Write tests
7. Manual testing
8. Code review
9. Merge to main

## References

- [Specification](./spec.md)
- [Data Model](./data-model.md)
- [API Contracts](./contracts/api-contracts.md)
- [Research](./research.md)
- [Constitution](../../speckit.constitution)

