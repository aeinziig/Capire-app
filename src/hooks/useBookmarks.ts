import { useQuery } from './useQuery';
import { supabase } from '@/services/supabase';

export const useBookmarks = (userId: string) => {
  const queryFn = () =>
    supabase
      .from('bookmarks')
      .select(`
        id,
        capstone_projects (
          id,
          title,
          author,
          department,
          year,
          originalityScore,
          imageUrl
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

  return useQuery().execute(queryFn);
};