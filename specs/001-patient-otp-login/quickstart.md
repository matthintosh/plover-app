# Quickstart Guide: Patient OTP Login

**Feature**: Patient OTP Login  
**Date**: 2025-01-27  
**Phase**: 1 - Design

## Overview

This guide helps developers quickly understand and implement the Patient OTP Login feature. It provides integration scenarios, code examples, and testing approaches.

## Feature Summary

Patients can authenticate using OTP (One-Time Password) codes as an alternative to magic links. The feature extends the existing authentication system to provide patients with a choice between magic link or OTP authentication methods.

## Integration Scenarios

### Scenario 1: Patient Chooses OTP Authentication

**Flow**:
1. Patient navigates to login screen
2. Patient selects "Patient" mode
3. Patient sees authentication method options (Magic Link / OTP)
4. Patient selects "OTP"
5. Patient enters email address
6. Patient requests OTP code
7. Patient receives OTP code via email
8. Patient enters OTP code
9. Patient is authenticated and redirected to dashboard

**Key Components**:
- `src/app/(auth)/login.tsx` - Login screen with method selection
- `src/features/authentication/components/PatientOTPRequestForm.tsx` - OTP request form
- `src/features/authentication/components/OTPCodeInput.tsx` - OTP code input
- `src/app/(auth)/otp-verify.tsx` - OTP verification page

### Scenario 2: Patient Switches Authentication Methods

**Flow**:
1. Patient selects OTP method and enters email
2. Patient changes mind and switches to Magic Link
3. Email address is preserved
4. Patient can request magic link without re-entering email

**Key Implementation**:
- Method selection state management
- Email preservation when switching methods
- Conditional rendering of request forms

### Scenario 3: OTP Code Expiration

**Flow**:
1. Patient requests OTP code
2. Patient waits more than 10 minutes
3. Patient attempts to use expired code
4. System shows expiration error
5. Patient can request new OTP code

**Key Implementation**:
- OTP expiration validation (handled by Supabase)
- Error handling for expired codes
- "Request New Code" functionality

## Code Examples

### Requesting an OTP Code

```typescript
import { AuthService } from '@/features/authentication/service/auth.service';

const authService = new AuthService();

// Request OTP code
const result = await authService.requestPatientOTP({ 
  email: 'patient@example.com' 
});

if (result.success) {
  console.log(result.message);
  // Show success message to user
}
```

### Verifying an OTP Code

```typescript
import { AuthService } from '@/features/authentication/service/auth.service';

const authService = new AuthService();

// Verify OTP code
const result = await authService.verifyPatientOTP({
  email: 'patient@example.com',
  code: '123456'
});

if (result.success) {
  // Set user session
  auth.setUser(result.userId);
  auth.setPatient(result.patient);
  // Redirect to dashboard
  router.replace('/(tabs)');
}
```

### Using the useOTP Hook

```typescript
import { useOTP } from '@/features/authentication/hooks/useOTP';

function OTPLoginComponent() {
  const { 
    requestOTP, 
    verifyOTP,
    isRequesting,
    isVerifying,
    requestError,
    verifyError,
    requestSuccess 
  } = useOTP();

  const handleRequestOTP = async (email: string) => {
    await requestOTP(email);
  };

  const handleVerifyOTP = async (email: string, code: string) => {
    const result = await verifyOTP(email, code);
    if (result) {
      // Handle successful authentication
    }
  };

  return (
    // Component JSX
  );
}
```

### Authentication Method Selection Component

