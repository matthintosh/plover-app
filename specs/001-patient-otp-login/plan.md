# Implementation Plan: Patient OTP Login

**Branch**: `001-patient-otp-login` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-patient-otp-login/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Patients can authenticate using OTP (One-Time Password) codes as an alternative to magic links. The feature adds OTP code generation, email delivery, validation, and expiration handling while maintaining the existing magic link authentication flow. Patients can choose their preferred authentication method (magic link or OTP) before entering their email address. The implementation leverages Supabase Auth's OTP capabilities and integrates seamlessly with the existing authentication infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.9.2 (strict mode enabled)  
**Primary Dependencies**: 
- React 19.1.0, React Native 0.81.5
- Expo SDK ~54.0.23 (Expo Router ~6.0.14 for file-based routing)
- Supabase JS client (authentication, database, storage, real-time)
- React Native Testing Library, Jest (testing)

**Storage**: 
- Supabase PostgreSQL (for OTP code storage and validation)
- Supabase Auth (for OTP code generation and email delivery)
- In-memory cache for rate limiting (optional, can use Supabase rate limiting)

**Testing**: 
- Jest (unit and integration tests)
- React Native Testing Library (component tests)
- Supabase test instance or mocks for integration tests

**Target Platform**: 
- Primary: Mobile web browsers (iOS Safari, Android Chrome) with PWA support
- Secondary: Desktop web browsers
- Future: Native iOS/Android apps via Expo

**Project Type**: Mobile/web application (single codebase, cross-platform)

**Performance Goals**: 
- OTP code delivery within 30 seconds (95th percentile)
- OTP validation response time < 1 second
- Authentication flow completion < 3 minutes from email entry
- No performance degradation to existing magic link flow

**Constraints**: 
- Must comply with healthcare data privacy regulations (HIPAA considerations)
- OTP codes must expire after 10 minutes (industry standard)
- Rate limiting: 5 OTP requests per email address per hour
- OTP codes must be single-use only
- Must maintain backward compatibility with existing magic link flow
- Secure OTP code generation (cryptographically secure random)
- No account creation via OTP (only existing patients)

**Scale/Scope**: 
- Target: All existing patients (1,000-5,000 initially)
- 3 user stories (all P1 priority)
- 1 new feature module (authentication enhancement)
- 15 functional requirements
- 1 new entity (OTP Code) with temporary storage requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Feature-Based Architecture (MANDATORY)
✅ **PASS**: Feature will extend existing authentication feature module following the established feature-based structure (repository, service, hooks, components, pages layers). OTP functionality will integrate into `src/features/authentication/` without creating duplicate structures.

### II. Code Quality Standards
✅ **PASS**: TypeScript strict mode already enabled. OTP implementation will follow existing naming conventions and code organization principles. All OTP-related code will have explicit types and proper error handling.

### III. Testing Standards (NON-NEGOTIABLE)
✅ **PASS**: Testing framework already established (Jest, React Native Testing Library). OTP feature will require unit tests for service layer (80% coverage), hook tests (70% coverage), and component tests (60% coverage). Critical OTP validation logic requires 100% coverage.

### IV. User Experience Consistency
✅ **PASS**: OTP authentication UI will use existing design system from `src/constants/theme.ts`. Authentication method selection will follow existing UI patterns. Loading states, error messages, and success feedback will match existing authentication flows.

### V. Performance Requirements
✅ **PASS**: OTP code delivery and validation performance goals defined (< 30s delivery, < 1s validation). No performance degradation to existing magic link flow. Rate limiting prevents abuse while maintaining user experience.

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
├── features/
│   └── authentication/          # Existing feature - will be extended
│       ├── repository/
│       │   ├── patient.repository.ts
│       │   └── patient.repository.interface.ts
│       ├── service/
│       │   ├── auth.service.ts   # Will add OTP methods
│       │   └── types.ts          # Will add OTP types
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useMagicLink.ts
│       │   └── useOTP.ts         # NEW: OTP hook
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── PatientMagicLinkRequestForm.tsx
│       │   ├── PatientOTPRequestForm.tsx      # NEW: OTP request form
│       │   └── OTPCodeInput.tsx              # NEW: OTP code input component
│       └── pages/                # Expo Router pages
│           └── (auth)/
│               ├── login.tsx     # Will add method selection UI
│               ├── magic-link.tsx
│               └── otp-verify.tsx            # NEW: OTP verification page
├── components/                   # Shared components
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   └── supabase/
│       └── client.ts
└── constants/
    └── theme.ts

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Single codebase mobile/web application following feature-based architecture. OTP functionality extends the existing `authentication` feature module rather than creating a separate feature. New components and hooks will be added to the authentication feature following the established layer structure (repository → service → hooks → components → pages).

## Phase 0: Research Complete ✅

**Status**: Complete  
**Output**: [research.md](./research.md)

All technology decisions have been made and documented:
- Supabase Auth OTP implementation approach
- OTP code format and expiration (6 digits, 10 minutes)
- Rate limiting strategy (Supabase + application-level)
- Authentication method selection UI pattern
- OTP code input component design
- OTP verification flow and routing
- Integration with existing magic link flow
- Error handling and security considerations
- Email template consistency

## Phase 1: Design & Contracts Complete ✅

**Status**: Complete  
**Outputs**:
- [data-model.md](./data-model.md) - OTP Code entity definition with validation rules and security considerations
- [contracts/api-contracts.md](./contracts/api-contracts.md) - Service layer interfaces and data contracts for OTP authentication
- [quickstart.md](./quickstart.md) - Developer integration guide with code examples and testing approaches

**Agent Context**: Will be updated with OTP authentication patterns and Supabase Auth OTP integration.

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design*

### I. Feature-Based Architecture (MANDATORY)
✅ **PASS**: OTP functionality extends existing authentication feature module following the required structure (repository, service, hooks, components, pages). No new feature module created - proper extension of existing feature.

### II. Code Quality Standards
✅ **PASS**: TypeScript strict mode enforced. All contracts defined with TypeScript interfaces. OTP implementation follows existing naming conventions and code organization.

### III. Testing Standards (NON-NEGOTIABLE)
✅ **PASS**: Testing strategy defined (Jest, React Native Testing Library). Test structure aligns with feature-based architecture. OTP validation logic requires 100% coverage.

### IV. User Experience Consistency
✅ **PASS**: OTP UI uses existing design system. Authentication method selection follows existing UI patterns. Consistent with magic link authentication flow.

### V. Performance Requirements
✅ **PASS**: Performance goals defined and measurable (OTP delivery < 30s, validation < 1s). Rate limiting prevents abuse. No performance degradation to existing flows.

**Gate Status**: ✅ **ALL GATES PASS** - Ready for Phase 2 (Task Planning)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. OTP feature extends existing authentication feature following established patterns.
