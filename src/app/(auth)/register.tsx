import { LinearBackground } from '@/components/ui/LinearBackground';
import { Spacing } from '@/constants/theme';
import { RegistrationForm } from '@/features/authentication/components/RegistrationForm';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AuthService } from '@/features/authentication/service/auth.service';
import { normalizeError } from '@/lib/utils/error-handling';
import { Link, Redirect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function RegisterScreen() {
  const authService = useMemo(() => new AuthService(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isAuthenticated, userType } = useAuth();
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const successColor = useThemeColor({}, 'success');

  const handleSubmit = useCallback(
    async (values: {
      fullName: string;
      email: string;
      password: string;
      professionalCredentials?: string;
    }) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        await authService.registerPeriodontist({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          professionalCredentials: values.professionalCredentials ?? null,
        });

        setSuccessMessage('Account created. Please check your email to verify and then sign in.');
      } catch (err) {
        const normalized = normalizeError(err);
        setError(normalized.message);
      } finally {
        setLoading(false);
      }
    },
    [authService],
  );

  if (isAuthenticated) {
    if (userType === 'periodontist') {
      return <Redirect href={'/(periodontist)/dashboard' as any} />;
    }

    if (userType === 'patient') {
      return <Redirect href={'/(patient)/dashboard' as any} />;
    }
  }

  return (
    <LinearBackground>
    <View style={styles.container}>
      <Text style={styles.title}>Create your practice account</Text>
      <Text style={[styles.subtitle, { color: textSecondaryColor }]}>Invite patients and monitor their care in one place.</Text>

      <RegistrationForm onSubmit={handleSubmit} loading={loading} error={error} />

      {successMessage ? <Text style={[styles.successText, { color: successColor }]}>{successMessage}</Text> : null}

      <Text style={[styles.footerText, { color: textSecondaryColor }]}>
        Already have an account? <Link href={{ pathname: '/(auth)/login' } as any}>Sign in</Link>
      </Text>
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
  successText: {
    fontSize: 14,
  },
  footerText: {
    fontSize: 14,
  },
});
