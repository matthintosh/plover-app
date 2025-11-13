# Feature Specification: Plover Application

**Feature Branch**: `001-plover-app`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "App Name: Plover - Periodontal care application connecting patients and periodontists through personalized monitoring, recommendations, and treatment adjustments"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Periodontist Registration and Patient Invitation (Priority: P1)

A periodontist registers for an account, logs in, and invites a patient by email address. The system sends a magic link to the patient, enabling them to join the platform.

**Why this priority**: This is the foundational workflow that enables all other functionality. Without periodontist accounts and patient invitations, the platform cannot function.

**Independent Test**: Can be fully tested by having a periodontist register, log in, and send an invitation to a test email address. The test is successful when the invitation email is received and the magic link is functional.

**Acceptance Scenarios**:

1. **Given** a periodontist is not registered, **When** they provide registration information (email, password, professional credentials), **Then** an account is created and they can log in
2. **Given** a periodontist is logged in, **When** they enter a patient's email address and send an invitation, **Then** the patient receives an email with a magic link
3. **Given** a patient receives a magic link, **When** they click the link, **Then** they are directed to the application and can create a shortcut to the web app
4. **Given** a periodontist attempts to invite a patient with an invalid email, **Then** the system displays an error message and does not send the invitation

---

### User Story 2 - Patient Initial Access and Diagnosis Display (Priority: P1)

A patient accesses the application via magic link for the first time and sees their diagnosis and risk factors as entered by their periodontist.

**Why this priority**: Patients need to understand their condition before they can engage with monitoring and care recommendations. This establishes trust and context.

**Independent Test**: Can be fully tested by having a periodontist enter diagnosis and risk factors for a patient, then having the patient access the app via magic link. The test is successful when the patient sees their diagnosis and risk factors correctly displayed.

**Acceptance Scenarios**:

1. **Given** a patient clicks a valid magic link, **When** they access the application for the first time, **Then** they see their diagnosis (gingivitis or periodontitis with grade and stage) and risk factors
2. **Given** a patient accesses the app, **When** they view their diagnosis, **Then** the information matches what their periodontist entered
3. **Given** a patient clicks an expired or invalid magic link, **Then** they see an appropriate error message with instructions to request a new invitation

---

### User Story 3 - Periodontist Diagnosis and Risk Factor Entry (Priority: P2)

A periodontist enters or updates a patient's diagnosis (gingivitis or periodontitis with grade and stage) and specifies risk factors on their minimalist dashboard.

**Why this priority**: Accurate diagnosis and risk factor documentation is essential for personalized care recommendations and monitoring. This enables the periodontist to provide proper guidance.

**Independent Test**: Can be fully tested by having a periodontist log in, select a patient, and enter diagnosis information and risk factors. The test is successful when the information is saved and visible to both the periodontist and the patient.

**Acceptance Scenarios**:

1. **Given** a periodontist is logged in and viewing a patient, **When** they enter diagnosis (gingivitis or periodontitis with grade and stage), **Then** the diagnosis is saved and associated with the patient
2. **Given** a periodontist is entering risk factors, **When** they select from available options (Diabetes, Tobacco use level, Cardiovascular disease, Cancer with hormonotherapy), **Then** the selected risk factors are saved
3. **Given** a periodontist updates existing diagnosis or risk factors, **When** they save changes, **Then** the patient's information is updated and the patient can see the changes
4. **Given** a periodontist attempts to save incomplete diagnosis information, **Then** the system prompts for required fields (diagnosis type, and if periodontitis, grade and stage)

---

### User Story 4 - Patient Onboarding Questionnaire (Priority: P2)

A patient completes an onboarding questionnaire covering age, diet, sleep, and bruxism/clenching signs after their initial access.

**Why this priority**: This information provides context for personalized recommendations and helps periodontists understand patient lifestyle factors that may affect treatment.

**Independent Test**: Can be fully tested by having a patient access the app, complete the onboarding questionnaire, and submit it. The test is successful when the information is saved and the patient can proceed to the main dashboard.

**Acceptance Scenarios**:

