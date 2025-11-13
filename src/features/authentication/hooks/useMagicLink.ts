import { normalizeError } from '@/lib/utils/error-handling';
import { useCallback, useMemo, useState } from 'react';
import { AuthService } from '../service/auth.service';
import type { ExchangeMagicLinkCodeInput, ExchangeMagicLinkCodeResult } from '../service/types';
import { useAuth } from './useAuth';

export function useMagicLink() {
  const authContext = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authService = useMemo(() => new AuthService(), []);

  const exchangeMagicLinkCode = useCallback(
    async (input: ExchangeMagicLinkCodeInput): Promise<ExchangeMagicLinkCodeResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.exchangeMagicLinkCode(input);

        authContext.setUser?.({
          id: result.userId,
        } as any);

        return result;
      } catch (err) {
        const normalized = normalizeError(err);
        setError(normalized.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [authContext, authService],
  );

  const resetError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    exchangeMagicLinkCode,
    resetError,
  };
}
