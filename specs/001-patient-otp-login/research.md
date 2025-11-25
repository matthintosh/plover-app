# Research: Patient OTP Login

**Feature**: Patient OTP Login  
**Date**: 2025-01-27  
**Phase**: 0 - Research

## Research Tasks

### 1. Supabase Auth OTP Implementation

**Decision**: Use Supabase Auth's built-in `signInWithOtp` method with email delivery

**Rationale**: 
- Supabase Auth already provides OTP functionality via `signInWithOtp` API
- Uses the same email infrastructure as magic links (consistent delivery)
- Handles OTP code generation, email delivery, and validation automatically
- Provides rate limiting and security features out of the box
- No need for custom OTP code storage or management

**Alternatives Considered**:
- Custom OTP implementation: Rejected due to security concerns and maintenance overhead
- Third-party OTP service (Twilio, Authy): Rejected due to cost and complexity for email-only OTP
- Database-stored OTP codes: Rejected as Supabase Auth handles this internally

**Implementation Details**:
- Use `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })` to send OTP
- Use `supabase.auth.verifyOtp({ email, token, type: 'email' })` to validate OTP codes
- Supabase handles code expiration (default 60 minutes, configurable)
- Supabase handles single-use enforcement automatically

### 2. OTP Code Format and Length

**Decision**: 6-digit numeric codes (Supabase default)

**Rationale**:
- Industry standard for email-based OTP (6 digits)
- Easy for users to enter on mobile devices
- Numeric-only reduces input errors
- Supabase Auth generates 6-digit codes by default

**Alternatives Considered**:
- Alphanumeric codes: Rejected as more error-prone for users
- 4-digit codes: Rejected as less secure
- 8-digit codes: Rejected as unnecessarily long for email OTP

### 3. OTP Expiration Time

**Decision**: 10 minutes expiration time

**Rationale**:
- Industry standard for email-based OTP codes
- Balances security (not too long) with usability (enough time to check email)
- Can be configured in Supabase Auth settings
- Matches specification requirements

**Alternatives Considered**:
- 5 minutes: Rejected as too short for users who may not check email immediately
- 15 minutes: Rejected as increases security risk window
- 60 minutes (Supabase default): Rejected as too long for security-sensitive healthcare app

**Implementation**: Configure Supabase Auth email OTP expiration to 10 minutes

### 4. Rate Limiting Strategy

**Decision**: Use Supabase Auth built-in rate limiting + application-level tracking

**Rationale**:
- Supabase Auth provides rate limiting at the infrastructure level
- Additional application-level tracking ensures 5 requests per hour per email (spec requirement)
- Prevents abuse while allowing legitimate retry attempts
- Can track in memory or lightweight database table

**Alternatives Considered**:
- Supabase-only rate limiting: Rejected as may not match exact 5/hour requirement
- Database-only tracking: Rejected as adds unnecessary complexity for temporary data
- Third-party rate limiting service: Rejected as overkill for this use case

**Implementation**:
- Use Supabase Auth rate limiting for infrastructure protection
- Track OTP requests in application memory or lightweight cache
- Reset counters after 1 hour window
- Return generic success message even if rate limited (security through obscurity)

### 5. Authentication Method Selection UI Pattern

**Decision**: Tab/Toggle selection before email input

**Rationale**:
- Clear visual distinction between methods
- Prevents confusion about which method is active
- Allows users to switch methods without losing entered email
- Follows common authentication UI patterns (similar to login/register tabs)

**Alternatives Considered**:
- Dropdown selection: Rejected as less discoverable
- Separate pages: Rejected as adds unnecessary navigation
- Radio buttons: Rejected as less visually appealing than tabs

**Implementation**:
- Use tab-style toggle similar to existing periodontist/patient mode selector
- Show method-specific instructions when method is selected
- Preserve email input when switching methods
- Use existing UI components (Button, Input) for consistency

### 6. OTP Code Input Component

**Decision**: Single input field with auto-focus and paste support

**Rationale**:
- Simpler than multi-digit input fields
- Supports copy-paste from email (common user behavior)
- Auto-focus improves mobile UX
- Easier to implement and test

**Alternatives Considered**:
- Multi-digit input (6 separate fields): Rejected as more complex and error-prone
- Masked input: Rejected as unnecessary for numeric codes
- Separate input with submit button: Rejected as adds extra step

**Implementation**:
- Use existing Input component with numeric keyboard
- Auto-focus on input field
- Support paste from clipboard
- Auto-submit when 6 digits entered (optional enhancement)
- Clear visual feedback for invalid codes

### 7. OTP Verification Flow

**Decision**: Separate page/route for OTP verification (`/(auth)/otp-verify`)

**Rationale**:
- Matches existing magic link verification pattern (`/(auth)/magic-link`)
- Allows deep linking if needed in future
- Clear separation of concerns (request vs verify)
- Can handle OTP codes from email links if needed

**Alternatives Considered**:
- Inline verification on same page: Rejected as creates complex state management
- Modal overlay: Rejected as less accessible and harder to navigate back

**Implementation**:
- Create `src/app/(auth)/otp-verify.tsx` page
- Accept email and OTP code as route params or form input
- Handle verification and redirect to dashboard on success
- Show error messages for invalid/expired codes

### 8. Integration with Existing Magic Link Flow

**Decision**: Extend existing `AuthService` with OTP methods, maintain separate flows

**Rationale**:
- Keeps authentication logic centralized
- Reuses existing patient repository and validation
- Maintains backward compatibility
- Follows single responsibility principle

**Alternatives Considered**:
- Separate OTP service: Rejected as creates unnecessary duplication
- Replace magic link with OTP: Rejected as breaks backward compatibility requirement

**Implementation**:
- Add `requestPatientOTP` method to `AuthService`
- Add `verifyPatientOTP` method to `AuthService`
- Reuse existing patient email validation
- Maintain separate UI components for each method

### 9. Error Handling and Security

**Decision**: Generic error messages, no email enumeration, secure code generation

**Rationale**:
- Prevents email enumeration attacks (security requirement)
- Generic messages don't reveal if email exists
- Supabase handles secure code generation (cryptographically secure)
- Consistent with existing magic link security approach

**Implementation**:
- Return same success message regardless of email existence
- Generic error messages for invalid/expired codes
- Log detailed errors server-side for debugging
- Rate limit prevents brute force attacks

### 10. Email Template Consistency

**Decision**: Use Supabase email templates with OTP code formatting

**Rationale**:
- Maintains brand consistency with magic link emails
- Supabase handles email delivery and formatting
- Can customize templates in Supabase dashboard
- Reduces implementation complexity

**Implementation**:
- Configure Supabase email template for OTP codes
- Include clear instructions for code entry
- Match branding and tone of magic link emails
- Include expiration time in email

## Summary

All technical decisions have been made based on:
- Supabase Auth capabilities and best practices
- Existing application architecture and patterns
- Security and privacy requirements
- User experience considerations
- Specification requirements

No unresolved technical questions remain. Ready to proceed to Phase 1 (Design & Contracts).
