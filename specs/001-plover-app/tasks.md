# Tasks: Plover Application

**Input**: Design documents from `/specs/001-plover-app/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution requirements (80% services/repositories, 70% hooks, 60% components, 100% critical logic).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in src/
- [x] T002 Install and configure Supabase client dependencies (@supabase/supabase-js)
- [x] T003 [P] Install and configure React Query dependencies (@tanstack/react-query)
- [x] T004 [P] Install and configure testing dependencies (jest, @testing-library/react-native)
- [x] T005 [P] Install and configure AsyncStorage for offline support (@react-native-async-storage/async-storage)
- [x] T006 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T007 [P] Configure ESLint and Prettier per constitution standards
- [x] T008 [P] Setup environment variable configuration for Supabase (.env.local)
- [x] T009 Create shared types directory structure in src/types/
- [x] T010 Create shared utilities directory structure in src/lib/utils/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Setup Supabase project and get credentials (Supabase project configured and credentials stored in .env.local)
- [x] T012 Create database schema migrations in database/migrations/
- [x] T013 Create Periodontist table with RLS policies in database/migrations/001_create_periodontist.sql
- [x] T014 Create Patient table with RLS policies in database/migrations/002_create_patient.sql
- [x] T015 Create Diagnosis table with RLS policies in database/migrations/003_create_diagnosis.sql
- [x] T016 Create RiskFactor table with RLS policies in database/migrations/004_create_risk_factor.sql
- [x] T017 Create OnboardingResponse table with RLS policies in database/migrations/005_create_onboarding_response.sql
- [x] T018 Create DailyCheckIn table with RLS policies in database/migrations/006_create_daily_check_in.sql
- [x] T019 Create OralHygieneRecommendation table with RLS policies in database/migrations/007_create_oral_hygiene_recommendation.sql
- [x] T020 Create Odontogram table with RLS policies in database/migrations/008_create_odontogram.sql
- [x] T021 Create Article table with RLS policies in database/migrations/009_create_article.sql
- [x] T022 Create database indexes for performance in database/migrations/010_create_indexes.sql
- [x] T023 Setup Supabase client configuration in src/lib/supabase/client.ts
- [x] T024 Generate TypeScript types from Supabase schema in src/lib/supabase/types.ts
- [x] T025 [P] Create shared theme system in src/constants/theme.ts
- [x] T026 [P] Create shared UI components in src/components/ui/ (Button, Input, Card)
- [x] T027 [P] Create shared layout components in src/components/layout/ (BottomTabBar)
- [x] T028 [P] Setup React Query provider in src/app/_layout.tsx
- [x] T029 [P] Create error handling utilities in src/lib/utils/error-handling.ts
- [x] T030 [P] Create offline sync queue utility in src/lib/utils/offline-sync.ts
- [x] T031 Setup Expo Router root layout in src/app/_layout.tsx
- [x] T032 Create authentication context provider in src/lib/auth/AuthProvider.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Periodontist Registration and Patient Invitation (Priority: P1) 🎯 MVP

**Goal**: Enable periodontists to register, log in, and invite patients via magic link

**Independent Test**: Periodontist can register, log in, and send invitation to test email. Invitation email is received with functional magic link.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T033 [P] [US1] Unit test for PeriodontistRepository in src/features/authentication/repository/__tests__/periodontist.repository.test.ts
- [x] T034 [P] [US1] Unit test for PatientRepository in src/features/authentication/repository/__tests__/patient.repository.test.ts
- [x] T035 [P] [US1] Unit test for AuthService in src/features/authentication/service/__tests__/auth.service.test.ts
- [x] T036 [P] [US1] Integration test for periodontist registration flow in src/features/authentication/__tests__/integration/registration.flow.test.ts
- [x] T037 [P] [US1] Integration test for patient invitation flow in src/features/authentication/__tests__/integration/registration.flow.test.ts
- [x] T038 [P] [US1] Component test for LoginForm in src/features/authentication/components/__tests__/LoginForm.test.tsx
- [x] T039 [P] [US1] Component test for PatientInvitationForm in src/features/authentication/components/__tests__/PatientInvitationForm.test.tsx

### Implementation for User Story 1

- [x] T040 [P] [US1] Create PeriodontistRepository interface in src/features/authentication/repository/periodontist.repository.interface.ts
- [x] T041 [P] [US1] Create PeriodontistRepository implementation in src/features/authentication/repository/periodontist.repository.ts
- [x] T042 [P] [US1] Create PatientRepository interface in src/features/authentication/repository/patient.repository.interface.ts
- [x] T043 [P] [US1] Create PatientRepository implementation in src/features/authentication/repository/patient.repository.ts
- [x] T044 [US1] Create AuthService with registerPeriodontist method in src/features/authentication/service/auth.service.ts
- [x] T045 [US1] Create AuthService loginPeriodontist method in src/features/authentication/service/auth.service.ts
- [x] T046 [US1] Create AuthService sendPatientInvitation method in src/features/authentication/service/auth.service.ts
- [x] T047 [US1] Create AuthService validateMagicLink method in src/features/authentication/service/auth.service.ts
- [x] T048 [US1] Create authentication types in src/features/authentication/service/types.ts
- [x] T049 [US1] Create useAuth hook in src/features/authentication/hooks/useAuth.ts
- [x] T050 [US1] Create useMagicLink hook in src/features/authentication/hooks/useMagicLink.ts
- [x] T051 [US1] Create LoginForm component in src/features/authentication/components/LoginForm.tsx
- [x] T052 [US1] Create RegistrationForm component in src/features/authentication/components/RegistrationForm.tsx
- [x] T053 [US1] Create PatientInvitationForm component in src/features/authentication/components/PatientInvitationForm.tsx
- [x] T054 [US1] Create MagicLinkHandler component in src/features/authentication/components/MagicLinkHandler.tsx
- [x] T055 [US1] Create periodontist login page in src/app/(auth)/login.tsx
- [x] T056 [US1] Create periodontist registration page in src/app/(auth)/register.tsx
- [x] T057 [US1] Create magic link handler page in src/app/(auth)/magic-link.tsx
- [x] T058 [US1] Create basic periodontist dashboard page in src/app/(periodontist)/dashboard.tsx
- [x] T059 [US1] Add patient invitation functionality to dashboard in src/app/(periodontist)/dashboard.tsx
- [x] T060 [US1] Add error handling and validation for authentication flows
- [x] T061 [US1] Add email validation for patient invitations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Patient Initial Access and Diagnosis Display (Priority: P1)

**Goal**: Patients can access app via magic link and view their diagnosis and risk factors

**Independent Test**: Periodontist enters diagnosis/risk factors for patient. Patient accesses app via magic link and sees correct diagnosis and risk factors displayed.

### Tests for User Story 2

- [x] T062 [P] [US2] Unit test for DiagnosisRepository in src/features/follow-up/repository/__tests__/diagnosis.repository.test.ts
- [x] T063 [P] [US2] Unit test for RiskFactorRepository in src/features/follow-up/repository/__tests__/risk-factor.repository.test.ts
- [x] T064 [P] [US2] Unit test for FollowUpService in src/features/follow-up/service/__tests__/follow-up.service.test.ts
- [x] T065 [P] [US2] Integration test for patient diagnosis display flow in src/features/follow-up/__tests__/integration/diagnosis-display.test.ts
- [x] T066 [P] [US2] Component test for DiagnosisDisplay in src/features/follow-up/components/__tests__/DiagnosisDisplay.test.tsx
- [x] T067 [P] [US2] Component test for RiskFactorsDisplay in src/features/follow-up/components/__tests__/RiskFactorsDisplay.test.tsx

### Implementation for User Story 2

- [x] T068 [P] [US2] Create DiagnosisRepository interface in src/features/follow-up/repository/diagnosis.repository.interface.ts
- [x] T069 [P] [US2] Create DiagnosisRepository implementation in src/features/follow-up/repository/diagnosis.repository.ts
- [x] T070 [P] [US2] Create RiskFactorRepository interface in src/features/follow-up/repository/risk-factor.repository.interface.ts
- [x] T071 [P] [US2] Create RiskFactorRepository implementation in src/features/follow-up/repository/risk-factor.repository.ts
- [x] T072 [US2] Create FollowUpService with getDiagnosisByPatientId method in src/features/follow-up/service/follow-up.service.ts
- [x] T073 [US2] Create FollowUpService getRiskFactorsByPatientId method in src/features/follow-up/service/follow-up.service.ts
- [x] T074 [US2] Create follow-up types in src/features/follow-up/service/types.ts
- [x] T075 [US2] Create useFollowUp hook in src/features/follow-up/hooks/useFollowUp.ts
- [x] T076 [US2] Create DiagnosisDisplay component in src/features/follow-up/components/DiagnosisDisplay.tsx
- [x] T077 [US2] Create RiskFactorsDisplay component in src/features/follow-up/components/RiskFactorsDisplay.tsx
- [x] T078 [US2] Create patient initial access page in src/app/(tabs)/initial-access.tsx
- [x] T079 [US2] Display diagnosis and risk factors on initial access page
- [x] T080 [US2] Add error handling for expired/invalid magic links
- [x] T081 [US2] Add loading states for diagnosis data fetching

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Periodontist Diagnosis and Risk Factor Entry (Priority: P2)

**Goal**: Periodontists can enter and update patient diagnosis and risk factors on their dashboard

**Independent Test**: Periodontist logs in, selects patient, enters diagnosis and risk factors. Information is saved and visible to both periodontist and patient.

### Tests for User Story 3

- [x] T082 [P] [US3] Unit test for PeriodontistDashboardService in src/features/periodontist-dashboard/service/__tests__/periodontist-dashboard.service.test.ts
- [x] T083 [P] [US3] Integration test for diagnosis entry flow in src/features/periodontist-dashboard/__tests__/integration/diagnosis-entry.test.ts
- [x] T084 [P] [US3] Integration test for risk factor entry flow in src/features/periodontist-dashboard/__tests__/integration/risk-factor-entry.test.ts
- [x] T085 [P] [US3] Component test for DiagnosisForm in src/features/periodontist-dashboard/components/__tests__/DiagnosisForm.test.tsx
- [x] T086 [P] [US3] Component test for RiskFactorForm in src/features/periodontist-dashboard/components/__tests__/RiskFactorForm.test.tsx

### Implementation for User Story 3

- [x] T087 [US3] Create PeriodontistDashboardService with createOrUpdateDiagnosis method in src/features/periodontist-dashboard/service/periodontist-dashboard.service.ts
- [x] T088 [US3] Create PeriodontistDashboardService addRiskFactor method in src/features/periodontist-dashboard/service/periodontist-dashboard.service.ts
- [x] T089 [US3] Create PeriodontistDashboardService removeRiskFactor method in src/features/periodontist-dashboard/service/periodontist-dashboard.service.ts
- [x] T090 [US3] Create periodontist dashboard types in src/features/periodontist-dashboard/service/types.ts
- [x] T091 [US3] Create usePeriodontistDashboard hook in src/features/periodontist-dashboard/hooks/usePeriodontistDashboard.ts
- [x] T092 [US3] Create DiagnosisForm component in src/features/periodontist-dashboard/components/DiagnosisForm.tsx
- [x] T093 [US3] Create RiskFactorForm component in src/features/periodontist-dashboard/components/RiskFactorForm.tsx
- [x] T094 [US3] Create PatientList component in src/features/periodontist-dashboard/components/PatientList.tsx
- [x] T095 [US3] Create patient detail page in src/app/(periodontist)/patient/[id].tsx
- [x] T096 [US3] Add diagnosis entry form to patient detail page
- [x] T097 [US3] Add risk factor management to patient detail page
- [x] T098 [US3] Add validation for diagnosis (grade/stage required for periodontitis)
- [x] T099 [US3] Add validation for risk factors (tobacco use level)
- [x] T100 [US3] Update periodontist dashboard to show patient list

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Patient Onboarding Questionnaire (Priority: P2)

**Goal**: Patients complete onboarding questionnaire after initial access

**Independent Test**: Patient accesses app, views diagnosis, completes questionnaire. Data is saved and patient proceeds to home dashboard.

### Tests for User Story 4

- [x] T101 [P] [US4] Unit test for OnboardingRepository in src/features/patient-onboarding/repository/__tests__/onboarding.repository.test.ts
- [x] T102 [P] [US4] Unit test for OnboardingService in src/features/patient-onboarding/service/__tests__/onboarding.service.test.ts
- [x] T103 [P] [US4] Integration test for onboarding questionnaire flow in src/features/patient-onboarding/__tests__/integration/onboarding.test.ts
- [x] T104 [P] [US4] Component test for OnboardingQuestionnaire in src/features/patient-onboarding/components/__tests__/OnboardingQuestionnaire.test.tsx

### Implementation for User Story 4

- [x] T105 [P] [US4] Create OnboardingRepository interface in src/features/patient-onboarding/repository/onboarding.repository.interface.ts
- [x] T106 [P] [US4] Create OnboardingRepository implementation in src/features/patient-onboarding/repository/onboarding.repository.ts
- [x] T107 [US4] Create OnboardingService with submitOnboardingResponse method in src/features/patient-onboarding/service/onboarding.service.ts
- [x] T108 [US4] Create OnboardingService getOnboardingResponse method in src/features/patient-onboarding/service/onboarding.service.ts
- [x] T109 [US4] Create onboarding types in src/features/patient-onboarding/service/types.ts
- [x] T110 [US4] Create useOnboarding hook in src/features/patient-onboarding/hooks/useOnboarding.ts
- [x] T111 [US4] Create OnboardingQuestionnaire component in src/features/patient-onboarding/components/OnboardingQuestionnaire.tsx
- [x] T112 [US4] Create onboarding page in src/app/(tabs)/onboarding.tsx
- [x] T113 [US4] Add form validation for all required fields (age, diet, sleep, bruxism)
- [x] T114 [US4] Add navigation logic to skip onboarding if already completed
- [x] T115 [US4] Update patient account status after onboarding completion

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently

---

## Phase 7: User Story 5 - Daily Check-in (Priority: P2)

**Goal**: Patients can log daily symptoms and habits

**Independent Test**: Patient accesses daily check-in, enters symptoms/habits, submits. Data is saved and appears in statistics.

### Tests for User Story 5

- [x] T116 [P] [US5] Unit test for CheckInRepository in src/features/daily-check-in/repository/__tests__/check-in.repository.test.ts
- [x] T117 [P] [US5] Unit test for CheckInService in src/features/daily-check-in/service/__tests__/check-in.service.test.ts
- [x] T118 [P] [US5] Integration test for daily check-in flow in src/features/daily-check-in/__tests__/integration/check-in.test.ts
- [x] T119 [P] [US5] Integration test for offline check-in sync in src/features/daily-check-in/__tests__/integration/offline-sync.test.ts
- [x] T120 [P] [US5] Component test for DailyCheckInForm in src/features/daily-check-in/components/__tests__/DailyCheckInForm.test.tsx

### Implementation for User Story 5

- [x] T121 [P] [US5] Create CheckInRepository interface in src/features/daily-check-in/repository/check-in.repository.interface.ts
- [x] T122 [P] [US5] Create CheckInRepository implementation in src/features/daily-check-in/repository/check-in.repository.ts
- [x] T123 [US5] Create CheckInService with createOrUpdateCheckIn method in src/features/daily-check-in/service/check-in.service.ts
- [x] T124 [US5] Create CheckInService getCheckInByDate method in src/features/daily-check-in/service/check-in.service.ts
- [x] T125 [US5] Create CheckInService getCheckInsByDateRange method in src/features/daily-check-in/service/check-in.service.ts
- [x] T126 [US5] Create check-in types in src/features/daily-check-in/service/types.ts
- [x] T127 [US5] Create useCheckIn hook in src/features/daily-check-in/hooks/useCheckIn.ts
- [x] T128 [US5] Create DailyCheckInForm component in src/features/daily-check-in/components/DailyCheckInForm.tsx
- [x] T129 [US5] Create daily check-in page in src/app/(tabs)/check-in.tsx
- [x] T130 [US5] Add offline support for check-in submission (local storage + sync queue)
- [x] T131 [US5] Add validation for check-in data (bleeding/pain 0-10 scale)
- [x] T132 [US5] Add logic to prevent multiple check-ins per day (allow updates)
- [x] T133 [US5] Add timezone-aware date handling for check-ins
- [x] T134 [US5] Add check-in CTA to home dashboard in src/app/(tabs)/index.tsx

**Checkpoint**: At this point, User Stories 1, 2, 3, 4, AND 5 should all work independently

---

## Phase 8: User Story 6 - Statistics and Trends Display (Priority: P3)

**Goal**: Patients can view statistics and trends from daily check-ins

**Independent Test**: Patient completes multiple check-ins, views statistics section. Trends are displayed accurately.

### Tests for User Story 6

- [x] T135 [P] [US6] Unit test for StatisticsService in src/features/statistics/service/__tests__/statistics.service.test.ts
- [x] T136 [P] [US6] Integration test for statistics calculation in src/features/statistics/__tests__/integration/statistics.test.ts
- [x] T137 [P] [US6] Component test for StatisticsChart in src/features/statistics/components/__tests__/StatisticsChart.test.tsx
- [x] T138 [P] [US6] Component test for TrendsDisplay in src/features/statistics/components/__tests__/TrendsDisplay.test.tsx

### Implementation for User Story 6

- [x] T139 [US6] Create StatisticsService with getCheckInStatistics method in src/features/statistics/service/statistics.service.ts
- [x] T140 [US6] Create statistics types in src/features/statistics/service/types.ts
- [x] T141 [US6] Create useStatistics hook in src/features/statistics/hooks/useStatistics.ts
- [x] T142 [US6] Create StatisticsChart component in src/features/statistics/components/StatisticsChart.tsx
- [x] T143 [US6] Create TrendsDisplay component in src/features/statistics/components/TrendsDisplay.tsx
- [x] T144 [US6] Create EmptyState component for statistics in src/features/statistics/components/EmptyState.tsx
- [x] T145 [US6] Add statistics section to home dashboard in src/app/(tabs)/index.tsx
- [x] T146 [US6] Add statistics section to follow-up page in src/app/(tabs)/initial-access.tsx
- [x] T147 [US6] Implement trend calculations (bleeding, pain, mouth feeling, hygiene habits)
- [x] T148 [US6] Add date range selection for statistics
- [x] T149 [US6] Add empty state handling when no check-in data exists

**Checkpoint**: At this point, User Stories 1-6 should all work independently

---

## Phase 9: User Story 7 - Oral Hygiene Material Recommendations (Priority: P3)

**Goal**: Periodontists can specify oral hygiene recommendations and patients can view them with odontogram

**Independent Test**: Periodontist enters recommendations for patient. Patient views "My Follow-up" section and sees recommendations with odontogram.

### Tests for User Story 7

- [x] T150 [P] [US7] Unit test for RecommendationRepository in src/features/follow-up/repository/__tests__/recommendation.repository.test.ts
- [x] T151 [P] [US7] Unit test for OdontogramRepository in src/features/follow-up/repository/__tests__/odontogram.repository.test.ts
- [x] T152 [P] [US7] Integration test for recommendation entry flow in src/features/follow-up/__tests__/integration/recommendation.test.ts
- [x] T153 [P] [US7] Component test for RecommendationForm in src/features/follow-up/components/__tests__/RecommendationForm.test.tsx
- [x] T154 [P] [US7] Component test for OdontogramDisplay in src/features/follow-up/components/__tests__/OdontogramDisplay.test.tsx

### Implementation for User Story 7

- [x] T155 [P] [US7] Create RecommendationRepository interface in src/features/follow-up/repository/recommendation.repository.interface.ts
- [x] T156 [P] [US7] Create RecommendationRepository implementation in src/features/follow-up/repository/recommendation.repository.ts
- [x] T157 [P] [US7] Create OdontogramRepository interface in src/features/follow-up/repository/odontogram.repository.interface.ts
- [x] T158 [P] [US7] Create OdontogramRepository implementation in src/features/follow-up/repository/odontogram.repository.ts
- [x] T159 [US7] Create FollowUpService createOrUpdateRecommendation method in src/features/follow-up/service/follow-up.service.ts
- [x] T160 [US7] Create FollowUpService getRecommendationByPatientId method in src/features/follow-up/service/follow-up.service.ts
- [x] T161 [US7] Create follow-up recommendation types in src/features/follow-up/service/types.ts
- [x] T162 [US7] Create useRecommendation hook in src/features/follow-up/hooks/useRecommendation.ts
- [x] T163 [US7] Create RecommendationForm component in src/features/follow-up/components/RecommendationForm.tsx
- [x] T164 [US7] Create OdontogramDisplay component in src/features/follow-up/components/OdontogramDisplay.tsx
- [x] T165 [US7] Add recommendation entry to periodontist patient detail page
- [x] T166 [US7] Add recommendations display to patient follow-up page in src/app/(tabs)/initial-access.tsx
- [x] T167 [US7] Implement odontogram visualization (32 teeth, 31 interdental spaces)
- [x] T168 [US7] Add validation for odontogram data (space IDs, tool types, brush sizes)

**Checkpoint**: At this point, User Stories 1-7 should all work independently

---

## Phase 10: User Story 8 - Articles Library (Priority: P3)

**Goal**: Patients can browse educational articles from thumbnail gallery and full library

**Independent Test**: Articles are available in system. Patient browses home preview and full Articles tab. Articles are displayed and accessible.

### Tests for User Story 8

- [x] T169 [P] [US8] Unit test for ArticleRepository in src/features/articles/repository/__tests__/article.repository.test.ts
- [x] T170 [P] [US8] Unit test for ArticleService in src/features/articles/service/__tests__/article.service.test.ts
- [x] T171 [P] [US8] Integration test for article browsing flow in src/features/articles/__tests__/integration/article-browsing.test.ts
- [x] T172 [P] [US8] Component test for ArticleCard in src/features/articles/components/__tests__/ArticleCard.test.tsx
- [x] T173 [P] [US8] Component test for ArticleList in src/features/articles/components/__tests__/ArticleList.test.tsx

### Implementation for User Story 8

- [x] T174 [P] [US8] Create ArticleRepository interface in src/features/articles/repository/article.repository.interface.ts
- [x] T175 [P] [US8] Create ArticleRepository implementation in src/features/articles/repository/article.repository.ts
- [x] T176 [US8] Create ArticleService with getPublishedArticles method in src/features/articles/service/article.service.ts
- [x] T177 [US8] Create ArticleService getArticleById method in src/features/articles/service/article.service.ts
- [x] T178 [US8] Create article types in src/features/articles/service/types.ts
- [x] T179 [US8] Create useArticles hook in src/features/articles/hooks/useArticles.ts
- [x] T180 [US8] Create ArticleCard component in src/features/articles/components/ArticleCard.tsx
- [x] T181 [US8] Create ArticleList component in src/features/articles/components/ArticleList.tsx
- [x] T182 [US8] Create ArticleDetail component in src/features/articles/components/ArticleDetail.tsx
- [x] T183 [US8] Add articles thumbnail gallery to home dashboard in src/app/(tabs)/index.tsx
- [x] T184 [US8] Create articles library page in src/app/(tabs)/articles.tsx
- [x] T185 [US8] Create article detail page in src/app/(tabs)/articles/[id].tsx
- [x] T186 [US8] Add image loading optimization for article thumbnails (Expo Image)
- [x] T187 [US8] Add pagination for article list
- [ ] T188 [US8] Add article filtering by category (future enhancement)

**Checkpoint**: At this point, User Stories 1-8 should all work independently

---

## Phase 11: User Story 9 - Profile Management (Priority: P3)

**Goal**: Patients can manage profile, settings, and account

**Independent Test**: Patient accesses Profile tab, updates settings, verifies changes are saved. All profile functions work as expected.

### Tests for User Story 9

- [x] T189 [P] [US9] Unit test for ProfileService in src/features/profile/service/__tests__/profile.service.test.ts
- [x] T190 [P] [US9] Integration test for profile update flow in src/features/profile/__tests__/integration/profile-update.test.ts
- [x] T191 [P] [US9] Component test for ProfileForm in src/features/profile/components/__tests__/ProfileForm.test.tsx
- [x] T192 [P] [US9] Component test for NotificationSettings in src/features/profile/components/__tests__/NotificationSettings.test.tsx

### Implementation for User Story 9

- [x] T193 [P] [US9] Create ProfileRepository interface in src/features/profile/repository/profile.repository.interface.ts
- [x] T194 [P] [US9] Create ProfileRepository implementation in src/features/profile/repository/profile.repository.ts
- [x] T195 [US9] Create ProfileService with updateProfile method in src/features/profile/service/profile.service.ts
- [x] T196 [US9] Create ProfileService updateNotificationSettings method in src/features/profile/service/profile.service.ts
- [x] T197 [US9] Create ProfileService deleteAccount method in src/features/profile/service/profile.service.ts
- [x] T198 [US9] Create ProfileService contactSupport method in src/features/profile/service/profile.service.ts
- [x] T199 [US9] Create profile types in src/features/profile/service/types.ts
- [x] T200 [US9] Create useProfile hook in src/features/profile/hooks/useProfile.ts
- [x] T201 [US9] Create ProfileForm component in src/features/profile/components/ProfileForm.tsx
- [x] T202 [US9] Create NotificationSettings component in src/features/profile/components/NotificationSettings.tsx
- [x] T203 [US9] Create PrivacySettings component in src/features/profile/components/PrivacySettings.tsx
- [x] T204 [US9] Create AccountDeletion component in src/features/profile/components/AccountDeletion.tsx
- [x] T205 [US9] Create SupportContact component in src/features/profile/components/SupportContact.tsx
- [x] T206 [US9] Create profile page in src/app/(tabs)/profile.tsx
- [x] T207 [US9] Add account deletion confirmation flow with warnings
- [x] T208 [US9] Add support contact form submission
- [x] T209 [US9] Add privacy/confidentiality settings management

**Checkpoint**: At this point, all User Stories 1-9 should be fully functional and independently testable

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T210 [P] Add comprehensive error boundaries across all features
- [x] T211 [P] Implement loading skeletons for all data fetching operations
- [x] T212 [P] Add accessibility labels and ARIA attributes to all interactive components
- [ ] T213 [P] Optimize bundle size (code splitting, lazy loading)
- [ ] T214 [P] Add performance monitoring and analytics
- [ ] T215 [P] Implement comprehensive logging for debugging
- [x] T216 [P] Add dark mode support throughout application
- [ ] T217 [P] Add responsive design improvements for tablet/desktop
- [ ] T218 [P] Add PWA manifest and service worker for offline support
- [ ] T219 [P] Add comprehensive E2E tests for critical user flows
- [ ] T220 [P] Update documentation in README.md
- [ ] T221 [P] Run quickstart.md validation checklist
- [ ] T222 [P] Security audit and hardening
- [ ] T223 [P] Performance optimization (60 FPS, bundle size, memory usage)
- [ ] T224 [P] Code cleanup and refactoring per constitution standards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-11)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 12)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for patient creation
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for patient creation, US2 for diagnosis display
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for patient creation, US2 for initial access
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for patient creation, US4 for onboarding completion
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 for check-in data
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for patient creation
- **User Story 8 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 9 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for patient creation

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Repository interfaces before implementations
- Repositories before services
- Services before hooks
- Hooks before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Repository interfaces and implementations within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T033 [P] [US1] Unit test for PeriodontistRepository
Task: T034 [P] [US1] Unit test for PatientRepository
Task: T035 [P] [US1] Unit test for AuthService
Task: T036 [P] [US1] Integration test for periodontist registration flow
Task: T037 [P] [US1] Integration test for patient invitation flow
Task: T038 [P] [US1] Component test for LoginForm
Task: T039 [P] [US1] Component test for PatientInvitationForm

# Launch all repository interfaces together:
Task: T040 [P] [US1] Create PeriodontistRepository interface
Task: T042 [P] [US1] Create PatientRepository interface

# Launch all repository implementations together:
Task: T041 [P] [US1] Create PeriodontistRepository implementation
Task: T043 [P] [US1] Create PatientRepository implementation
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Periodontist Registration and Patient Invitation)
4. Complete Phase 4: User Story 2 (Patient Initial Access and Diagnosis Display)
5. **STOP and VALIDATE**: Test User Stories 1-2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1-2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 5 → Test independently → Deploy/Demo
6. Add User Stories 6-9 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (after US1 patient creation)
   - Developer C: User Story 8 (no dependencies)
3. After US1-2 complete:
   - Developer A: User Story 3
   - Developer B: User Story 4
   - Developer C: User Story 5
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

---

## Summary

- **Total Tasks**: 224
- **Setup Tasks**: 10 (Phase 1)
- **Foundational Tasks**: 22 (Phase 2)
- **User Story Tasks**: 180 (Phases 3-11, ~20 per story)
- **Polish Tasks**: 15 (Phase 12)

**Task Count per User Story**:
- US1: 29 tasks
- US2: 20 tasks
- US3: 19 tasks
- US4: 15 tasks
- US5: 19 tasks
- US6: 15 tasks
- US7: 19 tasks
- US8: 20 tasks
- US9: 24 tasks

**Parallel Opportunities**: 80+ tasks marked [P] can run in parallel

**Suggested MVP Scope**: User Stories 1-2 (Periodontist Registration/Invitation + Patient Initial Access)

