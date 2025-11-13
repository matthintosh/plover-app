import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ExchangeMagicLinkCodeInput } from '../service/types';

export type MagicLinkHandlerProps = {
  code: string | null;
  verifier: string | null;
  onExchange: (input: ExchangeMagicLinkCodeInput) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  autoStart?: boolean;
  onRetry?: () => void;
};

export function MagicLinkHandler({
  code,
  verifier,
  onExchange,
  loading = false,
  error = null,
  autoStart = true,
  onRetry,
}: MagicLinkHandlerProps) {
  useEffect(() => {
    if (!autoStart) {
      return;
    }

    if (!code || !verifier) {
      return;
    }

    onExchange({ code, verifier });
    // We only want to run once when inputs are available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, code, verifier]);

  const missingParameters = !code || !verifier;

  return (
    <View style={styles.container}>
      {missingParameters ? (
        <Text style={styles.infoText}>The verification link is invalid or expired.</Text>
      ) : (
        <Text style={styles.infoText}>
          {loading
            ? 'Verifying your account…'
            : 'We are verifying your magic link. This should only take a moment.'}
        </Text>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {(!autoStart || error) && !missingParameters ? (
        <Button
          title={loading ? 'Verifying…' : 'Try again'}
          onPress={() => onExchange({ code: code!, verifier: verifier! })}
          loading={loading}
          fullWidth
        />
      ) : null}

      {onRetry && !missingParameters && !loading ? (
        <Button title="Retry" onPress={onRetry} fullWidth variant="outline" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#E57373',
    fontSize: 14,
    textAlign: 'center',
  },
});