```typescript
type AuthMethod = 'magic-link' | 'otp';

function AuthMethodSelector({ 
  selectedMethod, 
  onMethodChange,
  email 
}: {
  selectedMethod: AuthMethod;
  onMethodChange: (method: AuthMethod) => void;
  email: string;
}) {
  return (
    <View style={styles.methodSelector}>
      <TouchableOpacity
        onPress={() => onMethodChange('magic-link')}
        style={[
          styles.methodButton,
          selectedMethod === 'magic-link' && styles.methodButtonActive
        ]}
      >
        <Text>Magic Link</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onMethodChange('otp')}
        style={[
          styles.methodButton,
          selectedMethod === 'otp' && styles.methodButtonActive
        ]}
      >
        <Text>OTP Code</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Testing Approaches

### Unit Tests

**Service Layer Tests** (`src/features/authentication/service/__tests__/auth.service.test.ts`):

```typescript
describe('AuthService - OTP', () => {
  it('should request OTP code for registered patient', async () => {
    const service = new AuthService();
    const result = await service.requestPatientOTP({ 
      email: 'patient@example.com' 
    });
    expect(result.success).toBe(true);
  });

  it('should verify valid OTP code', async () => {
    const service = new AuthService();
    // Mock Supabase response
    const result = await service.verifyPatientOTP({
      email: 'patient@example.com',
      code: '123456'
    });
    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
  });

  it('should reject expired OTP code', async () => {
    const service = new AuthService();
    await expect(
      service.verifyPatientOTP({
        email: 'patient@example.com',
        code: 'expired-code'
      })
    ).rejects.toThrow('Code expired');
  });
});
```

**Hook Tests** (`src/features/authentication/hooks/__tests__/useOTP.test.ts`):

```typescript
describe('useOTP', () => {
  it('should request OTP code', async () => {
    const { result } = renderHook(() => useOTP());
    await act(async () => {
      await result.current.requestOTP('patient@example.com');
    });
    expect(result.current.requestSuccess).toBe(true);
  });

  it('should handle request errors', async () => {
    const { result } = renderHook(() => useOTP());
    await act(async () => {
      await result.current.requestOTP('invalid@example.com');
    });
    expect(result.current.requestError).toBeDefined();
  });
});
```

### Component Tests

**OTP Request Form Tests** (`src/features/authentication/components/__tests__/PatientOTPRequestForm.test.tsx`):

```typescript
describe('PatientOTPRequestForm', () => {
  it('should submit email when form is valid', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <PatientOTPRequestForm onSubmit={onSubmit} />
    );
    
    fireEvent.changeText(getByLabelText('Email'), 'patient@example.com');
    fireEvent.press(getByText('Send OTP Code'));
    
    expect(onSubmit).toHaveBeenCalledWith('patient@example.com');
  });

  it('should show error for invalid email', () => {
    const { getByLabelText, getByText } = render(
      <PatientOTPRequestForm onSubmit={jest.fn()} />
    );
    
    fireEvent.changeText(getByLabelText('Email'), 'invalid-email');
    fireEvent.press(getByText('Send OTP Code'));
    
    expect(getByText(/valid email/i)).toBeDefined();
  });
});
```

### Integration Tests

**OTP Authentication Flow** (`src/features/authentication/__tests__/integration/otp-auth.test.ts`):

```typescript
describe('OTP Authentication Flow', () => {
  it('should complete full OTP authentication flow', async () => {
    // 1. Request OTP
    const authService = new AuthService();
    const requestResult = await authService.requestPatientOTP({
      email: 'patient@example.com'
    });
    expect(requestResult.success).toBe(true);

    // 2. Simulate receiving OTP code (in real scenario, user gets from email)
    const otpCode = '123456'; // Mock code

    // 3. Verify OTP
    const verifyResult = await authService.verifyPatientOTP({
      email: 'patient@example.com',
      code: otpCode
    });
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.patient).toBeDefined();
  });
});
```

## Supabase Configuration

### Email Template Setup

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Configure OTP email template:
   - Subject: "Your Plover login code"
   - Body: Include OTP code `{{ .Token }}` and expiration time
   - Match branding with magic link emails

### Rate Limiting Configuration

1. Go to Supabase Dashboard → Authentication → Settings
2. Configure rate limits:
   - OTP requests: 5 per hour per email (or use application-level tracking)
   - OTP verification attempts: Use Supabase defaults

### OTP Expiration Configuration

1. Go to Supabase Dashboard → Authentication → Settings
2. Set OTP expiration: 10 minutes (600 seconds)

## Development Checklist

- [ ] Extend `AuthService` with `requestPatientOTP` method
- [ ] Extend `AuthService` with `verifyPatientOTP` method
- [ ] Create `useOTP` hook
- [ ] Create `PatientOTPRequestForm` component
- [ ] Create `OTPCodeInput` component
- [ ] Update login page with method selection UI
- [ ] Create `otp-verify.tsx` page
- [ ] Add OTP types to `types.ts`
- [ ] Write unit tests for service methods
- [ ] Write unit tests for hook
- [ ] Write component tests
- [ ] Write integration tests
- [ ] Configure Supabase email templates
- [ ] Configure Supabase rate limiting
- [ ] Test end-to-end flow
- [ ] Verify backward compatibility with magic link

## Common Issues and Solutions

### Issue: OTP codes not being delivered

**Solution**: 
- Check Supabase email configuration
- Verify email service is enabled
- Check spam folder
- Verify email address is registered as patient

### Issue: OTP code expires too quickly

**Solution**:
- Check Supabase OTP expiration settings
- Ensure system clock is synchronized
- Consider user feedback about timing

### Issue: Rate limiting too strict

**Solution**:
- Adjust rate limit configuration
- Implement application-level rate limiting with custom logic
- Provide clear error messages to users

### Issue: OTP verification fails silently

**Solution**:
- Check error handling in `verifyPatientOTP`
- Ensure error messages are displayed to users
- Verify Supabase error responses are properly handled

## Next Steps

1. Review this quickstart guide
2. Review data model (`data-model.md`)
3. Review API contracts (`contracts/api-contracts.md`)
4. Review research decisions (`research.md`)
5. Proceed to task planning (`/speckit.tasks`)
