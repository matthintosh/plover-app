# Feature Specification: Patient Diagnostic View

**Feature Branch**: `001-patient-diagnostic-view`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "The patient must be able to consult their diagnostic and their risk factors and recommendation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Diagnosis Information (Priority: P1)

A patient accesses their diagnosis information (gingivitis or periodontitis with grade and stage) that was entered by their periodontist.

**Why this priority**: Understanding their diagnosis is fundamental for patients to comprehend their condition and engage with their treatment plan. This is the primary medical information patients need to see.

**Independent Test**: Can be fully tested by having a periodontist enter a diagnosis for a patient, then having the patient log in and navigate to view their diagnosis. The test is successful when the patient sees their diagnosis type, and if periodontitis, the grade and stage correctly displayed.

**Acceptance Scenarios**:

1. **Given** a patient is logged in, **When** they navigate to view their diagnosis, **Then** they see their diagnosis type (gingivitis or periodontitis) displayed clearly
2. **Given** a patient has a periodontitis diagnosis, **When** they view their diagnosis, **Then** they see both the grade (1-4) and stage (1-4) displayed alongside the diagnosis type
3. **Given** a patient has a gingivitis diagnosis, **When** they view their diagnosis, **Then** they see only the diagnosis type without grade or stage
4. **Given** a patient has no diagnosis entered yet, **When** they view their diagnosis, **Then** they see an appropriate message indicating no diagnosis is available
5. **Given** a patient views their diagnosis, **When** the information was updated by their periodontist, **Then** they see the most recent version of their diagnosis

---

### User Story 2 - View Risk Factors (Priority: P1)

A patient views all risk factors associated with their periodontal health that were documented by their periodontist.

**Why this priority**: Risk factors are critical information that patients need to understand as they affect treatment outcomes and care recommendations. This information helps patients understand their overall health context.

**Independent Test**: Can be fully tested by having a periodontist enter multiple risk factors for a patient, then having the patient log in and view their risk factors. The test is successful when all risk factors are displayed correctly with their details.

**Acceptance Scenarios**:

1. **Given** a patient is logged in, **When** they navigate to view their risk factors, **Then** they see a list of all risk factors associated with their account
2. **Given** a patient has risk factors entered, **When** they view the list, **Then** each risk factor displays its type (diabetes, tobacco use, cardiovascular disease, or cancer with hormonotherapy) and any associated details
3. **Given** a patient has tobacco use as a risk factor, **When** they view it, **Then** they see the tobacco use level or details if documented
4. **Given** a patient has no risk factors entered, **When** they view their risk factors, **Then** they see an appropriate message indicating no risk factors are documented
5. **Given** a periodontist adds or updates risk factors, **When** the patient views their risk factors, **Then** they see the updated information

---

### User Story 3 - View Oral Hygiene Recommendations (Priority: P2)

A patient views oral hygiene material recommendations (toothbrush type, brand, model) prescribed by their periodontist.

**Why this priority**: Recommendations help patients follow their treatment plan correctly by knowing which products to use. While important, this is secondary to understanding their diagnosis and risk factors.

**Independent Test**: Can be fully tested by having a periodontist enter oral hygiene recommendations for a patient, then having the patient log in and view their recommendations. The test is successful when the patient sees the recommended toothbrush type, brand, and model correctly displayed.

**Acceptance Scenarios**:

1. **Given** a patient is logged in, **When** they navigate to view their recommendations, **Then** they see oral hygiene recommendations including toothbrush type, brand, and model if available
2. **Given** a patient has recommendations entered, **When** they view them, **Then** all available recommendation fields (type, brand, model) are displayed clearly
3. **Given** a patient has no recommendations entered, **When** they view their recommendations, **Then** they see an appropriate message indicating no recommendations are available
4. **Given** a periodontist updates recommendations, **When** the patient views their recommendations, **Then** they see the updated information

---

### User Story 4 - Comprehensive Medical Information View (Priority: P2)

A patient views all their medical information (diagnosis, risk factors, and recommendations) together in a unified view for easy reference.

**Why this priority**: Having all information in one place improves patient understanding and makes it easier to reference their complete medical context. This enhances the user experience but is not critical for basic functionality.

**Independent Test**: Can be fully tested by having a periodontist enter diagnosis, risk factors, and recommendations for a patient, then having the patient view a comprehensive medical information page. The test is successful when all three types of information are displayed together in an organized, easy-to-read format.

**Acceptance Scenarios**:

