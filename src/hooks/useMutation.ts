import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase';

export const useMutation = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (mutationFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn();
      setData(result.data);
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};