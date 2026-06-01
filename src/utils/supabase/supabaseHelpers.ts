import { supabase } from '@/services/supabase';

export const supabaseHelpers = {
  // Text search with automatic ranking
  textSearch: (table: string, columns: string | string[], query: string) => {
    if (!query.trim()) {
      return supabase.from(table).select('*');
    }

    const searchColumns = Array.isArray(columns) ? columns.join(' ') : columns;
    return supabase.from(table).select('*').textSearch(searchColumns, query.trim());
  },

  // Get related data with automatic joining
  getRelated: <T>(table: string, id: string, relations: string[]) => {
    let query = supabase.from(table).select('*').eq('id', id).single();

    // Add relations if specified
    if (relations.length > 0) {
      const relationString = relations.map(r => `${r}(*)`).join(', ');
      query = supabase.from(table).select(`, ${relationString}`).eq('id', id).single();
    }

    return query;
  },

  // Insert or update (upsert)
  upsert: <T>(table: string, data: T, options: { onConflict?: string } = {}) => {
    let query = supabase.from(table).upsert(data);

    if (options.onConflict) {
      query = query.onConflict(options.onConflict);
    }

    return query;
  }
};