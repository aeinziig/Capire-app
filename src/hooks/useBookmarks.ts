import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

export interface BookmarkData {
  id: string;
  capstone_projects: {
    id: string;
    title: string;
    author: string;
    department: string;
    year: string;
    originalityScore: number | null;
    imageUrl?: string | null;
  };
}

export const useBookmarks = (userId: string) => {
  const [data, setData] = useState<BookmarkData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setData(null);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: bookmarks, error: err } = await supabase
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

        if (err) throw err;
        setData(
          (((bookmarks as Array<Record<string, any>> | null) || []).map((bookmark) => ({
            id: String(bookmark.id || ''),
            capstone_projects: {
              id: String(bookmark.capstone_projects?.id || ''),
              title: String(bookmark.capstone_projects?.title || ''),
              author: String(bookmark.capstone_projects?.author || ''),
              department: String(bookmark.capstone_projects?.department || ''),
              year: String(bookmark.capstone_projects?.year || ''),
              originalityScore:
                typeof bookmark.capstone_projects?.originalityScore === 'number'
                  ? bookmark.capstone_projects.originalityScore
                  : null,
              imageUrl:
                typeof bookmark.capstone_projects?.imageUrl === 'string'
                  ? bookmark.capstone_projects.imageUrl
                  : null,
            },
          })))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bookmarks');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  return { data, loading, error };
};
