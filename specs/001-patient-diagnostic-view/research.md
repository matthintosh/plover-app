# Research: Patient Diagnostic View

**Feature**: Patient Diagnostic View  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This feature enables patients to view their medical information (diagnosis, risk factors, recommendations) that has been entered by their periodontist. Since the database schema, RLS policies, and infrastructure already exist, this research focuses on implementation patterns and best practices for read-only data display.

## Technology Decisions

### Data Access Layer

**Decision**: Use Supabase client with existing RLS policies  
**Rationale**: 
- Database tables (diagnosis, risk_factor, oral_hygiene_recommendation) already exist
- RLS policies ensure patients can only view their own data
- No additional security layer needed
- Consistent with existing features

**Alternatives considered**:
- Custom API endpoints: Rejected - unnecessary abstraction when RLS handles security
- GraphQL: Rejected - RESTful Supabase queries sufficient for read-only operations

### State Management & Data Fetching

**Decision**: React Query (@tanstack/react-query)  
**Rationale**:
- Already used in project (established pattern)
- Automatic caching reduces redundant API calls
- Built-in loading and error states
- Optimistic updates not needed (read-only)
- Stale-while-revalidate pattern improves perceived performance

**Alternatives considered**:
- Redux: Rejected - overkill for read-only data, React Query sufficient
- SWR: Rejected - React Query already established in project

### Component Architecture

**Decision**: Separate components for each view type (DiagnosisView, RiskFactorsView, RecommendationsView) + comprehensive view  
**Rationale**:
- Single Responsibility Principle - each component handles one data type
- Reusable components can be used independently
- Comprehensive view composes individual components
- Easier to test and maintain
- Follows existing component patterns in project

**Alternatives considered**:
- Single monolithic component: Rejected - violates SRP, harder to test
- One component with props: Rejected - less flexible, harder to reuse

### Empty State Handling

**Decision**: Display user-friendly messages when data is missing  
**Rationale**:
- Improves user experience
- Reduces confusion when periodontist hasn't entered data yet
- Clear communication about what information is expected
- Follows UX best practices for empty states

**Implementation**: Each component checks for data existence and displays appropriate empty state message

### Data Formatting

**Decision**: Format medical data for non-medical users  
**Rationale**:
- Patients may not understand medical terminology
- Clear labels and explanations improve comprehension
- Consistent formatting across all views
- Accessibility considerations

**Implementation**: 
- Human-readable labels for diagnosis types
- Clear display of grade/stage with explanations
- Formatted risk factor details
- Plain language for recommendations

## Integration Patterns

### Repository Pattern

**Decision**: Create repository interface and implementation following existing patterns  
**Rationale**:
- Consistent with project architecture
- Easy to test with mocks
- Clear separation of concerns
- Follows constitution requirements

**Implementation**: 
- `PatientDiagnosticViewRepository` interface
- Supabase implementation
- Methods: `getDiagnosis()`, `getRiskFactors()`, `getRecommendations()`, `getAllMedicalInfo()`

### Service Layer

**Decision**: Service layer orchestrates data fetching and formatting  
**Rationale**:
- Business logic separation
- Data transformation (formatting for display)
- Error handling centralization
- Testable without UI

**Implementation**:
- `PatientDiagnosticViewService`
- Methods return formatted data ready for display
- Handles error cases (missing data, network errors)

### Custom Hooks

**Decision**: `usePatientDiagnosticView` hook manages state and data fetching  
**Rationale**:
- Encapsulates React Query logic
- Provides clean API to components
- Handles loading, error, success states
- Reusable across components

**Implementation**:
- Uses React Query hooks internally
- Exposes: `{ diagnosis, riskFactors, recommendations, isLoading, error, refetch }`
- Separate hooks for individual data types if needed

## Performance Considerations

### Caching Strategy

**Decision**: React Query default caching with 5-minute stale time  
**Rationale**:
- Medical data doesn't change frequently
- Reduces unnecessary API calls
- Improves perceived performance
- Balance between freshness and performance

**Implementation**: Configure React Query with appropriate staleTime and cacheTime

### Data Fetching

**Decision**: Fetch all data in parallel when displaying comprehensive view  
**Rationale**:
- Faster than sequential fetching
- React Query handles parallel queries efficiently
- Better user experience
- Meets 3-second load time requirement

**Implementation**: Use `useQueries` or multiple `useQuery` hooks in parallel

## Security Considerations

### Data Access

**Decision**: Rely on existing RLS policies  
**Rationale**:
- Policies already tested and verified
- No additional security layer needed
- Consistent with rest of application
- Database-level security is most secure

**Implementation**: Use Supabase client with authenticated user - RLS automatically filters data

### Error Handling

**Decision**: Don't expose detailed error messages to users  
**Rationale**:
- Prevents information leakage
- User-friendly error messages
- Log detailed errors server-side
- Follows security best practices

**Implementation**: Generic error messages for users, detailed logging for debugging

## Accessibility Considerations

**Decision**: Follow WCAG AA standards  
**Rationale**:
- Legal compliance
- Better user experience
- Inclusive design
- Project requirement

**Implementation**:
- Proper semantic HTML/React Native components
- Screen reader labels
- Sufficient color contrast
- Keyboard navigation support
- Clear focus indicators

## Testing Strategy

### Unit Tests

**Decision**: Test repositories and services in isolation  
**Rationale**:
- Fast execution
- Easy to mock dependencies
- High coverage possible
- Catches logic errors early

**Implementation**: Mock Supabase client, test data transformation logic

### Integration Tests

**Decision**: Test data fetching flows  
**Rationale**:
- Verifies RLS policies work correctly
- Tests error handling
- Validates data flow
- Catches integration issues

**Implementation**: Use test Supabase instance or mocks with realistic data

### Component Tests

**Decision**: Test component rendering and user interactions  
**Rationale**:
- Verifies UI displays correctly
- Tests empty states
- Validates accessibility
- Ensures user experience

**Implementation**: React Native Testing Library, test rendering, user interactions, accessibility

## Summary

All technology decisions leverage existing infrastructure and follow established patterns in the project. No new dependencies required. Implementation will follow feature-based architecture with repository, service, hooks, and components layers. React Query handles data fetching and caching. Existing RLS policies ensure security. Focus is on creating clear, user-friendly displays of medical information.

