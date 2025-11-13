import { Spacing } from '@/constants/theme';
import { MagicLinkHandler } from '@/features/authentication/components/MagicLinkHandler';
import { useMagicLink } from '@/features/authentication/hooks/useMagicLink';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MagicLinkScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; verifier?: string }>();
  const { exchangeMagicLinkCode, loading, error, resetError } = useMagicLink();

  const handleExchange = useCallback(
    async ({ code, verifier }: { code: string; verifier: string }) => {
      const result = await exchangeMagicLinkCode({ code, verifier });
      if (result) {
        router.replace({ pathname: '/(periodontist)/dashboard' } as any);
      }
    },
    [exchangeMagicLinkCode, router],
  );

  return (
    <View style={styles.container}>
      <MagicLinkHandler
        code={params.code ?? null}
        verifier={params.verifier ?? null}
        onExchange={handleExchange}
        loading={loading}
        error={error}
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
