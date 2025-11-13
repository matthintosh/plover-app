import { Spacing } from '@/constants/theme';
import { LoginForm } from '@/features/authentication/components/LoginForm';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AuthService } from '@/features/authentication/service/auth.service';
import { normalizeError } from '@/lib/utils/error-handling';
import { Link, Redirect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();
  const authService = useMemo(() => new AuthService(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
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
      return <Redirect href={'/(patient)/dashboard' as any} />;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to manage your patients and invitations.</Text>

      <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />

      <Text style={styles.footerText}>
        Need an account? <Link href={{ pathname: '/(auth)/register' } as any}>Register</Link>
      </Text>
    </View>
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
    color: '#555',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
  },
});
