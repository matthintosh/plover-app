# Tasks: Patient OTP Login

**Input**: Design documents from `/specs/001-patient-otp-login/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution requirements (80% services/repositories, 70% hooks, 60% components, 100% critical logic).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Note**: Since this feature extends existing authentication infrastructure, minimal setup is needed. Most infrastructure is already in place.

- [x] T001 Verify existing authentication feature structure in src/features/authentication/
- [x] T002 Verify Supabase client configuration in src/lib/supabase/client.ts
- [x] T003 Verify existing patient repository in src/features/authentication/repository/patient.repository.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Note**: Most foundational infrastructure already exists. This phase focuses on OTP-specific setup.

- [x] T004 Verify Supabase Auth OTP configuration (email templates, expiration settings)
- [x] T005 [P] Add OTP-related types to src/features/authentication/service/types.ts
- [x] T006 [P] Create rate limiting utility for OTP requests in src/lib/utils/rate-limiting.ts (if custom rate limiting needed)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Patient Chooses Authentication Method (Priority: P1) 🎯 MVP

**Goal**: Enable patients to choose between magic link or OTP authentication methods before entering their email address.

**Independent Test**: Navigate to patient login screen and verify that both authentication method options (magic link and OTP) are clearly presented and selectable. Test is successful when patients can choose between methods before entering their email.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Component test for authentication method selector in src/features/authentication/components/__tests__/AuthMethodSelector.test.tsx
- [x] T008 [P] [US1] Integration test for method selection flow in src/features/authentication/__tests__/integration/method-selection.test.ts

### Implementation for User Story 1

- [x] T009 [P] [US1] Create AuthMethodSelector component in src/features/authentication/components/AuthMethodSelector.tsx
- [x] T010 [US1] Update login page to include method selection UI in src/app/(auth)/login.tsx
- [x] T011 [US1] Add state management for selected authentication method in src/app/(auth)/login.tsx
- [x] T012 [US1] Add email preservation when switching methods in src/app/(auth)/login.tsx
- [x] T013 [US1] Add conditional rendering of OTP vs magic link forms based on selection
- [x] T014 [US1] Add accessibility labels and hints for method selection UI
- [x] T015 [US1] Add visual feedback for selected authentication method

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Patient Logs In with OTP (Priority: P1) 🎯 MVP

**Goal**: Patients can authenticate using OTP codes - request code, receive via email, and verify to log in.

**Independent Test**: Patient selects OTP authentication, enters registered email, receives OTP code, enters code to log in. Test is successful when patient is authenticated and directed to dashboard.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T016 [P] [US2] Unit test for AuthService requestPatientOTP method in src/features/authentication/service/__tests__/auth.service.test.ts
- [x] T017 [P] [US2] Unit test for AuthService verifyPatientOTP method in src/features/authentication/service/__tests__/auth.service.test.ts
- [x] T018 [P] [US2] Unit test for useOTP hook in src/features/authentication/hooks/__tests__/useOTP.test.ts
- [x] T019 [P] [US2] Integration test for OTP authentication flow in src/features/authentication/__tests__/integration/otp-auth.test.ts
- [x] T020 [P] [US2] Component test for PatientOTPRequestForm in src/features/authentication/components/__tests__/PatientOTPRequestForm.test.tsx
- [x] T021 [P] [US2] Component test for OTPCodeInput in src/features/authentication/components/__tests__/OTPCodeInput.test.tsx

### Implementation for User Story 2

- [x] T022 [P] [US2] Add RequestPatientOTPInput and RequestPatientOTPResult types to src/features/authentication/service/types.ts
- [x] T023 [P] [US2] Add VerifyPatientOTPInput and VerifyPatientOTPResult types to src/features/authentication/service/types.ts
- [x] T024 [US2] Create AuthService requestPatientOTP method in src/features/authentication/service/auth.service.ts
- [x] T025 [US2] Create AuthService verifyPatientOTP method in src/features/authentication/service/auth.service.ts
- [x] T026 [US2] Add rate limiting logic for OTP requests in src/features/authentication/service/auth.service.ts
- [x] T027 [US2] Add OTP code format validation in src/features/authentication/service/auth.service.ts
- [x] T028 [US2] Create useOTP hook in src/features/authentication/hooks/useOTP.ts
- [x] T029 [P] [US2] Create PatientOTPRequestForm component in src/features/authentication/components/PatientOTPRequestForm.tsx
- [x] T030 [P] [US2] Create OTPCodeInput component in src/features/authentication/components/OTPCodeInput.tsx
- [x] T031 [US2] Create OTP verification page in src/app/(auth)/otp-verify.tsx
- [x] T032 [US2] Add error handling for invalid/expired OTP codes
- [x] T033 [US2] Add "Request New Code" functionality for expired codes
- [x] T034 [US2] Add loading states for OTP request and verification
- [x] T035 [US2] Add success feedback when OTP code is sent
- [x] T036 [US2] Integrate OTP verification with existing session management
- [x] T037 [US2] Add navigation from OTP request to verification page
- [x] T038 [US2] Add email validation before OTP request (must be registered patient)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Patient Continues Using Magic Link (Priority: P1)

**Goal**: Ensure existing magic link authentication flow continues to work without modification when patients select magic link method.

**Independent Test**: Patient selects magic link authentication, enters email, receives magic link email, clicks link to authenticate. Test is successful when patient is authenticated using magic link method identically to existing implementation.

### Tests for User Story 3

- [x] T039 [P] [US3] Integration test for magic link flow with method selection in src/features/authentication/__tests__/integration/magic-link-compatibility.test.ts
- [x] T040 [P] [US3] Regression test to verify existing magic link functionality unchanged in src/features/authentication/__tests__/integration/magic-link-regression.test.ts

### Implementation for User Story 3

- [x] T041 [US3] Verify PatientMagicLinkRequestForm works with method selection UI in src/app/(auth)/login.tsx
- [x] T042 [US3] Ensure magic link flow redirects correctly after method selection
- [x] T043 [US3] Verify existing magic link handler page works unchanged in src/app/(auth)/magic-link.tsx
- [x] T044 [US3] Add test to ensure magic link and OTP methods don't interfere with each other
- [x] T045 [US3] Verify email preservation works when switching from magic link to OTP and back

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 [P] Add comprehensive error boundaries for OTP authentication flows
- [ ] T047 [P] Add loading skeletons for OTP request and verification states
- [ ] T048 [P] Add accessibility labels and hints to all OTP-related components
- [ ] T049 [P] Add analytics tracking for OTP authentication method selection
- [ ] T050 [P] Add rate limiting monitoring and alerting
- [ ] T051 [P] Optimize OTP code input for mobile keyboards (numeric keyboard)
- [ ] T052 [P] Add auto-submit when 6 digits entered in OTP code input (optional enhancement)
- [ ] T053 [P] Add copy-paste support for OTP codes from email
- [ ] T054 [P] Add comprehensive logging for OTP authentication events
- [ ] T055 [P] Update documentation in README.md with OTP authentication instructions
- [ ] T056 [P] Run quickstart.md validation checklist
- [ ] T057 [P] Security audit for OTP implementation (rate limiting, code validation, expiration)
- [ ] T058 [P] Performance testing for OTP code delivery and verification
- [ ] T059 [P] Code cleanup and refactoring per constitution standards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification tasks only
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) since they're all P1
  - Or sequentially: US1 → US2 → US3 (recommended for single developer)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for method selection UI
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for method selection UI, but magic link flow itself is independent

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Types before service methods
- Service methods before hooks
- Hooks before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Types and components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: T016 [P] [US2] Unit test for AuthService requestPatientOTP method
Task: T017 [P] [US2] Unit test for AuthService verifyPatientOTP method
Task: T018 [P] [US2] Unit test for useOTP hook
Task: T019 [P] [US2] Integration test for OTP authentication flow
Task: T020 [P] [US2] Component test for PatientOTPRequestForm
Task: T021 [P] [US2] Component test for OTPCodeInput

# Launch all types together:
Task: T022 [P] [US2] Add RequestPatientOTPInput and RequestPatientOTPResult types
Task: T023 [P] [US2] Add VerifyPatientOTPInput and VerifyPatientOTPResult types

# Launch components together:
Task: T029 [P] [US2] Create PatientOTPRequestForm component
Task: T030 [P] [US2] Create OTPCodeInput component
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup (verification)
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Method Selection)
4. Complete Phase 4: User Story 2 (OTP Authentication)
5. **STOP and VALIDATE**: Test User Stories 1-2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Method Selection MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (OTP Authentication MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo (Backward Compatibility)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Method Selection)
   - Developer B: User Story 2 (OTP Authentication) - can start after US1 method selection UI
   - Developer C: User Story 3 (Magic Link Compatibility) - can start after US1
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow feature-based architecture: repository → service → hooks → components → pages
- All tasks must follow constitution standards (TypeScript strict, testing requirements, code quality)
- OTP functionality extends existing authentication feature - no new feature module needed

---

## Summary

- **Total Tasks**: 59
- **Setup Tasks**: 3 (Phase 1 - verification only)
- **Foundational Tasks**: 3 (Phase 2)
- **User Story Tasks**: 39 (Phases 3-5)
  - US1: 9 tasks (method selection)
  - US2: 23 tasks (OTP authentication)
  - US3: 5 tasks (magic link compatibility)
- **Polish Tasks**: 14 (Phase 6)

**Task Count per User Story**:
- US1: 9 tasks (method selection UI)
- US2: 23 tasks (core OTP functionality)
- US3: 5 tasks (backward compatibility verification)

**Parallel Opportunities**: 20+ tasks marked [P] can run in parallel

**Suggested MVP Scope**: User Stories 1-2 (Method Selection + OTP Authentication)
