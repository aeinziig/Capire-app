import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });
  return { data, error };
};

export const updateUser = async (user: { email?: string; password?: string; data?: Record<string, any> }) => {
  const { data, error } = await supabase.auth.update(user);
  return { data, error };
};

// Real-time subscription helper
export const subscribeToChanges = <T>(
  table: string,
  filter: string,
  callback: (payload: T) => void
) => {
  const channel = supabase
    .channel(table)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: table, filter },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return channel;
};

export default supabase;