1. **Given** a patient is logged in, **When** they navigate to a comprehensive medical information view, **Then** they see their diagnosis, risk factors, and recommendations all displayed on the same page
2. **Given** a patient views the comprehensive view, **When** they have all three types of information, **Then** each section is clearly labeled and organized
3. **Given** a patient views the comprehensive view, **When** some information is missing, **Then** only available sections are displayed with appropriate messaging for missing sections
4. **Given** a patient views the comprehensive view, **When** information is updated by their periodontist, **Then** the view reflects the most recent updates

---

### Edge Cases

- What happens when a patient views their information but their periodontist has not entered any data yet?
- How does the system handle displaying information when a patient's diagnosis changes from gingivitis to periodontitis?
- What happens when a risk factor is removed by the periodontist - does the patient see historical information or only current?
- How does the system handle displaying recommendations when only partial information is available (e.g., only brand but no model)?
- What happens when a patient tries to view their information while offline?
- How does the system handle displaying information when there are multiple updates from the periodontist in quick succession?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow patients to view their diagnosis (gingivitis or periodontitis) when logged in
- **FR-002**: System MUST display grade and stage for periodontitis diagnoses (1-4 for each)
- **FR-003**: System MUST display only diagnosis type for gingivitis (without grade or stage)
- **FR-004**: System MUST allow patients to view all risk factors associated with their account
- **FR-005**: System MUST display risk factor types (diabetes, tobacco use, cardiovascular disease, cancer with hormonotherapy) and associated details
- **FR-006**: System MUST allow patients to view oral hygiene recommendations (toothbrush type, brand, model)
- **FR-007**: System MUST display appropriate messaging when diagnosis, risk factors, or recommendations are not available
- **FR-008**: System MUST show the most recent version of information when updates are made by the periodontist
- **FR-009**: System MUST ensure patients can only view their own medical information (not other patients' data)
- **FR-010**: System MUST display information in a clear, readable format suitable for non-medical users
- **FR-011**: System MUST allow patients to view diagnosis, risk factors, and recommendations together in a unified view
- **FR-012**: System MUST handle cases where only partial recommendation information is available (e.g., brand but no model)

### Key Entities *(include if feature involves data)*

- **Diagnosis**: Represents a patient's periodontal condition. Key attributes: type (gingivitis or periodontitis), grade (1-4, required for periodontitis), stage (1-4, required for periodontitis), entered date, updated date. One diagnosis per patient.
- **Risk Factor**: Represents factors affecting periodontal health. Key attributes: type (diabetes, tobacco use, cardiovascular disease, cancer with hormonotherapy), details (JSONB for additional information like tobacco use level), entered date, updated date. Multiple risk factors per patient, one per type.
- **Oral Hygiene Recommendation**: Represents periodontist-prescribed oral hygiene materials. Key attributes: toothbrush type, toothbrush brand, toothbrush model, entered date, updated date. One recommendation set per patient.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Patients can view their complete diagnosis information (type, grade, stage when applicable) within 2 seconds of navigating to the diagnosis view
- **SC-002**: Patients can view all their risk factors within 2 seconds of navigating to the risk factors view
- **SC-003**: Patients can view their oral hygiene recommendations within 2 seconds of navigating to the recommendations view
- **SC-004**: 95% of patients successfully locate and view their diagnosis, risk factors, and recommendations on their first attempt
- **SC-005**: Patients can view a comprehensive medical information page containing all three information types (diagnosis, risk factors, recommendations) within 3 seconds
- **SC-006**: System displays appropriate messaging for missing information in 100% of cases where data is not available
- **SC-007**: Patients can only access their own medical information (zero unauthorized access incidents)
- **SC-008**: Information displayed to patients matches what periodontists entered with 100% accuracy

## Assumptions

- Patients are already authenticated and have access to the application through their patient account
- Diagnosis, risk factors, and recommendations are entered by periodontists through a separate interface (not part of this feature)
- Patients have read-only access to this information (they cannot edit diagnosis, risk factors, or recommendations)
- Information is stored in a database with proper relationships between patients and their medical data
- The application supports displaying information in a mobile-friendly format
- Patients may view this information multiple times and need consistent, up-to-date information
- Historical information display (showing past diagnoses or removed risk factors) is not required for this feature - only current information is displayed

## Dependencies

- Patient authentication system must be in place
- Database tables for diagnosis, risk factors, and oral hygiene recommendations must exist
- Periodontist interface for entering patient information must exist (or be developed separately)
- Row-level security policies must ensure patients can only view their own data