1. **Given** a patient has accessed the app for the first time and viewed their diagnosis, **When** they proceed to onboarding, **Then** they see a questionnaire form with fields for age, diet, sleep, and bruxism/clenching signs
2. **Given** a patient is completing the questionnaire, **When** they submit all required information, **Then** the data is saved and they are directed to the home dashboard
3. **Given** a patient attempts to submit incomplete questionnaire, **When** required fields are missing, **Then** the system highlights missing fields and prevents submission
4. **Given** a patient has completed onboarding, **When** they access the app again, **Then** they are taken directly to the home dashboard without seeing the questionnaire

---

### User Story 5 - Daily Check-in (Priority: P2)

A patient logs daily symptoms and habits including bleeding, pain, overall mouth feeling, and use of interdental brushes or floss.

**Why this priority**: Daily monitoring enables tracking of treatment progress and early identification of issues. This is core to the application's value proposition.

**Independent Test**: Can be fully tested by having a patient access the daily check-in, enter symptoms and habits, and submit. The test is successful when the check-in is saved and appears in statistics.

**Acceptance Scenarios**:

1. **Given** a patient is on the home dashboard, **When** they tap the daily check-in CTA, **Then** they see a form to log bleeding, pain, overall mouth feeling, and interdental brush/floss usage
2. **Given** a patient completes the daily check-in, **When** they submit the form, **Then** the data is saved with a timestamp and they see a confirmation
3. **Given** a patient has already completed a check-in for today, **When** they access the check-in, **Then** they can view or update their existing entry
4. **Given** a patient submits a check-in, **When** they view statistics, **Then** the new data point appears in trends

---

### User Story 6 - Statistics and Trends Display (Priority: P3)

A patient views statistics and trends from their daily check-ins displayed on the home dashboard and in the "My Follow-up" section.

**Why this priority**: Visualizing progress helps patients understand their treatment effectiveness and stay motivated. This enhances engagement but is not critical for basic functionality.

**Independent Test**: Can be fully tested by having a patient complete multiple daily check-ins over time, then viewing the statistics section. The test is successful when trends are displayed accurately.

**Acceptance Scenarios**:

1. **Given** a patient has completed multiple daily check-ins, **When** they view the statistics section on home, **Then** they see data visualizations showing trends over time
2. **Given** a patient views statistics, **When** they examine the data, **Then** they can see patterns in bleeding, pain, mouth feeling, and hygiene habits
3. **Given** a patient has no check-in history, **When** they view statistics, **Then** they see an appropriate empty state message encouraging them to start logging
4. **Given** a patient views "My Follow-up" section, **When** they scroll to statistics, **Then** they see the same trend data with additional context

---

### User Story 7 - Oral Hygiene Material Recommendations (Priority: P3)

A periodontist specifies oral hygiene material recommendations (toothbrush type, interdental brush sizes) and patients can view these recommendations including an odontogram showing advised tools for each interdental space.

**Why this priority**: Personalized recommendations improve treatment outcomes, but the core monitoring functionality can work without detailed material specifications initially.

**Independent Test**: Can be fully tested by having a periodontist enter material recommendations for a patient, then having the patient view "My Follow-up" section. The test is successful when recommendations are displayed correctly with the odontogram.

**Acceptance Scenarios**:

1. **Given** a periodontist is managing a patient, **When** they enter oral hygiene material recommendations (toothbrush type, interdental brush sizes), **Then** the recommendations are saved
2. **Given** a periodontist updates material recommendations, **When** they save changes, **Then** the patient's recommendations are updated
3. **Given** a patient views "My Follow-up" section, **When** they scroll to oral hygiene materials, **Then** they see an odontogram showing advised interdental brushes for each space (or floss if needed), brand used, and toothbrush model
4. **Given** a patient views recommendations, **When** they see the odontogram, **Then** each interdental space is clearly marked with the appropriate tool

---

### User Story 8 - Articles Library (Priority: P3)

A patient browses educational and preventive oral health articles from a thumbnail gallery on the home dashboard and a full library in the Articles tab.

