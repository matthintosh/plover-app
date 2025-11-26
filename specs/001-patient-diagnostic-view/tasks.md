# Tasks: Patient Diagnostic View

**Input**: Design documents from `/specs/001-patient-diagnostic-view/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution requirements (80% services/repositories, 70% hooks, 60% components, 100% critical logic).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Feature Structure)

**Purpose**: Create feature directory structure and basic setup

- [x] T001 Create feature directory structure in src/features/patient-diagnostic-view/
- [x] T002 [P] Create repository directory structure in src/features/patient-diagnostic-view/repository/
- [x] T003 [P] Create service directory structure in src/features/patient-diagnostic-view/service/
- [x] T004 [P] Create hooks directory structure in src/features/patient-diagnostic-view/hooks/
- [x] T005 [P] Create components directory structure in src/features/patient-diagnostic-view/components/
- [x] T006 [P] Create test directory structure in src/features/patient-diagnostic-view/__tests__/

---

## Phase 2: Foundational (Shared Types and Infrastructure)

**Purpose**: Core types and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create TypeScript types file in src/features/patient-diagnostic-view/service/types.ts
- [x] T008 [P] Define DiagnosisView and DiagnosisDisplay types in src/features/patient-diagnostic-view/service/types.ts
- [x] T009 [P] Define RiskFactorView and RiskFactorDisplay types in src/features/patient-diagnostic-view/service/types.ts
- [x] T010 [P] Define OralHygieneRecommendationView and OralHygieneRecommendationDisplay types in src/features/patient-diagnostic-view/service/types.ts
- [x] T011 [P] Define ComprehensiveMedicalInfoView and ComprehensiveMedicalInfoDisplay types in src/features/patient-diagnostic-view/service/types.ts
- [x] T012 Create repository interface in src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.interface.ts
- [x] T013 Create service interface in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts (class with interface methods)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Diagnosis Information (Priority: P1) 🎯 MVP

**Goal**: Patients can view their diagnosis information (gingivitis or periodontitis with grade and stage)

**Independent Test**: Periodontist enters a diagnosis for a patient, then patient logs in and navigates to view their diagnosis. Test is successful when patient sees their diagnosis type, and if periodontitis, the grade and stage correctly displayed.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Unit test for PatientDiagnosticViewRepository getDiagnosis method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.repository.test.ts
- [ ] T015 [P] [US1] Unit test for PatientDiagnosticViewService getDiagnosis method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.service.test.ts
- [ ] T016 [P] [US1] Integration test for diagnosis viewing flow in src/features/patient-diagnostic-view/__tests__/integration/patient-diagnostic-view.test.ts
- [ ] T017 [P] [US1] Component test for DiagnosisView in src/features/patient-diagnostic-view/components/__tests__/DiagnosisView.test.tsx

### Implementation for User Story 1

- [x] T018 [US1] Implement PatientDiagnosticViewRepository getDiagnosis method in src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.ts
- [x] T019 [US1] Implement PatientDiagnosticViewService getDiagnosis method in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T020 [US1] Implement formatDiagnosis helper function in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T021 [US1] Create useDiagnosis hook in src/features/patient-diagnostic-view/hooks/usePatientDiagnosticView.ts
- [x] T022 [US1] Create DiagnosisView component in src/features/patient-diagnostic-view/components/DiagnosisView.tsx
- [x] T023 [US1] Add empty state handling for missing diagnosis in src/features/patient-diagnostic-view/components/DiagnosisView.tsx
- [x] T024 [US1] Add error state handling with retry in src/features/patient-diagnostic-view/components/DiagnosisView.tsx
- [x] T025 [US1] Add loading state with skeleton in src/features/patient-diagnostic-view/components/DiagnosisView.tsx
- [x] T026 [US1] Format diagnosis display labels (Gingivitis/Periodontitis) in src/features/patient-diagnostic-view/components/DiagnosisView.tsx
- [x] T027 [US1] Display grade and stage labels for periodontitis in src/features/patient-diagnostic-view/components/DiagnosisView.tsx
- [x] T028 [US1] Add accessibility labels and hints to DiagnosisView component

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Risk Factors (Priority: P1)

**Goal**: Patients can view all risk factors associated with their periodontal health

**Independent Test**: Periodontist enters multiple risk factors for a patient, then patient logs in and views their risk factors. Test is successful when all risk factors are displayed correctly with their details.

### Tests for User Story 2

- [ ] T029 [P] [US2] Unit test for PatientDiagnosticViewRepository getRiskFactors method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.repository.test.ts
- [ ] T030 [P] [US2] Unit test for PatientDiagnosticViewService getRiskFactors method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.service.test.ts
- [ ] T031 [P] [US2] Integration test for risk factors viewing flow in src/features/patient-diagnostic-view/__tests__/integration/patient-diagnostic-view.test.ts
- [ ] T032 [P] [US2] Component test for RiskFactorsView in src/features/patient-diagnostic-view/components/__tests__/RiskFactorsView.test.tsx

### Implementation for User Story 2

- [x] T033 [US2] Implement PatientDiagnosticViewRepository getRiskFactors method in src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.ts
- [x] T034 [US2] Implement PatientDiagnosticViewService getRiskFactors method in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T035 [US2] Implement formatRiskFactor helper function in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T036 [US2] Implement formatRiskFactorDetails helper function for tobacco use level in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T037 [US2] Add useRiskFactors hook to usePatientDiagnosticView in src/features/patient-diagnostic-view/hooks/usePatientDiagnosticView.ts
- [x] T038 [US2] Create RiskFactorsView component in src/features/patient-diagnostic-view/components/RiskFactorsView.tsx
- [x] T039 [US2] Add empty state handling for no risk factors in src/features/patient-diagnostic-view/components/RiskFactorsView.tsx
- [x] T040 [US2] Add error state handling with retry in src/features/patient-diagnostic-view/components/RiskFactorsView.tsx
- [x] T041 [US2] Add loading state with skeleton in src/features/patient-diagnostic-view/components/RiskFactorsView.tsx
- [x] T042 [US2] Format risk factor type labels (Diabetes, Tobacco Use, etc.) in src/features/patient-diagnostic-view/components/RiskFactorsView.tsx
- [x] T043 [US2] Display risk factor details (tobacco use level) in src/features/patient-diagnostic-view/components/RiskFactorsView.tsx
- [x] T044 [US2] Add accessibility labels and hints to RiskFactorsView component

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Oral Hygiene Recommendations (Priority: P2)

**Goal**: Patients can view oral hygiene material recommendations (toothbrush type, brand, model)

**Independent Test**: Periodontist enters oral hygiene recommendations for a patient, then patient logs in and views their recommendations. Test is successful when patient sees the recommended toothbrush type, brand, and model correctly displayed.

### Tests for User Story 3

- [ ] T045 [P] [US3] Unit test for PatientDiagnosticViewRepository getRecommendations method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.repository.test.ts
- [ ] T046 [P] [US3] Unit test for PatientDiagnosticViewService getRecommendations method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.service.test.ts
- [ ] T047 [P] [US3] Integration test for recommendations viewing flow in src/features/patient-diagnostic-view/__tests__/integration/patient-diagnostic-view.test.ts
- [ ] T048 [P] [US3] Component test for RecommendationsView in src/features/patient-diagnostic-view/components/__tests__/RecommendationsView.test.tsx

### Implementation for User Story 3

- [x] T049 [US3] Implement PatientDiagnosticViewRepository getRecommendations method in src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.ts
- [x] T050 [US3] Implement PatientDiagnosticViewService getRecommendations method in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T051 [US3] Implement formatRecommendation helper function in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T052 [US3] Handle partial recommendation data (only brand, only type, etc.) in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T053 [US3] Add useRecommendations hook to usePatientDiagnosticView in src/features/patient-diagnostic-view/hooks/usePatientDiagnosticView.ts
- [x] T054 [US3] Create RecommendationsView component in src/features/patient-diagnostic-view/components/RecommendationsView.tsx
- [x] T055 [US3] Add empty state handling for no recommendations in src/features/patient-diagnostic-view/components/RecommendationsView.tsx
- [x] T056 [US3] Add error state handling with retry in src/features/patient-diagnostic-view/components/RecommendationsView.tsx
- [x] T057 [US3] Add loading state with skeleton in src/features/patient-diagnostic-view/components/RecommendationsView.tsx
- [x] T058 [US3] Format recommendation display string (type - brand - model) in src/features/patient-diagnostic-view/components/RecommendationsView.tsx
- [x] T059 [US3] Handle partial recommendation fields gracefully in src/features/patient-diagnostic-view/components/RecommendationsView.tsx
- [x] T060 [US3] Add accessibility labels and hints to RecommendationsView component

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Comprehensive Medical Information View (Priority: P2)

**Goal**: Patients can view all their medical information (diagnosis, risk factors, and recommendations) together in a unified view

**Independent Test**: Periodontist enters diagnosis, risk factors, and recommendations for a patient, then patient views a comprehensive medical information page. Test is successful when all three types of information are displayed together in an organized, easy-to-read format.

### Tests for User Story 4

- [ ] T061 [P] [US4] Unit test for PatientDiagnosticViewRepository getAllMedicalInfo method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.repository.test.ts
- [ ] T062 [P] [US4] Unit test for PatientDiagnosticViewService getComprehensiveMedicalInfo method in src/features/patient-diagnostic-view/__tests__/unit/patient-diagnostic-view.service.test.ts
- [ ] T063 [P] [US4] Integration test for comprehensive medical info viewing flow in src/features/patient-diagnostic-view/__tests__/integration/patient-diagnostic-view.test.ts
- [ ] T064 [P] [US4] Component test for ComprehensiveMedicalView in src/features/patient-diagnostic-view/components/__tests__/ComprehensiveMedicalView.test.tsx

### Implementation for User Story 4

- [x] T065 [US4] Implement PatientDiagnosticViewRepository getAllMedicalInfo method in src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.ts
- [x] T066 [US4] Implement parallel data fetching in getAllMedicalInfo using Promise.all in src/features/patient-diagnostic-view/repository/patient-diagnostic-view.repository.ts
- [x] T067 [US4] Implement PatientDiagnosticViewService getComprehensiveMedicalInfo method in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T068 [US4] Implement formatComprehensiveMedicalInfo helper function in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T069 [US4] Add useComprehensiveMedicalInfo hook to usePatientDiagnosticView in src/features/patient-diagnostic-view/hooks/usePatientDiagnosticView.ts
- [x] T070 [US4] Create ComprehensiveMedicalView component in src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx
- [x] T071 [US4] Compose DiagnosisView, RiskFactorsView, and RecommendationsView in ComprehensiveMedicalView
- [x] T072 [US4] Add section headers and organization to ComprehensiveMedicalView in src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx
- [x] T073 [US4] Handle partial data (some sections empty) in ComprehensiveMedicalView in src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx
- [x] T074 [US4] Add empty state when no medical information exists in src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx
- [x] T075 [US4] Add error state handling with retry in src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx
- [x] T076 [US4] Add loading state with skeleton in src/features/patient-diagnostic-view/components/ComprehensiveMedicalView.tsx
- [x] T077 [US4] Create medical information page in src/app/(tabs)/medical-info.tsx
- [x] T078 [US4] Integrate ComprehensiveMedicalView component in medical-info page
- [x] T079 [US4] Add navigation to medical-info page (if needed in tab bar or menu)
- [x] T080 [US4] Add accessibility labels and hints to ComprehensiveMedicalView component

**Checkpoint**: At this point, all User Stories 1-4 should be fully functional and independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T081 [P] Add React Query caching configuration (5-minute staleTime) in usePatientDiagnosticView hook
- [ ] T082 [P] Add error boundary handling for patient diagnostic view components
- [x] T083 [P] Add date formatting utility for lastUpdated fields in src/features/patient-diagnostic-view/service/patient-diagnostic-view.service.ts
- [x] T084 [P] Add empty state message constants in src/features/patient-diagnostic-view/service/constants.ts
- [ ] T085 [P] Optimize component rendering with React.memo where appropriate
- [ ] T086 [P] Add performance monitoring for data fetch times
- [ ] T087 [P] Add comprehensive error logging for debugging
- [ ] T088 [P] Verify RLS policy enforcement in integration tests
- [x] T089 [P] Add dark mode support to all components
- [ ] T090 [P] Add responsive design improvements for tablet/desktop
- [ ] T091 [P] Run quickstart.md validation checklist
- [x] T092 [P] Code cleanup and refactoring per constitution standards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run in parallel with US1)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run in parallel with US1/US2)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US1, US2, US3 for component composition

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Repository interface before implementation
- Repository implementation before service
- Service before hooks
- Hooks before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1-3 can start in parallel
- All tests for a user story marked [P] can run in parallel
- Repository methods within a story marked [P] can run in parallel (if implementing multiple methods)
- Different user stories can be worked on in parallel by different team members (US1, US2, US3)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T014 [P] [US1] Unit test for PatientDiagnosticViewRepository getDiagnosis method
Task: T015 [P] [US1] Unit test for PatientDiagnosticViewService getDiagnosis method
Task: T016 [P] [US1] Integration test for diagnosis viewing flow
Task: T017 [P] [US1] Component test for DiagnosisView

# After tests, implement repository and service:
Task: T018 [US1] Implement PatientDiagnosticViewRepository getDiagnosis method
Task: T019 [US1] Implement PatientDiagnosticViewService getDiagnosis method
Task: T020 [US1] Implement formatDiagnosis helper function
```

