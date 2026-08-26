import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import { ERROR_MESSAGES } from '@/utils/errorMessages';
import { log } from '@/utils/logger';

const THEME_KEY = 'theme_preference';
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export type MessageNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  partnerId: string;
  partnerName: string;
};

type ChatMessageNotificationRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
};

type ChatNotificationUserRow = {
  id: string;
  full_name: string | null;
  email: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

interface AppContextType {
  user: User | null;
  userName: string;
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  unreadMessageCount: number;
  messageNotifications: MessageNotification[];
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
  refreshUserData: () => Promise<void>;
  updateUserName: (name: string) => void;
  updateStats: (stats: Partial<AppContextType['stats']>) => void;
  addRecentActivity: (activity: AppContextType['recentActivities'][number]) => void;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  refreshMessageNotifications: () => Promise<void>;
  markAllMessageNotificationsRead: () => Promise<void>;
  markMessageNotificationRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
  const systemColorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [messageNotifications, setMessageNotifications] = useState<MessageNotification[]>([]);
  const [stats, setStats] = useState<AppContextType['stats']>({
    totalCapstones: 0,
    myBookmarks: 0,
    availableForReview: 0,
    originalityChecks: 0,
    researchHours: 0,
  });
  const [recentActivities, setRecentActivities] = useState<AppContextType['recentActivities']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundedAtRef = useRef<number | null>(null);
  const resolvedTheme: ResolvedTheme = themePreference === 'system'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : themePreference;

  const fetchMessageNotifications = useCallback(async () => {
    if (!user) {
      setUnreadMessageCount(0);
      setMessageNotifications([]);
      return;
    }

    const { data, error: messageError } = await supabase
      .from('chat_messages')
      .select('id, sender_id, receiver_id, message, is_read, created_at')
      .eq('receiver_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(20);

    if (messageError) {
      log.error('Failed to load message notifications', messageError);
      return;
    }

    const rows = (data ?? []) as ChatMessageNotificationRow[];
    const senderIds = [...new Set(rows.map((row) => row.sender_id))];

    let usersById = new Map<string, ChatNotificationUserRow>();
    if (senderIds.length > 0) {
      const { data: senderData, error: senderError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .in('id', senderIds);

      if (!senderError) {
        usersById = new Map(((senderData ?? []) as ChatNotificationUserRow[]).map((sender) => [sender.id, sender]));
      }
    }

    setUnreadMessageCount(rows.length);
    setMessageNotifications(rows.map((row) => {
      const sender = usersById.get(row.sender_id);
      const partnerName = sender?.full_name || sender?.email || 'User';
      return {
        id: row.id,
        title: `New message from ${partnerName}`,
        body: row.message,
        time: row.created_at || new Date().toISOString(),
        isRead: Boolean(row.is_read),
        partnerId: row.sender_id,
        partnerName,
      };
    }));
  }, [user]);

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

    void loadThemePreference();
  }, []);

  useEffect(() => {
    const prepareNotifications = async () => {
      try {
        await Notifications.requestPermissionsAsync();
        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.HIGH,
        });
      } catch (notificationError) {
        log.error('Failed to prepare notifications', notificationError);
      }
    };

    void prepareNotifications();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userNameValue = user.user_metadata?.full_name?.split(' ')[0] ||
        user.user_metadata?.name?.split(' ')[0] ||
        user.email?.split('@')[0] ||
        'User';
      setUserName(userNameValue);

      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (bookmarkError) throw bookmarkError;
      const bookmarkCount = bookmarkData?.length || 0;

      const { data: capstoneData, error: capstoneError } = await supabase
        .from('capstone_projects')
        .select('id', { count: 'exact' });

      if (capstoneError) throw capstoneError;
      const totalCapstones = capstoneData?.length || 0;

      const { data: recentBookmarks, error: recentBookmarksError } = await supabase
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
            minute: '2-digit',
          }),
          department: bm.capstone_projects.department,
        }));
      }

      setStats({
        totalCapstones,
        myBookmarks: bookmarkCount,
        availableForReview: Math.max(0, totalCapstones - bookmarkCount),
        originalityChecks: 0,
        researchHours: 0,
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

  useEffect(() => {
    const initUser = async () => {
      const { data: { user: initialUser } } = await supabase.auth.getUser();
      setUser(initialUser);
    };

    void initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setUserName('');
          setUnreadMessageCount(0);
          setMessageNotifications([]);
          setStats({
            totalCapstones: 0,
            myBookmarks: 0,
            availableForReview: 0,
            originalityChecks: 0,
            researchHours: 0,
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
      void fetchMessageNotifications();
      return;
    }

    setLoading(false);
  }, [fetchMessageNotifications, fetchUserData, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`app-notifications-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, async (payload) => {
        const row = (payload.new || payload.old) as Partial<ChatMessageNotificationRow>;
        if (row.receiver_id !== user.id && row.sender_id !== user.id) {
          return;
        }

        if (payload.eventType === 'INSERT' && row.receiver_id === user.id && appStateRef.current !== 'active') {
          const { data: sender } = await supabase
            .from('users')
            .select('id, full_name, email')
            .eq('id', row.sender_id)
            .maybeSingle();

          const senderName = (sender as ChatNotificationUserRow | null)?.full_name || (sender as ChatNotificationUserRow | null)?.email || 'Someone';
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `New message from ${senderName}`,
              body: row.message || 'Open the app to reply.',
              sound: true,
            },
            trigger: null,
          });
        }

        await fetchMessageNotifications();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchMessageNotifications, user]);

  const refreshUserData = useCallback(() => {
    return fetchUserData();
  }, [fetchUserData]);

  const updateUserName = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const updateStats = useCallback((newStats: Partial<AppContextType['stats']>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  }, []);

  const addRecentActivity = useCallback((activity: AppContextType['recentActivities'][number]) => {
    setRecentActivities((prev) => [activity, ...prev.slice(0, 4)]);
  }, []);

  const setThemePreference = useCallback(async (theme: ThemePreference) => {
    setThemePreferenceState(theme);
    try {
      await setStoredThemePreference(theme);
    } catch (themeError) {
      log.error('Failed to save theme preference', themeError);
    }
  }, []);

  const markAllMessageNotificationsRead = useCallback(async () => {
    if (!user) {
      return;
    }

    const previousNotifications = messageNotifications;
    const previousUnreadCount = unreadMessageCount;
    setUnreadMessageCount(0);
    setMessageNotifications([]);

    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    if (updateError) {
      setUnreadMessageCount(previousUnreadCount);
      setMessageNotifications(previousNotifications);
      throw updateError;
    }

    await Notifications.dismissAllNotificationsAsync();
    await fetchMessageNotifications();
  }, [fetchMessageNotifications, messageNotifications, unreadMessageCount, user]);

  const markMessageNotificationRead = useCallback(async (id: string) => {
    const previousNotifications = messageNotifications;
    const previousUnreadCount = unreadMessageCount;
    setMessageNotifications((current) => current.filter((item) => item.id !== id));
    setUnreadMessageCount((current) => Math.max(0, current - 1));

    const { error: updateError } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (updateError) {
      setMessageNotifications(previousNotifications);
      setUnreadMessageCount(previousUnreadCount);
      throw updateError;
    }

    await Notifications.dismissAllNotificationsAsync();
    await fetchMessageNotifications();
  }, [fetchMessageNotifications, messageNotifications, unreadMessageCount]);

  return (
    <AppContext.Provider
      value={{
        user,
        userName,
        themePreference,
        resolvedTheme,
        unreadMessageCount,
        messageNotifications,
        stats,
        recentActivities,
        loading,
        error,
        refreshUserData,
        updateUserName,
        updateStats,
        addRecentActivity,
        setThemePreference,
        refreshMessageNotifications: fetchMessageNotifications,
        markAllMessageNotificationsRead,
        markMessageNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
