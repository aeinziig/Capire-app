import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase';

export const usePagination = <T>(
  table: string,
  options: {
    select?: string;
    filters?: Array<{ column: string; value: any; operator?: string }>;
    orderBy?: { column: string; ascending?: boolean };
  } = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from(table)
        .select(options.select || '*')
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      // Apply filters
      if (options.filters) {
        options.filters.forEach(filter => {
          const operator = filter.operator || 'eq';
          query = query[operator](filter.column, filter.value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(
          options.orderBy.column,
          { ascending: options.orderBy.ascending ?? true }
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      setData(prev => [...prev, ...(data || [])]);
      setHasMore((data || []).length === PAGE_SIZE);
      return { data, error: null };
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [table, options]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchPage(page + 1).then(() => setPage(p => p + 1));
  }, [hasMore, loading, fetchPage, page]);

  const refresh = useCallback(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
    return fetchPage(0);
  }, [fetchPage]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    refetch: refresh
  };
};