**Why this priority**: Educational content supports patient engagement and self-care, but is supplementary to core monitoring functionality.

**Independent Test**: Can be fully tested by having articles available in the system, then having a patient browse the home preview and full Articles tab. The test is successful when articles are displayed and accessible.

**Acceptance Scenarios**:

1. **Given** articles are available in the system, **When** a patient views the home dashboard, **Then** they see a thumbnail gallery of articles in the Articles section
2. **Given** a patient taps an article thumbnail, **When** they view the article, **Then** the full article content is displayed
3. **Given** a patient navigates to the Articles tab, **When** they view the library, **Then** they see all available articles in an organized layout
4. **Given** a patient searches or filters articles, **When** they apply filters, **Then** relevant articles are displayed

---

### User Story 9 - Profile Management (Priority: P3)

A patient manages their profile including basic information, notification settings, privacy/confidentiality options, account deletion, and support contact.

**Why this priority**: Profile management is important for user control and compliance, but does not affect core monitoring functionality.

**Independent Test**: Can be fully tested by having a patient access the Profile tab, update settings, and verify changes are saved. The test is successful when all profile functions work as expected.

**Acceptance Scenarios**:

1. **Given** a patient is on the Profile tab, **When** they view their profile, **Then** they see basic profile information, notification settings, privacy options, delete account, and contact support
2. **Given** a patient updates notification settings, **When** they save changes, **Then** their preferences are saved and applied
3. **Given** a patient requests account deletion, **When** they confirm the action, **Then** they see a warning about data loss and can proceed with deletion
4. **Given** a patient contacts support, **When** they submit a support request, **Then** the request is sent and they receive confirmation

---

### Edge Cases

- What happens when a periodontist invites a patient with an email that is already registered?
- How does the system handle expired magic links (standard expiration: 48 hours)?
- What happens when a patient tries to complete daily check-in multiple times in the same day?
- How does the system handle periodontist account deletion when they have active patients?
- What happens when a patient's periodontist account is deleted or deactivated?
- How does the system handle invalid or malformed diagnosis data?
- What happens when network connectivity is lost during check-in submission?
- How does the system handle concurrent updates to patient data by periodontist and patient?
- What happens when a patient attempts to access the app before their periodontist has entered diagnosis information?

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Access

- **FR-001**: System MUST allow periodontists to register accounts with email, password, and professional credentials
- **FR-002**: System MUST allow periodontists to log in with email and password
- **FR-003**: System MUST allow periodontists to invite patients by email address
- **FR-004**: System MUST send magic link emails to invited patients
- **FR-005**: System MUST validate magic links and allow one-time access for account setup
- **FR-006**: System MUST allow patients to create shortcuts to the web app after initial access
- **FR-007**: System MUST expire magic links after 48 hours of inactivity
- **FR-008**: System MUST prevent access with expired or invalid magic links

#### Periodontist Dashboard

- **FR-009**: System MUST provide a minimalist dashboard for periodontists
- **FR-010**: System MUST allow periodontists to enter patient diagnosis (gingivitis or periodontitis)
- **FR-011**: System MUST require grade and stage when diagnosis is periodontitis
- **FR-012**: System MUST allow periodontists to specify risk factors: Diabetes, Tobacco use (below/above 10 cigarettes/day), Cardiovascular disease, Cancer with hormonotherapy
- **FR-013**: System MUST allow periodontists to update diagnosis and risk factors
- **FR-014**: System MUST allow periodontists to enter oral hygiene material recommendations (toothbrush type, interdental brush sizes)
- **FR-015**: System MUST allow periodontists to update oral hygiene material recommendations
- **FR-016**: System MUST display all patients associated with a periodontist on their dashboard

#### Patient Onboarding

