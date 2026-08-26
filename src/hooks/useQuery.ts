import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { mapDatabaseError } from '@/utils/supabase/supabaseErrorHandler';

export const useQuery = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (queryFn: () => Promise<any> | any) => {
    setLoading(true);
    setError(null);
    try {
      let result = queryFn();
      // Handle PostgrestBuilder by converting to promise
      if (result && typeof result.then === 'function') {
        result = await result;
      } else if (result && typeof result.then === 'undefined') {
        // If it's a PostgrestBuilder (not a promise), we need to handle it differently
        // This shouldn't happen with proper usage, but we handle it anyway
        result = await Promise.resolve(result);
      }
      setData(result?.data || result);
      return result;
    } catch (err: unknown) {
      setError(mapDatabaseError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
};
