import { normalizeError } from '@/lib/utils/error-handling';
import { useCallback, useMemo, useState } from 'react';
import { AuthService } from '../service/auth.service';
import type { VerifyPatientOTPInput, VerifyPatientOTPResult } from '../service/types';
import { useAuth } from './useAuth';

export function useOTP() {
  const authContext = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authService = useMemo(() => new AuthService(), []);

  const requestOTP = useCallback(
    async (email: string): Promise<{ success: boolean; message: string } | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.requestPatientOTP({ email });
        return result;
      } catch (err) {
        const normalized = normalizeError(err);
        setError(normalized.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [authService],
  );

  const verifyOTP = useCallback(
    async (input: VerifyPatientOTPInput): Promise<VerifyPatientOTPResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await authService.verifyPatientOTP(input);

        // Update auth context with user session
        // AuthProvider will automatically resolve patient profile via onAuthStateChange
        authContext.setUser?.(result.user);

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
    requestOTP,
    verifyOTP,
    resetError,
  };
}
