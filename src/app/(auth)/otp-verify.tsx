import { Button } from '@/components/ui/Button';
import { LinearBackground } from '@/components/ui/LinearBackground';
import { Colors, Spacing } from '@/constants/theme';
import { OTPCodeInput } from '@/features/authentication/components/OTPCodeInput';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useOTP } from '@/features/authentication/hooks/useOTP';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OTPVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const auth = useAuth();
  const { requestOTP, verifyOTP, loading, error, resetError } = useOTP();
  const [otpCode, setOtpCode] = useState('');
  const [requestingNewCode, setRequestingNewCode] = useState(false);
  const [success, setSuccess] = useState(false);
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const email = params.email || '';

  useEffect(() => {
    if (!email) {
      // Redirect to login if no email provided
      router.replace('/(auth)/login');
    }
  }, [email, router]);

  useEffect(() => {
    // Redirect if already authenticated
    if (auth.isAuthenticated && auth.userType === 'patient' && !success) {
      router.replace('/(tabs)');
    }
  }, [auth.isAuthenticated, auth.userType, router, success]);

  const handleVerify = useCallback(async () => {
    if (otpCode.length !== 8) {
      return;
    }

    resetError();
    const result = await verifyOTP({
      email,
      token: otpCode,
    });

    if (result) {
      setSuccess(true);
      // Wait for auth state to resolve, then redirect
      // AuthProvider will automatically load patient profile
      setTimeout(() => {
        if (auth.isAuthenticated && auth.userType === 'patient') {
          router.replace('/(tabs)');
        }
      }, 1500);
    }
  }, [otpCode, email, verifyOTP, resetError, auth.isAuthenticated, auth.userType, router]);

  useEffect(() => {
    // Auto-submit when 8 digits entered
    if (otpCode.length === 8 && !loading && !success) {
      handleVerify();
    }
  }, [otpCode, loading, success, handleVerify]);

  const handleRequestNewCode = async () => {
    setRequestingNewCode(true);
    resetError();
    setOtpCode('');
    const result = await requestOTP(email);
    setRequestingNewCode(false);
    if (result?.success) {
      setSuccess(false);
    }
  };

  if (auth.isAuthenticated && auth.userType === 'patient') {
    router.replace('/(tabs)');
    return null;
  }

  if (!email) {
    return null;
  }

  return (
    <LinearBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP Code</Text>
        <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
          We&apos;ve sent an 8-digit code to {email}. Please enter it below to sign in.
        </Text>

        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Verification successful! Redirecting...
            </Text>
          </View>
        ) : (
          <>
            <OTPCodeInput
              value={otpCode}
              onChangeText={setOtpCode}
              error={error}
              loading={loading}
            />

            {error && error.includes('expired') && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  onPress={handleRequestNewCode}
                  disabled={requestingNewCode}
                  style={styles.requestNewCodeButton}>
                  <Text
                    style={[
                      styles.requestNewCodeText,
                      { color: primaryColor },
                      requestingNewCode && styles.requestNewCodeTextDisabled,
                    ]}>
                    {requestingNewCode ? 'Requesting...' : 'Request New Code'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {error && !error.includes('expired') && (
              <Text style={[styles.errorText, { color: Colors.light.error }]}>
                {error}
              </Text>
            )}

            <Button
              title={loading ? 'Verifying...' : 'Verify Code'}
              onPress={handleVerify}
              loading={loading}
              disabled={otpCode.length !== 8 || loading}
              fullWidth
            />

            <TouchableOpacity
              onPress={handleRequestNewCode}
              disabled={requestingNewCode || loading}
              style={styles.backButton}>
              <Text
                style={[
                  styles.backButtonText,
                  { color: textSecondaryColor },
                  (requestingNewCode || loading) && styles.backButtonTextDisabled,
                ]}>
                Didn&apos;t receive code? Request a new one
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  successContainer: {
    padding: Spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.error,
  },
  requestNewCodeButton: {
    paddingVertical: Spacing.sm,
  },
  requestNewCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  requestNewCodeTextDisabled: {
    opacity: 0.5,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  backButtonTextDisabled: {
    opacity: 0.5,
  },
});
