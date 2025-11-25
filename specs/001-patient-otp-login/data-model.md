# Data Model: Patient OTP Login

**Feature**: Patient OTP Login  
**Date**: 2025-01-27  
**Phase**: 1 - Design

## Overview

This feature extends the existing authentication system to support OTP (One-Time Password) codes as an alternative to magic links. The data model focuses on the OTP Code entity and its relationship to patient authentication.

## Entities

### OTP Code

**Purpose**: Represents a one-time password code sent to a patient's email for authentication.

**Note**: In practice, OTP codes are managed by Supabase Auth internally. This entity represents the logical concept and validation requirements rather than a physical database table (unless custom tracking is needed for rate limiting).

**Attributes**:

- `code` (String, 6 digits): The numeric OTP code value (e.g., "123456")
- `email` (String, Required): Email address of the patient requesting OTP
- `createdAt` (Timestamp, Required): When the OTP code was generated
- `expiresAt` (Timestamp, Required): When the OTP code expires (10 minutes after creation)
- `used` (Boolean, Default: false): Whether the code has been used for authentication
- `usedAt` (Timestamp, Nullable): When the code was successfully used (if used)

**Validation Rules**:

- Code must be exactly 6 numeric digits
- Code must not be expired (expiresAt > current time)
- Code must not be used (used === false)
- Email must be registered as a patient
- Code expires 10 minutes after creation

**State Transitions**:

1. **Created**: Code generated and sent to email (`used: false`, `expiresAt: createdAt + 10 minutes`)
2. **Expired**: Current time > expiresAt (code cannot be used)
3. **Used**: Code successfully validated (`used: true`, `usedAt: current time`)
4. **Invalid**: Code doesn't match or has been used (cannot transition to Used)

**Relationships**:

- Associated with Patient via email address (one-to-many: one patient can have multiple OTP codes over time)
- No direct foreign key relationship (email-based association)

**Storage Considerations**:

- Supabase Auth handles OTP code storage internally
- Application may track OTP requests for rate limiting (temporary data, can be in-memory or lightweight cache)
- No permanent storage required for OTP codes (temporary authentication tokens)

## Rate Limiting Data

**Purpose**: Track OTP requests per email address to enforce rate limiting (5 requests per hour).

**Attributes** (if implementing custom rate limiting):

- `email` (String, Required): Email address
- `requestCount` (Integer, Default: 0): Number of requests in current window
- `windowStart` (Timestamp, Required): Start of current rate limit window
- `lastRequestAt` (Timestamp, Required): Timestamp of most recent request

**Storage**: 
- In-memory cache (Redis, or simple Map) for temporary tracking
- Or use Supabase Auth built-in rate limiting if it meets requirements

## Integration with Existing Entities

### Patient

**Relationship**: OTP codes are associated with patients via email address.

**Impact**: 
- No changes to Patient entity structure
- OTP authentication uses existing patient email validation
- Patient authentication state remains unchanged

### Authentication Session

**Relationship**: OTP codes create authentication sessions identical to magic links.

**Impact**:
- OTP authentication results in same session structure as magic link
- No changes to session management
- Same user profile resolution after authentication

## Database Schema (if custom tracking needed)

**Note**: Supabase Auth handles OTP storage internally. Custom schema only needed for rate limiting if not using Supabase's built-in limits.

```sql
-- Optional: Rate limiting tracking table
-- Only needed if custom rate limiting beyond Supabase limits is required

CREATE TABLE IF NOT EXISTS otp_rate_limit (
  email TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  last_request_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for cleanup of expired windows
CREATE INDEX IF NOT EXISTS idx_otp_rate_limit_window_start 
ON otp_rate_limit(window_start);

-- Cleanup function for expired rate limit windows (run periodically)
-- DELETE FROM otp_rate_limit WHERE window_start < NOW() - INTERVAL '1 hour';
```

## Data Flow

### OTP Request Flow

1. Patient enters email and requests OTP
2. System validates email belongs to registered patient
3. System checks rate limit (5 requests per hour)
4. System calls Supabase Auth to generate and send OTP
5. System tracks request for rate limiting (optional)
6. Patient receives email with OTP code

### OTP Verification Flow

1. Patient enters OTP code
2. System calls Supabase Auth to verify code
3. Supabase validates: code matches, not expired, not used
4. On success: Supabase creates authentication session
5. System resolves patient profile from email
6. Patient is authenticated and redirected to dashboard

## Security Considerations

- OTP codes are cryptographically secure (handled by Supabase)
- Codes expire after 10 minutes (reduces attack window)
- Single-use enforcement prevents replay attacks
- Rate limiting prevents brute force and abuse
- Email enumeration prevention (generic success messages)
- No sensitive data stored in OTP codes themselves

## Privacy Considerations

- OTP codes contain no personal information
- Email addresses are already known (used for delivery)
- Rate limiting data is temporary and can be purged
- No additional PII collected beyond existing authentication flow
