# Implementation Plan: Plover Application

**Branch**: `001-plover-app` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-plover-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Plover is a mobile-first web application connecting periodontists and patients for personalized periodontal care monitoring. The application enables periodontists to manage patient diagnoses, risk factors, and recommendations, while patients can track daily symptoms, view statistics, and access educational content. The technical approach uses React Native with Expo Router for cross-platform mobile/web support, TypeScript for type safety, and Supabase as the complete backend solution (authentication, PostgreSQL database, file storage, and real-time capabilities).

## Technical Context

**Language/Version**: TypeScript 5.9.2 (strict mode enabled)  
**Primary Dependencies**: 
- React 19.1.0, React Native 0.81.5
- Expo SDK ~54.0.23 (Expo Router ~6.0.14 for file-based routing)
- Supabase JS client (authentication, database, storage, real-time)
- React Native Testing Library, Jest (testing)
- Detox (E2E testing - NEEDS CLARIFICATION: version and setup)

**Storage**: 
- Supabase PostgreSQL (primary database)
- Supabase Storage (file storage for article thumbnails, odontogram images)
- Local storage/cache for offline support (AsyncStorage or Expo SecureStore)

**Testing**: 
- Jest (unit and integration tests)
- React Native Testing Library (component tests)
- Detox (E2E tests - NEEDS CLARIFICATION: configuration and setup)
- Supabase test instance or mocks for integration tests

**Target Platform**: 
- Primary: Mobile web browsers (iOS Safari, Android Chrome) with PWA support
- Secondary: Desktop web browsers
- Future: Native iOS/Android apps via Expo

**Project Type**: Mobile/web application (single codebase, cross-platform)

**Performance Goals**: 
- 60 FPS during scrolling and animations
- App launch time < 3s on average mobile devices
- Time to interactive < 2s
- API response time < 2s (p95)
- Initial bundle size < 2MB (gzipped)
- Memory usage < 150MB on average devices
- Support 1,000 concurrent users without degradation

**Constraints**: 
- Must comply with healthcare data privacy regulations (HIPAA considerations)
- Offline capability required for daily check-ins (sync when connection restored)
- Timezone-aware daily check-in tracking
- Secure data handling (encryption in transit and at rest)
- Mobile-first responsive design
- All key actions accessible within 2 taps

**Scale/Scope**: 
- Initial target: 100-500 periodontists, 1,000-5,000 patients
- 9 user stories (3 P1, 3 P2, 3 P3)
- ~15-20 feature modules following feature-based architecture
- ~50-60 functional requirements
- 9 core entities with relationships

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Feature-Based Architecture (MANDATORY)
✅ **PASS**: Plan follows feature-based structure with repository, service, hooks, components, and pages layers for each feature.

### II. Code Quality Standards
✅ **PASS**: TypeScript strict mode enabled, naming conventions defined, code organization principles established.

### III. Testing Standards (NON-NEGOTIABLE)
✅ **PASS**: Testing framework identified (Jest, React Native Testing Library, Detox). Coverage requirements defined (80% services/repositories, 70% hooks, 60% components, 100% critical logic).

### IV. User Experience Consistency
✅ **PASS**: Design system requirements defined, Expo Router for navigation, responsive design requirements specified.

### V. Performance Requirements
✅ **PASS**: Performance goals defined (60 FPS, <3s launch, <2s TTI, <2MB bundle, <150MB memory, 1k concurrent users).

**Gate Status**: ✅ **ALL GATES PASS** - Proceeding to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
├── app/                          # Expo Router pages (file-based routing)
│   ├── (auth)/                   # Auth routes (login, magic link)
│   │   ├── login.tsx
│   │   └── magic-link.tsx
│   ├── (tabs)/                   # Main app tabs (patient interface)
│   │   ├── index.tsx             # Home tab
│   │   ├── articles.tsx          # Articles tab
│   │   ├── follow-up.tsx         # My Follow-up tab
│   │   └── profile.tsx           # Profile tab
│   ├── (periodontist)/           # Periodontist dashboard routes
│   │   ├── dashboard.tsx
│   │   └── patient/[id].tsx
│   └── _layout.tsx               # Root layout
├── features/                     # Feature-based modules (per constitution)
│   ├── authentication/
│   │   ├── repository/
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.repository.interface.ts
│   │   ├── service/
│   │   │   ├── auth.service.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useMagicLink.ts
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── MagicLinkHandler.tsx
│   │   └── pages/                # Expo Router pages (if needed)
│   ├── periodontist-dashboard/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── patient-onboarding/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── daily-check-in/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── statistics/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── articles/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── follow-up/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   └── profile/
│       ├── repository/
│       ├── service/
│       ├── hooks/
│       ├── components/
│       └── pages/
├── components/                   # Shared components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── layout/                   # Layout components
│       ├── BottomTabBar.tsx
│       └── ...
├── constants/
│   └── theme.ts                  # Design system theme
├── hooks/                        # Shared hooks
│   └── use-color-scheme.ts
├── lib/                          # Shared utilities and configurations
│   ├── supabase/
│   │   ├── client.ts             # Supabase client setup
│   │   └── types.ts              # Generated Supabase types
│   └── utils/
│       └── ...
└── types/                        # Shared TypeScript types
    └── ...

tests/
├── unit/                         # Unit tests
├── integration/                  # Integration tests
├── e2e/                          # E2E tests (Detox)
└── __mocks__/                    # Test mocks
```

**Structure Decision**: Single codebase mobile/web application following feature-based architecture as mandated by constitution. Each feature module contains repository, service, hooks, components, and pages layers. Expo Router handles file-based routing in `src/app/`. Shared components and utilities are at the root level. Tests are organized by type (unit, integration, e2e) at the repository root.

## Phase 0: Research Complete ✅

**Status**: Complete  
**Output**: [research.md](./research.md)

All technology decisions have been made and documented:
- Supabase integration patterns
- E2E testing approach (Detox with Expo alternatives)
- Offline support patterns
- Healthcare compliance considerations
- State management (React Query)
- Image storage and optimization

## Phase 1: Design & Contracts Complete ✅

**Status**: Complete  
**Outputs**:
- [data-model.md](./data-model.md) - Complete entity definitions with relationships, validation rules, and RLS policies
- [contracts/api-contracts.md](./contracts/api-contracts.md) - Service layer interfaces and data contracts
- [quickstart.md](./quickstart.md) - Developer onboarding guide

**Agent Context**: Updated with TypeScript 5.9.2 and project context

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design*

### I. Feature-Based Architecture (MANDATORY)
✅ **PASS**: All features follow the required structure (repository, service, hooks, components, pages). Data model and contracts align with feature-based organization.

### II. Code Quality Standards
✅ **PASS**: TypeScript strict mode enforced. All contracts defined with TypeScript interfaces. Naming conventions documented.

### III. Testing Standards (NON-NEGOTIABLE)
✅ **PASS**: Testing strategy defined (Jest, React Native Testing Library, Detox). Test structure aligns with feature-based architecture.

### IV. User Experience Consistency
✅ **PASS**: Design system requirements documented. Navigation structure defined with Expo Router.

### V. Performance Requirements
✅ **PASS**: Performance goals defined and measurable. Offline support patterns address performance concerns.

**Gate Status**: ✅ **ALL GATES PASS** - Ready for Phase 2 (Task Planning)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All architecture decisions align with constitution requirements.
