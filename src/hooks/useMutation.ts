import { useState, useCallback } from 'react';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';

type MutationResult<T> = {
  data?: T;
  [key: string]: unknown;
};

export const useMutation = <T = unknown>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <R extends MutationResult<T> | T>(
    mutationFn: () => Promise<R>
  ): Promise<R> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn();
      const nextData = (
        result && typeof result === 'object' && 'data' in result
          ? (result as MutationResult<T>).data
          : result
      ) as T | undefined;
      setData(nextData ?? null);
      return result;
    } catch (err: unknown) {
      const errorMessage = mapAuthError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return [data, loading, error, execute] as const;
};