- **FR-017**: System MUST display patient diagnosis and risk factors upon first access
- **FR-018**: System MUST present an onboarding questionnaire after initial diagnosis display
- **FR-019**: System MUST collect patient age in the onboarding questionnaire
- **FR-020**: System MUST collect patient diet information in the onboarding questionnaire
- **FR-021**: System MUST collect patient sleep information in the onboarding questionnaire
- **FR-022**: System MUST collect bruxism/clenching signs in the onboarding questionnaire
- **FR-023**: System MUST require all onboarding questionnaire fields before allowing submission
- **FR-024**: System MUST prevent patients from seeing the onboarding questionnaire after completion

#### Daily Check-in

- **FR-025**: System MUST provide a daily check-in interface accessible from the home dashboard
- **FR-026**: System MUST allow patients to log bleeding symptoms
- **FR-027**: System MUST allow patients to log pain levels
- **FR-028**: System MUST allow patients to log overall mouth feeling
- **FR-029**: System MUST allow patients to log use of interdental brushes or floss
- **FR-030**: System MUST timestamp all daily check-in entries
- **FR-031**: System MUST allow patients to view or update their check-in for the current day
- **FR-032**: System MUST prevent multiple check-ins for the same calendar day (allow updates instead)

#### Statistics & Trends

- **FR-033**: System MUST display statistics and trends from daily check-ins on the home dashboard
- **FR-034**: System MUST display statistics and trends in the "My Follow-up" section
- **FR-035**: System MUST visualize trends over time for bleeding, pain, mouth feeling, and hygiene habits
- **FR-036**: System MUST display appropriate empty states when no check-in data exists

#### Articles

- **FR-037**: System MUST display a thumbnail gallery of articles on the home dashboard
- **FR-038**: System MUST provide a full Articles tab with complete article library
- **FR-039**: System MUST allow patients to view full article content when tapping thumbnails
- **FR-040**: System MUST organize articles for easy browsing

#### Follow-up Information

- **FR-041**: System MUST display patient diagnosis in "My Follow-up" section
- **FR-042**: System MUST display patient risk factors in "My Follow-up" section
- **FR-043**: System MUST display daily check-in statistics in "My Follow-up" section
- **FR-044**: System MUST display oral hygiene materials with odontogram in "My Follow-up" section
- **FR-045**: System MUST show advised interdental brushes for each interdental space on the odontogram
- **FR-046**: System MUST indicate when floss is needed instead of interdental brushes on the odontogram
- **FR-047**: System MUST display brand and model information for recommended tools

#### Profile Management

- **FR-048**: System MUST allow patients to view and edit basic profile information
- **FR-049**: System MUST allow patients to configure notification settings
- **FR-050**: System MUST allow patients to configure privacy/confidentiality options
- **FR-051**: System MUST allow patients to delete their account with appropriate warnings
- **FR-052**: System MUST provide a contact support function in the profile section

#### Navigation

- **FR-053**: System MUST provide a fixed bottom navigation bar with four tabs: Home, Articles, My Follow-up, Profile
- **FR-054**: System MUST maintain navigation state across app sections
- **FR-055**: System MUST ensure all key actions are accessible within 2 taps from any screen

#### Design & User Experience

- **FR-056**: System MUST be mobile-first and responsive
- **FR-057**: System MUST use a minimalist, calm, reassuring visual style (wellness-oriented)
- **FR-058**: System MUST support light and dark modes
- **FR-059**: System MUST ensure secure data handling between patients and practitioners
- **FR-060**: System MUST maintain data privacy and confidentiality per healthcare standards

### Key Entities *(include if feature involves data)*

- **Periodontist**: Represents a healthcare provider using the platform. Key attributes: email, password hash, professional credentials, registration date, account status. Relationships: has many Patients.

- **Patient**: Represents an end user receiving periodontal care. Key attributes: email, magic link token, diagnosis, risk factors, onboarding completion status, profile information. Relationships: belongs to one Periodontist, has many DailyCheckIns.

- **Diagnosis**: Represents a patient's periodontal condition. Key attributes: type (gingivitis or periodontitis), grade (if periodontitis), stage (if periodontitis), date entered, last updated. Relationships: belongs to one Patient.

