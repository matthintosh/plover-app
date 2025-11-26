# Data Model: Patient Diagnostic View

**Feature**: Patient Diagnostic View  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document defines the data models and view structures for displaying patient medical information. The underlying database tables already exist (diagnosis, risk_factor, oral_hygiene_recommendation), so this focuses on the TypeScript types and view models used in the application layer.

## Database Schema Reference

### Diagnosis Table

```sql
CREATE TABLE diagnosis (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL UNIQUE REFERENCES patient(id),
  type diagnosis_type NOT NULL, -- 'gingivitis' | 'periodontitis'
  grade INTEGER, -- 1-4, required for periodontitis
  stage INTEGER, -- 1-4, required for periodontitis
  entered_by UUID NOT NULL REFERENCES periodontist(id),
  entered_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Risk Factor Table

```sql
CREATE TABLE risk_factor (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patient(id),
  type risk_factor_type NOT NULL, -- 'diabetes' | 'tobacco_use' | 'cardiovascular_disease' | 'cancer_hormonotherapy'
  details JSONB, -- Additional information (e.g., tobacco use level)
  entered_by UUID NOT NULL REFERENCES periodontist(id),
  entered_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  UNIQUE (patient_id, type)
);
```

### Oral Hygiene Recommendation Table

```sql
CREATE TABLE oral_hygiene_recommendation (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL UNIQUE REFERENCES patient(id),
  toothbrush_type TEXT,
  toothbrush_brand TEXT,
  toothbrush_model TEXT,
  entered_by UUID NOT NULL REFERENCES periodontist(id),
  entered_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

## TypeScript Types

### Diagnosis View Model

```typescript
export type DiagnosisType = 'gingivitis' | 'periodontitis';

export interface DiagnosisView {
  id: string;
  type: DiagnosisType;
  grade: number | null; // 1-4, only for periodontitis
  stage: number | null; // 1-4, only for periodontitis
  enteredAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

// Formatted display model
export interface DiagnosisDisplay {
  type: DiagnosisType;
  displayLabel: string; // "Gingivitis" or "Periodontitis"
  grade: number | null;
  stage: number | null;
  gradeLabel: string | null; // "Grade 1" or null
  stageLabel: string | null; // "Stage 1" or null
  lastUpdated: string; // Formatted date string
}
```

### Risk Factor View Model

```typescript
export type RiskFactorType = 
  | 'diabetes'
  | 'tobacco_use'
  | 'cardiovascular_disease'
  | 'cancer_hormonotherapy';

export interface RiskFactorDetails {
  level?: string; // For tobacco use: "light", "moderate", "heavy"
  notes?: string;
  [key: string]: unknown; // Allow for future extensibility
}

export interface RiskFactorView {
  id: string;
  type: RiskFactorType;
  details: RiskFactorDetails | null;
  enteredAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

// Formatted display model
export interface RiskFactorDisplay {
  id: string;
  type: RiskFactorType;
  displayLabel: string; // "Diabetes", "Tobacco Use", etc.
  details: RiskFactorDetails | null;
  formattedDetails: string; // Human-readable details string
  lastUpdated: string; // Formatted date string
}
```

### Oral Hygiene Recommendation View Model

```typescript
export interface OralHygieneRecommendationView {
  id: string;
  toothbrushType: string | null;
  toothbrushBrand: string | null;
  toothbrushModel: string | null;
  enteredAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

// Formatted display model
export interface OralHygieneRecommendationDisplay {
  toothbrushType: string | null;
  toothbrushBrand: string | null;
  toothbrushModel: string | null;
  formattedRecommendation: string; // Combined display string
  lastUpdated: string; // Formatted date string
}
```

### Comprehensive Medical Information View Model

```typescript
export interface ComprehensiveMedicalInfoView {
  diagnosis: DiagnosisView | null;
  riskFactors: RiskFactorView[];
  recommendation: OralHygieneRecommendationView | null;
}

export interface ComprehensiveMedicalInfoDisplay {
  diagnosis: DiagnosisDisplay | null;
  riskFactors: RiskFactorDisplay[];
  recommendation: OralHygieneRecommendationDisplay | null;
  hasAnyData: boolean; // True if at least one data type exists
}
```

## Data Validation Rules

### Diagnosis

- **Type**: Must be 'gingivitis' or 'periodontitis'
- **Grade**: Required for periodontitis (1-4), must be null for gingivitis
- **Stage**: Required for periodontitis (1-4), must be null for gingivitis
- **Validation**: Database constraint ensures grade/stage are only set for periodontitis

### Risk Factors

- **Type**: Must be one of the four enum values
- **Uniqueness**: Only one risk factor per type per patient (enforced by unique constraint)
- **Details**: JSONB field, structure validated at application level
- **Tobacco Use Details**: If type is 'tobacco_use', details.level should be present

### Oral Hygiene Recommendation

- **At least one field required**: toothbrushType, toothbrushBrand, or toothbrushModel must be non-null (enforced by database constraint)
- **Uniqueness**: One recommendation set per patient (enforced by unique constraint)

## Data Transformation

### Diagnosis Formatting

```typescript
function formatDiagnosis(diagnosis: DiagnosisView): DiagnosisDisplay {
  return {
    type: diagnosis.type,
    displayLabel: diagnosis.type === 'gingivitis' 
      ? 'Gingivitis' 
      : 'Periodontitis',
    grade: diagnosis.grade,
    stage: diagnosis.stage,
    gradeLabel: diagnosis.grade ? `Grade ${diagnosis.grade}` : null,
    stageLabel: diagnosis.stage ? `Stage ${diagnosis.stage}` : null,
    lastUpdated: formatDate(diagnosis.updatedAt)
  };
}
```

### Risk Factor Formatting

```typescript
function formatRiskFactor(riskFactor: RiskFactorView): RiskFactorDisplay {
  const typeLabels: Record<RiskFactorType, string> = {
    diabetes: 'Diabetes',
    tobacco_use: 'Tobacco Use',
    cardiovascular_disease: 'Cardiovascular Disease',
    cancer_hormonotherapy: 'Cancer with Hormonotherapy'
  };

  return {
    id: riskFactor.id,
    type: riskFactor.type,
    displayLabel: typeLabels[riskFactor.type],
    details: riskFactor.details,
    formattedDetails: formatRiskFactorDetails(riskFactor.type, riskFactor.details),
    lastUpdated: formatDate(riskFactor.updatedAt)
  };
}
```

### Recommendation Formatting

```typescript
function formatRecommendation(
  recommendation: OralHygieneRecommendationView
): OralHygieneRecommendationDisplay {
  const parts: string[] = [];
  if (recommendation.toothbrushType) parts.push(recommendation.toothbrushType);
  if (recommendation.toothbrushBrand) parts.push(recommendation.toothbrushBrand);
  if (recommendation.toothbrushModel) parts.push(recommendation.toothbrushModel);

  return {
    toothbrushType: recommendation.toothbrushType,
    toothbrushBrand: recommendation.toothbrushBrand,
    toothbrushModel: recommendation.toothbrushModel,
    formattedRecommendation: parts.length > 0 
      ? parts.join(' - ') 
      : 'No recommendation available',
    lastUpdated: formatDate(recommendation.updatedAt)
  };
}
```

## Empty State Handling

### Diagnosis Empty State

```typescript
export const EMPTY_DIAGNOSIS_MESSAGE = 
  "No diagnosis information is available. Your periodontist will enter this information after your examination.";
```

### Risk Factors Empty State

```typescript
export const EMPTY_RISK_FACTORS_MESSAGE = 
  "No risk factors have been documented. Your periodontist will update this information as needed.";
```

### Recommendations Empty State

```typescript
export const EMPTY_RECOMMENDATIONS_MESSAGE = 
  "No oral hygiene recommendations are available. Your periodontist will provide recommendations based on your treatment plan.";
```

## Relationships

### Patient → Diagnosis
- **Cardinality**: One-to-one (one diagnosis per patient)
- **Access**: Patient can only view their own diagnosis (RLS policy)

### Patient → Risk Factors
- **Cardinality**: One-to-many (multiple risk factors per patient)
- **Access**: Patient can only view their own risk factors (RLS policy)
- **Constraint**: One risk factor per type per patient

### Patient → Oral Hygiene Recommendation
- **Cardinality**: One-to-one (one recommendation set per patient)
- **Access**: Patient can only view their own recommendations (RLS policy)

## Security & Access Control

### Row-Level Security (RLS)

All tables have RLS policies that ensure:
- Patients can only SELECT their own records
- Periodontists can SELECT/INSERT/UPDATE records for their patients
- Access is enforced at the database level

### Application-Level Security

- Repository layer uses authenticated Supabase client
- Service layer validates patient context
- Components receive data already filtered by RLS
- No additional security checks needed (RLS is sufficient)

## Data Flow

1. **User Action**: Patient navigates to medical information view
2. **Hook**: `usePatientDiagnosticView` hook is called
3. **Service**: Service layer requests data from repository
4. **Repository**: Repository queries Supabase with authenticated user
5. **Database**: RLS policies filter data to patient's records only
6. **Repository**: Returns raw data from database
7. **Service**: Transforms raw data to display models
8. **Hook**: Provides formatted data to component
9. **Component**: Renders formatted data or empty state

## Caching Strategy

- **React Query**: Caches data for 5 minutes (staleTime)
- **Cache Key**: Based on patient ID and data type
- **Invalidation**: Manual refetch when needed, or automatic after cache expires
- **Optimistic Updates**: Not applicable (read-only feature)

## Error Handling

### Network Errors
- Display: "Unable to load information. Please check your connection and try again."
- Action: Retry button available

### Missing Data
- Display: Appropriate empty state message
- Action: No action needed (expected state)

### Permission Errors
- Display: "You don't have permission to view this information."
- Action: Contact support (should not occur due to RLS)

### Invalid Data
- Display: "Information is temporarily unavailable."
- Action: Retry or contact support
- Logging: Detailed error logged for debugging

