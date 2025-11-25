# Feature Specification: Patient OTP Login

**Feature Branch**: `001-patient-otp-login`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "A patient is able to log in with OTP. He has the choice between magic link or OTP."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Patient Chooses Authentication Method (Priority: P1)

A patient arrives at the login screen and selects their preferred authentication method (magic link or OTP) before entering their email address.

**Why this priority**: This is the foundational user experience that enables the choice between authentication methods. Without clear method selection, patients cannot access the OTP option.

**Independent Test**: Can be fully tested by navigating to the patient login screen and verifying that both authentication method options (magic link and OTP) are clearly presented and selectable. The test is successful when patients can choose between methods before entering their email.

**Acceptance Scenarios**:

1. **Given** a patient is on the login screen, **When** they select patient mode, **Then** they see options to choose between magic link or OTP authentication
2. **Given** a patient is choosing authentication method, **When** they select OTP, **Then** they see an email input field and instructions to receive a code
3. **Given** a patient is choosing authentication method, **When** they select magic link, **Then** they see an email input field and instructions to receive a link
4. **Given** a patient has selected an authentication method, **When** they change their mind, **Then** they can switch to the other method without losing their entered email address

---

### User Story 2 - Patient Logs In with OTP (Priority: P1)

A patient chooses OTP authentication, enters their email address, receives a one-time password code, and successfully logs in by entering the code.

**Why this priority**: This is the core functionality that enables OTP-based authentication. Without this, patients cannot use the OTP option even if they select it.

**Independent Test**: Can be fully tested by having a patient select OTP authentication, enter their registered email, receive an OTP code, and enter it to log in. The test is successful when the patient is authenticated and directed to their dashboard.

**Acceptance Scenarios**:

1. **Given** a patient has selected OTP authentication, **When** they enter their registered email address and request an OTP, **Then** they receive an OTP code via email
2. **Given** a patient has received an OTP code, **When** they enter the correct code within the validity period, **Then** they are authenticated and directed to their dashboard
3. **Given** a patient enters an incorrect OTP code, **When** they submit it, **Then** they see an error message and can try again
4. **Given** a patient's OTP code has expired, **When** they attempt to use it, **Then** they see an expiration message and can request a new code
5. **Given** a patient requests an OTP, **When** they receive the code, **Then** the code is single-use and cannot be reused after successful authentication

---

### User Story 3 - Patient Continues Using Magic Link (Priority: P1)

A patient chooses magic link authentication and successfully logs in using the existing magic link flow, ensuring backward compatibility.

**Why this priority**: This ensures existing functionality continues to work and patients who prefer magic links are not disrupted. This maintains feature parity and user choice.

**Independent Test**: Can be fully tested by having a patient select magic link authentication, enter their email, receive a magic link email, and click the link to authenticate. The test is successful when the patient is authenticated using the magic link method.

**Acceptance Scenarios**:

1. **Given** a patient has selected magic link authentication, **When** they enter their registered email address and request a magic link, **Then** they receive an email with a magic link
2. **Given** a patient receives a magic link email, **When** they click the link, **Then** they are authenticated and directed to their dashboard
3. **Given** a patient uses magic link authentication, **When** they complete the flow, **Then** it works identically to the existing magic link implementation

---

### Edge Cases

- What happens when a patient requests multiple OTP codes in quick succession?
- How does the system handle OTP codes that are requested but never used?
- What happens if a patient enters an OTP code after it has expired?
- How does the system prevent OTP code brute force attacks?
- What happens when a patient enters an email that is not registered as a patient?
- How does the system handle OTP delivery failures (email not sent)?
- What happens if a patient switches between OTP and magic link methods multiple times?
- How does the system handle concurrent OTP requests from the same email address?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow patients to choose between magic link or OTP authentication methods before entering their email
- **FR-002**: System MUST send OTP codes via email to patients who request OTP authentication
- **FR-003**: System MUST validate OTP codes entered by patients before granting access
- **FR-004**: System MUST expire OTP codes after a specified time period (default: 10 minutes)
- **FR-005**: System MUST invalidate OTP codes after successful use (single-use only)
- **FR-006**: System MUST limit the number of OTP requests per email address within a time window to prevent abuse
- **FR-007**: System MUST display clear error messages when OTP codes are incorrect, expired, or invalid
- **FR-008**: System MUST allow patients to request a new OTP code if the previous one expires or is lost
- **FR-009**: System MUST only send OTP codes to email addresses registered as patients (no account creation)
- **FR-010**: System MUST maintain the existing magic link authentication flow without modification
- **FR-011**: System MUST allow patients to switch between authentication methods without losing entered email address
- **FR-012**: System MUST provide clear instructions to patients about how to use each authentication method
- **FR-013**: System MUST handle OTP code format consistently (numeric codes, typically 6 digits)
- **FR-014**: System MUST prevent authentication if an OTP code is used more than once
- **FR-015**: System MUST not reveal whether an email address is registered when OTP request fails (security through obscurity)

### Key Entities *(include if feature involves data)*

- **OTP Code**: Represents a one-time password code sent to a patient's email. Key attributes: code value, email address, expiration timestamp, used status, creation timestamp. Relationships: associated with a patient email address, single-use constraint.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Patients can successfully authenticate using OTP codes within 2 minutes of requesting the code
- **SC-002**: 95% of OTP codes are successfully delivered to patient email addresses within 30 seconds
- **SC-003**: Patients can complete OTP authentication flow in under 3 minutes from email entry to successful login
- **SC-004**: OTP authentication success rate matches or exceeds magic link authentication success rate (baseline: 90%+)
- **SC-005**: System prevents OTP abuse by limiting requests to 5 per email address per hour
- **SC-006**: Patients can switch between authentication methods without confusion or errors
- **SC-007**: Invalid or expired OTP codes are rejected within 1 second of submission
- **SC-008**: Patient satisfaction with authentication choice remains high (no decrease from baseline)

## Assumptions

- OTP codes will be 6-digit numeric codes (industry standard)
- OTP codes expire after 10 minutes (industry standard for email-based OTP)
- Rate limiting will allow up to 5 OTP requests per email address per hour
- OTP codes are sent via email using the same email service as magic links
- Patients prefer having choice between authentication methods
- Existing magic link functionality will remain unchanged
- OTP codes are case-insensitive if alphanumeric (though numeric is preferred)
- The system will use the same email templates and branding as magic links
- OTP authentication will use the same session management as magic link authentication
- Patients will have access to their email when requesting OTP codes

## Dependencies

- Existing patient authentication infrastructure (magic link system)
- Email delivery service (must support OTP code delivery)
- Patient email registration system (to verify patient exists before sending OTP)
- Session management system (to create authenticated sessions after OTP validation)

## Out of Scope

- SMS-based OTP delivery (email only)
- OTP authentication for periodontists (only for patients)
- Two-factor authentication (OTP is the primary authentication method, not secondary)
- Biometric authentication options
- Social login integration
- Password-based authentication for patients
- OTP code generation algorithms (implementation detail)
- Email template customization (assumes standard templates)