- **RiskFactor**: Represents factors that may affect periodontal health. Key attributes: type (Diabetes, Tobacco use level, Cardiovascular disease, Cancer with hormonotherapy), details (e.g., tobacco use below/above 10 cigarettes/day). Relationships: belongs to one Patient.

- **DailyCheckIn**: Represents a patient's daily symptom and habit log. Key attributes: date, bleeding level, pain level, overall mouth feeling, interdental brush usage, floss usage, timestamp. Relationships: belongs to one Patient.

- **OnboardingResponse**: Represents a patient's onboarding questionnaire answers. Key attributes: age, diet information, sleep information, bruxism/clenching signs, completion date. Relationships: belongs to one Patient.

- **OralHygieneRecommendation**: Represents periodontist-prescribed oral hygiene materials. Key attributes: toothbrush type, toothbrush brand, toothbrush model, interdental brush sizes per space, floss requirements per space. Relationships: belongs to one Patient.

- **Article**: Represents educational content. Key attributes: title, thumbnail, content, category, publication date. Relationships: available to all Patients.

- **Odontogram**: Represents a visual diagram of the mouth showing recommended tools per interdental space. Key attributes: space identifiers, recommended tool per space (interdental brush size or floss), visual representation. Relationships: belongs to one Patient's OralHygieneRecommendation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Periodontists can complete registration and send their first patient invitation within 5 minutes
- **SC-002**: Patients can access the application via magic link and view their diagnosis within 30 seconds of clicking the link
- **SC-003**: Patients can complete the onboarding questionnaire in under 3 minutes
- **SC-004**: Patients can complete a daily check-in in under 1 minute
- **SC-005**: Periodontists can enter or update a patient's diagnosis and risk factors in under 2 minutes
- **SC-006**: All key actions (daily check-in, viewing statistics, accessing articles) are accessible within 2 taps from the home screen
- **SC-007**: System maintains 99.9% uptime during business hours (8 AM - 8 PM local time)
- **SC-008**: Magic link emails are delivered within 30 seconds of periodontist sending invitation
- **SC-009**: Daily check-in data is saved and visible in statistics within 5 seconds of submission
- **SC-010**: 90% of patients successfully complete onboarding on their first attempt
- **SC-011**: System supports up to 1,000 concurrent users without performance degradation
- **SC-012**: All patient data is encrypted in transit and at rest per healthcare data protection standards
- **SC-013**: Application loads and becomes interactive within 3 seconds on average mobile devices
- **SC-014**: Statistics and trends render and display within 2 seconds for patients with 30+ days of check-in history

## Assumptions

- Periodontists self-register without requiring external verification (verification can be added in future iterations)
- One-to-one relationship between periodontist and patient (one patient belongs to one periodontist; multi-provider support can be added later)
- Articles are pre-loaded content managed by administrators (content management system can be added later)
- Magic links expire after 48 hours of being sent (industry standard for healthcare applications)
- Patient data is retained according to healthcare data retention requirements (typically 7+ years, but specific policy to be determined)
- The application primarily targets mobile web browsers with progressive web app (PWA) capabilities
- Supabase provides authentication, database, and real-time capabilities as the backend infrastructure
- All communications between patients and periodontists occur through the platform (no direct messaging required initially)
- Diagnosis and risk factor information is entered by periodontists and displayed to patients (patients cannot self-diagnose)
- The odontogram displays standard adult dentition (32 teeth) with standard interdental space numbering

## Dependencies

- Supabase backend infrastructure for authentication, database, and real-time features
- Email service for sending magic link invitations (via Supabase or integrated service)
- Secure data storage compliant with healthcare data protection regulations (HIPAA considerations if applicable)
- Mobile-responsive web framework for cross-platform compatibility
- Image storage for article thumbnails and odontogram visualizations

## Constraints

- Must comply with healthcare data privacy and security regulations
- Must be accessible on mobile devices (primary target) and desktop browsers
- Must maintain data integrity and prevent unauthorized access to patient information
- Must ensure periodontist-patient relationships are properly established before data sharing
- Must support offline capability for daily check-ins (data sync when connection restored)
- Must handle timezone differences for accurate daily check-in date tracking
