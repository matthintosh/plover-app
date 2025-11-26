import { LinearBackground } from '@/components/ui/LinearBackground';
import { Colors, Spacing } from '@/constants/theme';
import { type AuthMethod } from '@/features/authentication/components/AuthMethodSelector';
import { LoginForm } from '@/features/authentication/components/LoginForm';
import { PatientOTPRequestForm } from '@/features/authentication/components/PatientOTPRequestForm';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AuthService } from '@/features/authentication/service/auth.service';
import { useThemeColor } from '@/hooks/use-theme-color';
import { normalizeError } from '@/lib/utils/error-handling';
import { Link, Redirect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LoginMode = 'periodontist' | 'patient';

export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();
  const authService = useMemo(() => new AuthService(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<LoginMode>('periodontist');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [magicLinkSuccess, setMagicLinkSuccess] = useState(false);
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  const handlePeriodontistSubmit = useCallback(
    async (values: { email: string; password: string }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.loginPeriodontist(values);

        auth.setUser(result.user);
        auth.setPeriodontist(
          result.periodontist
            ? {
                id: result.periodontist.id,
                email: result.periodontist.email,
                fullName: result.periodontist.fullName,
                professionalCredentials: result.periodontist.professionalCredentials ?? undefined,
                accountStatus: result.periodontist.accountStatus,
              }
            : null,
        );
        auth.setPatient(null);
        router.replace({ pathname: '/(periodontist)/dashboard' } as any);
      } catch (err) {
        const normalized = normalizeError(err);
        setError(normalized.message);
      } finally {
        setLoading(false);
      }
    },
    [authService, auth, router],
  );

 
  if (auth.isAuthenticated) {
    if (auth.userType === 'periodontist') {
      return <Redirect href={'/(periodontist)/dashboard' as any} />;
    }

    if (auth.userType === 'patient') {
      return <Redirect href={'/(tabs)' as any} />;
    }
  }

  return (
    <LinearBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
          {mode === 'periodontist'
            ? 'Sign in to manage your patients and invitations.'
            : 'Choose your preferred authentication method and enter your email.'}
        </Text>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'periodontist' && styles.modeButtonActive,
              mode === 'periodontist' && { backgroundColor: primaryColor },
            ]}
            onPress={() => {
              setMode('periodontist');
              setError(null);
              setMagicLinkSuccess(false);
            }}>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'periodontist' && styles.modeButtonTextActive,
              ]}>
              Periodontist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'patient' && styles.modeButtonActive,
              mode === 'patient' && { backgroundColor: primaryColor },
            ]}
            onPress={() => {
              setMode('patient');
              setError(null);
              setMagicLinkSuccess(false);
            }}>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'patient' && styles.modeButtonTextActive,
              ]}>
              Patient
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Forms */}
        {mode === 'periodontist' ? (
          <LoginForm onSubmit={handlePeriodontistSubmit} loading={loading} error={error} />
        ) : (
          <>
          
              <PatientOTPRequestForm
                onSubmit={async (email) => {
                  setPatientEmail(email);
                  setError(null);
                  setMagicLinkSuccess(false);
                  try {
                    const result = await authService.requestPatientOTP({ email });
                    if (result.success) {
                      // Navigate to OTP verification page
                      router.push({
                        pathname: '/(auth)/otp-verify',
                        params: { email },
                      } as any);
                    }
                  } catch (err) {
                    const normalized = normalizeError(err);
                    setError(normalized.message);
                  }
                }}
                loading={loading}
                error={error}
                success={false}
                initialEmail={patientEmail}
              />
            
          </>
        )}

        {mode === 'periodontist' && (
          <Text style={[styles.footerText, { color: textSecondaryColor }]}>
            Need an account? <Link href={{ pathname: '/(auth)/register' } as any}>Register</Link>
          </Text>
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
  },
  subtitle: {
    fontSize: 16,
  },
  footerText: {
    fontSize: 14,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#6D45FF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#897EFF',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