---

## Parallel Example: User Stories 1-3

```bash
# Once Foundational is complete, all three P1/P2 stories can run in parallel:
Developer A: User Story 1 (View Diagnosis)
Developer B: User Story 2 (View Risk Factors)  
Developer C: User Story 3 (View Recommendations)

# Each developer works independently through their story's tests and implementation
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (View Diagnosis)
4. Complete Phase 4: User Story 2 (View Risk Factors)
5. **STOP and VALIDATE**: Test User Stories 1-2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (View Diagnosis)
   - Developer B: User Story 2 (View Risk Factors)
   - Developer C: User Story 3 (View Recommendations)
3. After US1-3 complete:
   - Developer A: User Story 4 (Comprehensive View)
   - Developer B: Polish tasks
4. Stories complete and integrate independently

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
- Database tables and RLS policies already exist - no database setup needed
- Reuse existing Supabase client and React Query patterns from other features

---

## Summary

- **Total Tasks**: 92
- **Setup Tasks**: 6 (Phase 1)
- **Foundational Tasks**: 7 (Phase 2)
- **User Story Tasks**: 67 (Phases 3-6)
  - US1: 15 tasks (4 tests + 11 implementation)
  - US2: 16 tasks (4 tests + 12 implementation)
  - US3: 16 tasks (4 tests + 12 implementation)
  - US4: 20 tasks (4 tests + 16 implementation)
- **Polish Tasks**: 12 (Phase 7)

**Parallel Opportunities**: 40+ tasks marked [P] can run in parallel

**Suggested MVP Scope**: User Stories 1-2 (View Diagnosis + View Risk Factors)

