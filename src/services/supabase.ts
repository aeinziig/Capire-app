import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are missing. Data screens will show empty or error states.');
}

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://example.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'missing-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => SecureStore.getItemAsync(key),
        setItem: (key, value) => SecureStore.setItemAsync(key, value),
        removeItem: (key) => SecureStore.deleteItemAsync(key),
      },
    }
  }
);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}

type UserUpdateInput = {
  email?: string;
  password?: string;
  data?: Record<string, unknown>;
};

export const updateUser = async (user: UserUpdateInput) => {
  const updateData: UserUpdateInput = {};
  if (user.email) updateData.email = user.email;
  if (user.password) updateData.password = user.password;
  if (user.data) updateData.data = user.data;

  const { data, error } = await supabase.auth.updateUser(updateData);
  return { data, error };
}
export const subscribeToChanges = (
  table: string,
  filter: string,
  callback: (payload: unknown) => void
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
