import { Spacing } from '@/constants/theme';
import { MagicLinkHandler } from '@/features/authentication/components/MagicLinkHandler';
import { useMagicLink } from '@/features/authentication/hooks/useMagicLink';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MagicLinkScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; verifier?: string }>();
  const { exchangeMagicLinkCode, loading, error, resetError } = useMagicLink();
  const { isAuthenticated, userType, isLoading: authLoading } = useAuth();

  const handleExchange = useCallback(
    async ({ code, verifier }: { code: string; verifier: string }) => {
      await exchangeMagicLinkCode({ code, verifier });
    },
    [exchangeMagicLinkCode],
  );

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    if (userType === 'periodontist') {
      router.replace({ pathname: '/(periodontist)/dashboard' } as any);
    } else if (userType === 'patient') {
      router.replace({ pathname: '/(tabs)/initial-access' } as any);
    }
  }, [authLoading, isAuthenticated, router, userType]);

  const derivedError = useMemo(() => {
    if (error) {
      return error;
    }

    if (!params.code || !params.verifier) {
      return 'The verification link is invalid or has expired. Please request a new magic link.';
    }

    return null;
  }, [error, params.code, params.verifier]);

  return (
    <View style={styles.container}>
      <MagicLinkHandler
        code={params.code ?? null}
        verifier={params.verifier ?? null}
        onExchange={handleExchange}
        loading={loading}
        error={derivedError}
        onRetry={resetError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
});
