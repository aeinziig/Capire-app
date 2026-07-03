import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import { ERROR_MESSAGES } from '@/utils/errorMessages';
import { log } from '@/utils/logger';

const THEME_KEY = 'theme_preference';
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const getStoredThemePreference = async () => {
  try {
    return await AsyncStorage.getItem(THEME_KEY);
  } catch {
    // ponytail: AsyncStorage is flaky in this native build; SecureStore keeps theme persistence without another dependency.
    return SecureStore.getItemAsync(THEME_KEY);
  }
};

const setStoredThemePreference = async (theme: ThemePreference) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
    return;
  } catch {
    // ponytail: same fallback path as reads; if native storage is missing we still persist the toggle.
  }

  await SecureStore.setItemAsync(THEME_KEY, theme);
};

// Define the context type
interface AppContextType {
  user: User | null;
  userName: string;
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  stats: {
    totalCapstones: number;
    myBookmarks: number;
    availableForReview: number;
    originalityChecks: number;
    researchHours: number;
  };
  recentActivities: Array<{
    id: string;
    title: string;
    type: 'capstone' | 'research' | 'bookmark';
    time: string;
    department?: string;
  }>;
  loading: boolean;
  error: string | null;
  // Methods to update state
  refreshUserData: () => Promise<void>;
  updateUserName: (name: string) => void;
  updateStats: (stats: Partial<AppContextType['stats']>) => void;
  addRecentActivity: (activity: AppContextType['recentActivities'][number]) => void;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Provider component
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
  const systemColorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [stats, setStats] = useState<AppContextType['stats']>({
    totalCapstones: 0,
    myBookmarks: 0,
    availableForReview: 0,
    originalityChecks: 0,
    researchHours: 0
  });
  const [recentActivities, setRecentActivities] = useState<AppContextType['recentActivities']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundedAtRef = useRef<number | null>(null);
  const resolvedTheme: ResolvedTheme = themePreference === 'system'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : themePreference;

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await getStoredThemePreference();
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemePreferenceState(savedTheme);
        }
      } catch (themeError) {
        log.error('Failed to load theme preference', themeError);
      }
    };

    loadThemePreference();
  }, []);

  // Fetch user data from Supabase
  const fetchUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set user name from email or user metadata
      const userNameValue = user.email?.split('@')[0] ||
                           (user.user_metadata?.full_name?.split(' ')[0]) ||
                           'User';
      setUserName(userNameValue);

      // Fetch bookmark count
      const {
        data: bookmarkData,
        error: bookmarkError
      } = await supabase
        .from('bookmarks')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (bookmarkError) throw bookmarkError;
      const bookmarkCount = bookmarkData?.length || 0;

      // Fetch total capstone projects count
      const {
        data: capstoneData,
        error: capstoneError
      } = await supabase
        .from('capstone_projects')
        .select('id', { count: 'exact' });

      if (capstoneError) throw capstoneError;
      const totalCapstones = capstoneData?.length || 0;

      // For recent activities, get recently bookmarked items
      const {
        data: recentBookmarks,
        error: recentBookmarksError
      } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          capstone_projects (
            id,
            title,
            author,
            department,
            year
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Process recent activities from bookmarks
      let activities: AppContextType['recentActivities'] = [];
      if (!recentBookmarksError && recentBookmarks) {
        activities = recentBookmarks.map((bm: any) => ({
          id: bm.id,
          title: `Bookmarked: ${bm.capstone_projects.title}`,
          type: 'bookmark' as const,
          time: new Date(bm.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          department: bm.capstone_projects.department
        }));
      }

      // Update stats
      setStats({
        totalCapstones,
        myBookmarks: bookmarkCount,
        availableForReview: Math.max(0, totalCapstones - bookmarkCount),
        originalityChecks: 0, // TODO: Implement when originality_checks table is available
        researchHours: 0 // TODO: Implement when research_hours table/logic is available
      });

      setRecentActivities(activities);

    } catch (err: any) {
      setError(mapAuthError(err));
      log.error('Error fetching user data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appStateRef.current === 'active' && nextState.match(/inactive|background/)) {
        backgroundedAtRef.current = Date.now();
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active' &&
        backgroundedAtRef.current &&
        user &&
        Date.now() - backgroundedAtRef.current >= INACTIVITY_TIMEOUT_MS
      ) {
        setError(ERROR_MESSAGES.SESSION_EXPIRED);
        await supabase.auth.signOut();
      }

      if (nextState === 'active') {
        backgroundedAtRef.current = null;
      }

      appStateRef.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  // Initialize auth listener and fetch data
  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setUserName('');
          setStats({
            totalCapstones: 0,
            myBookmarks: 0,
            availableForReview: 0,
            originalityChecks: 0,
            researchHours: 0
          });
          setRecentActivities([]);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      void fetchUserData();
      return;
    }

    setLoading(false);
  }, [fetchUserData, user]);

  // Methods to update state from outside
  const refreshUserData = useCallback(() => {
    return fetchUserData();
  }, [fetchUserData]);

  const updateUserName = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const updateStats = useCallback((newStats: Partial<AppContextType['stats']>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const addRecentActivity = useCallback((activity: AppContextType['recentActivities'][number]) => {
    setRecentActivities(prev => [activity, ...prev.slice(0, 4)]); // Keep max 5 activities
  }, []);

  const setThemePreference = useCallback(async (theme: ThemePreference) => {
    setThemePreferenceState(theme);
    try {
      await setStoredThemePreference(theme);
    } catch (themeError) {
      log.error('Failed to save theme preference', themeError);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        userName,
        themePreference,
        resolvedTheme,
        stats,
        recentActivities,
        loading,
        error,
        refreshUserData,
        updateUserName,
        updateStats,
        addRecentActivity,
        setThemePreference
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
