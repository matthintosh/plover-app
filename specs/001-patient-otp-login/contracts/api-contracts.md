# API Contracts: Patient OTP Login

**Feature**: Patient OTP Login  
**Date**: 2025-01-27  
**Phase**: 1 - Design

## Overview

This document defines the service layer interfaces and data contracts for the Patient OTP Login feature. These contracts define the API between the UI layer (components/hooks) and the business logic layer (services).

## Service Contracts

### AuthService Extensions

The existing `AuthService` class will be extended with OTP-related methods. These methods integrate with Supabase Auth for OTP code generation, delivery, and validation.

#### `authService.requestPatientOTP(email: string): Promise<RequestPatientOTPResult>`

**Purpose**: Request an OTP code to be sent to a patient's email address.

**Input**:
```typescript
interface RequestPatientOTPInput {
  email: string; // Patient email address (must be registered)
}
```

**Output**:
```typescript
interface RequestPatientOTPResult {
  success: boolean;
  message: string; // Generic success message (doesn't reveal if email exists)
}
```

**Behavior**:
- Validates that email belongs to a registered patient
- Checks rate limiting (5 requests per hour per email)
- Calls Supabase Auth to generate and send OTP code
- Returns generic success message regardless of email existence (security)
- Throws error if rate limit exceeded or other failure

**Error Cases**:
- Rate limit exceeded: Generic error message
- Email not registered: Returns success (doesn't reveal non-existence)
- Supabase error: Generic error message
- Network error: Generic error message

**Example**:
```typescript
const result = await authService.requestPatientOTP({ email: 'patient@example.com' });
// Returns: { success: true, message: 'If this email is registered, you will receive an OTP code shortly.' }
```

---

#### `authService.verifyPatientOTP(email: string, code: string): Promise<VerifyPatientOTPResult>`

**Purpose**: Verify an OTP code and create an authenticated session for the patient.

**Input**:
```typescript
interface VerifyPatientOTPInput {
  email: string; // Patient email address
  code: string;  // 6-digit OTP code
}
```

**Output**:
```typescript
interface VerifyPatientOTPResult {
  success: boolean;
  userId: string; // Supabase Auth user ID
  patient: PatientProfile | null; // Patient profile if found
  session: Session; // Supabase Auth session
}
```

**Behavior**:
- Validates OTP code format (6 digits)
- Calls Supabase Auth to verify code
- Supabase validates: code matches, not expired, not used
- On success: Creates authentication session
- Resolves patient profile from email
- Returns session and patient data

**Error Cases**:
- Invalid code format: Validation error
- Code doesn't match: Authentication error
- Code expired: Expiration error with option to request new code
- Code already used: Single-use violation error
- Email not registered: Authentication error (generic message)

**Example**:
```typescript
const result = await authService.verifyPatientOTP({ 
  email: 'patient@example.com', 
  code: '123456' 
});
// Returns: { success: true, userId: '...', patient: {...}, session: {...} }
```

---

## Type Definitions

### RequestPatientOTPInput

```typescript
interface RequestPatientOTPInput {
  email: string; // Required, must be valid email format, lowercase
}
```

### RequestPatientOTPResult

```typescript
interface RequestPatientOTPResult {
  success: boolean; // Always true if no exception thrown
  message: string;  // Generic success message for security
}
```

### VerifyPatientOTPInput

```typescript
interface VerifyPatientOTPInput {
  email: string; // Required, must match email used to request OTP
  code: string;  // Required, must be exactly 6 numeric digits
}
```

### VerifyPatientOTPResult

```typescript
interface VerifyPatientOTPResult {
  success: boolean;
  userId: string;              // Supabase Auth user ID
  patient: PatientProfile | null; // Patient profile resolved from email
  session: Session;            // Supabase Auth session object
}
```

### PatientProfile

```typescript
interface PatientProfile {
  id: string;
  email: string;
  periodontistId: string;
  onboardingCompleted: boolean;
  accountStatus: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

### Session

```typescript
// Supabase Auth Session type (from @supabase/supabase-js)
interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}
```

## Hook Contracts

### useOTP Hook

**Purpose**: React hook for managing OTP authentication flow (request and verify).

**Interface**:
```typescript
interface UseOTPResult {
  // Request OTP
  requestOTP: (email: string) => Promise<void>;
  isRequesting: boolean;
  requestError: Error | null;
  requestSuccess: boolean;
  
  // Verify OTP
  verifyOTP: (email: string, code: string) => Promise<VerifyPatientOTPResult | null>;
  isVerifying: boolean;
  verifyError: Error | null;
  
  // Reset state
  resetRequest: () => void;
  resetVerify: () => void;
}
```

**Usage**:
```typescript
const {
  requestOTP,
  isRequesting,
  requestError,
  requestSuccess,
  verifyOTP,
  isVerifying,
  verifyError,
  resetRequest,
  resetVerify,
} = useOTP();
```

## Component Contracts

### PatientOTPRequestForm Props

```typescript
interface PatientOTPRequestFormProps {
  onSubmit: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  initialEmail?: string; // Preserve email when switching methods
}
```

### OTPCodeInput Props

```typescript
interface OTPCodeInputProps {
  value: string;
  onChangeText: (code: string) => void;
  onSubmit?: (code: string) => void;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
  helperText?: string;
}
```

## Error Handling

### Error Types

```typescript
enum OTPErrorCode {
  INVALID_CODE_FORMAT = 'INVALID_CODE_FORMAT',
  CODE_EXPIRED = 'CODE_EXPIRED',
  CODE_ALREADY_USED = 'CODE_ALREADY_USED',
  CODE_MISMATCH = 'CODE_MISMATCH',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

### Error Messages (User-Facing)

- Invalid code format: "Please enter a valid 6-digit code"
- Code expired: "This code has expired. Please request a new code."
- Code already used: "This code has already been used. Please request a new code."
- Code mismatch: "Invalid code. Please check and try again."
- Rate limit exceeded: "Too many requests. Please try again in a few minutes."
- Email not registered: Generic authentication error (doesn't reveal non-existence)
- Network error: "Unable to verify code. Please check your connection and try again."

## Validation Rules

### Email Validation

- Must be valid email format
- Converted to lowercase before processing
- Must belong to registered patient (checked before sending OTP)

### OTP Code Validation

- Must be exactly 6 numeric digits
- No spaces or special characters
- Case-insensitive (though numeric only)
- Must match code sent to email
- Must not be expired (10 minutes)
- Must not be used (single-use)

## Rate Limiting

### Request Rate Limits

- Maximum 5 OTP requests per email address per hour
- Window resets after 1 hour from first request
- Rate limit applies per email address (not per IP)
- Generic error message when rate limit exceeded

### Verification Rate Limits

- Handled by Supabase Auth (prevents brute force)
- No additional application-level limits needed
- Failed verification attempts logged for security monitoring

## Security Considerations

- All OTP codes are cryptographically secure (generated by Supabase)
- Codes expire after 10 minutes
- Single-use enforcement prevents replay attacks
- Rate limiting prevents abuse
- Generic error messages prevent email enumeration
- No sensitive data in OTP codes themselves
- Session management handled by Supabase Auth

## Integration Points

### Supabase Auth Integration

- `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })` - Request OTP
- `supabase.auth.verifyOtp({ email, token: code, type: 'email' })` - Verify OTP
- Session creation handled automatically by Supabase on successful verification

### Existing Authentication Integration

- Reuses `PatientRepository` for email validation
- Extends `AuthService` with OTP methods
- Uses same session management as magic link flow
- Integrates with existing `useAuth` hook for session state
