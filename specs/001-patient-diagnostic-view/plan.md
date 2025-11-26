# Implementation Plan: Patient Diagnostic View

**Branch**: `001-patient-diagnostic-view` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-patient-diagnostic-view/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature enables patients to view their medical information including diagnosis (gingivitis or periodontitis with grade/stage), risk factors (diabetes, tobacco use, cardiovascular disease, cancer with hormonotherapy), and oral hygiene recommendations (toothbrush type, brand, model). The implementation follows the existing feature-based architecture pattern, leveraging existing database tables and RLS policies. This is a read-only viewing feature that displays information already entered by periodontists through a separate interface.

## Technical Context

**Language/Version**: TypeScript 5.9.2 (strict mode enabled)  
**Primary Dependencies**: 
- React 19.1.0, React Native 0.81.5
- Expo SDK ~54.0.23 (Expo Router ~6.0.14 for file-based routing)
- Supabase JS client (authentication, database)
- React Query (@tanstack/react-query) for data fetching and caching
- React Native Testing Library, Jest (testing)

**Storage**: 
- Supabase PostgreSQL (existing tables: diagnosis, risk_factor, oral_hygiene_recommendation)
- Existing RLS policies ensure patients can only view their own data

**Testing**: 
- Jest (unit and integration tests)
- React Native Testing Library (component tests)
- Supabase mocks for integration tests

**Target Platform**: 
- Primary: Mobile web browsers (iOS Safari, Android Chrome)
- Secondary: Desktop web browsers
- Future: Native iOS/Android apps via Expo

**Project Type**: Mobile/web application (single codebase, cross-platform)

**Performance Goals**: 
- View pages load within 2 seconds (per SC-001, SC-002, SC-003)
- Comprehensive view loads within 3 seconds (per SC-005)
- Smooth scrolling and navigation (60 FPS)
- Efficient data fetching with React Query caching

**Constraints**: 
- Must comply with healthcare data privacy regulations (HIPAA considerations)
- Read-only access - patients cannot edit information
- Must handle missing data gracefully (empty states)
- Mobile-first responsive design
- Information must be displayed in clear, non-medical language

**Scale/Scope**: 
- 4 user stories (2 P1, 2 P2)
- 12 functional requirements
- 3 core entities (Diagnosis, Risk Factor, Oral Hygiene Recommendation)
- Single feature module following feature-based architecture
- Reuses existing database schema and RLS policies

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Feature-Based Architecture (MANDATORY)
✅ **PASS**: Plan follows feature-based structure with repository, service, hooks, components, and pages layers. Feature will be organized as `src/features/patient-diagnostic-view/` with all required layers.

### II. Code Quality Standards
✅ **PASS**: TypeScript strict mode enabled, naming conventions defined, code organization principles established. All components and services will follow existing patterns.

### III. Testing Standards (NON-NEGOTIABLE)
✅ **PASS**: Testing framework identified (Jest, React Native Testing Library). Coverage requirements: 80% services/repositories, 70% hooks, 60% components, 100% critical logic (data access and security).

### IV. User Experience Consistency
✅ **PASS**: Design system requirements defined, Expo Router for navigation, responsive design requirements specified. Will use existing theme system and UI components.

### V. Performance Requirements
✅ **PASS**: Performance goals defined (2-3s load times, 60 FPS, efficient caching). React Query will handle caching and data fetching optimization.

**Gate Status**: ✅ **ALL GATES PASS** - Proceeding to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-patient-diagnostic-view/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── patient-diagnostic-view/    # New feature module
│       ├── repository/
│       │   ├── patient-diagnostic-view.repository.ts
│       │   └── patient-diagnostic-view.repository.interface.ts
│       ├── service/
│       │   ├── patient-diagnostic-view.service.ts
│       │   └── types.ts
│       ├── hooks/
│       │   └── usePatientDiagnosticView.ts
│       ├── components/
│       │   ├── DiagnosisView.tsx
│       │   ├── RiskFactorsView.tsx
│       │   ├── RecommendationsView.tsx
│       │   ├── ComprehensiveMedicalView.tsx
│       │   └── __tests__/
│       │       ├── DiagnosisView.test.tsx
│       │       ├── RiskFactorsView.test.tsx
│       │       ├── RecommendationsView.test.tsx
│       │       └── ComprehensiveMedicalView.test.tsx
│       └── __tests__/
│           ├── integration/
│           │   └── patient-diagnostic-view.test.ts
│           └── unit/
│               ├── patient-diagnostic-view.service.test.ts
│               └── patient-diagnostic-view.repository.test.ts
├── app/
│   └── (tabs)/
│       └── medical-info.tsx        # New page for comprehensive view
```

**Structure Decision**: Single feature module following the established feature-based architecture pattern. The feature will be self-contained with repository, service, hooks, and components layers. Pages will be added to the existing Expo Router structure in `src/app/(tabs)/`. This maintains consistency with existing features like `follow-up`, `articles`, and `profile`.

## Complexity Tracking

> **No violations** - Feature follows standard patterns and reuses existing infrastructure.

## Phase 0: Research Complete ✅

**Status**: Complete  
**Output**: [research.md](./research.md)

All technology decisions leverage existing infrastructure:
- Supabase database tables and RLS policies already exist
- React Query patterns established in other features
- Component patterns follow existing UI components
- No new technology dependencies required

## Phase 1: Design & Contracts Complete ✅

**Status**: Complete  
**Outputs**:
- [data-model.md](./data-model.md) - View models and data structures for displaying patient medical information
- [contracts/api-contracts.md](./contracts/api-contracts.md) - Service layer interfaces for fetching diagnosis, risk factors, and recommendations
- [quickstart.md](./quickstart.md) - Developer guide for implementing patient diagnostic view feature

**Agent Context**: Updated with TypeScript 5.9.2 and feature context

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design*

### I. Feature-Based Architecture (MANDATORY)
✅ **PASS**: Feature follows required structure (repository, service, hooks, components, pages). Data model and contracts align with feature-based organization.

### II. Code Quality Standards
✅ **PASS**: TypeScript strict mode, explicit types, proper error handling patterns defined.

### III. Testing Standards (NON-NEGOTIABLE)
✅ **PASS**: Test structure defined with unit, integration, and component tests. Coverage requirements specified.

### IV. User Experience Consistency
✅ **PASS**: Uses existing theme system, follows design patterns, responsive design specified.

### V. Performance Requirements
✅ **PASS**: Performance goals defined (2-3s load times), React Query caching strategy specified.

**Gate Status**: ✅ **ALL GATES PASS** - Ready for task breakdown.
