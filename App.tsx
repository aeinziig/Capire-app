import './global.css';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { RootParamList } from '@/navigation/types';
import SplashScreen from '@/screens/authentication/SplashScreen';
import LoginScreen from '@/screens/authentication/LoginScreen';
import RegisterScreen from '@/screens/authentication/RegisterScreen';
import ForgotPasswordScreen from '@/screens/authentication/ForgotPasswordScreen';
import OTPVerificationScreen from '@/screens/authentication/OTPVerificationScreen';
import MainTabs from '@/screens/MainTabs';
import CapstoneDetailScreen from '@/screens/student/CapstoneDetailScreen';
import ChatConversationScreen from '@/screens/shared/ChatConversationScreen';
import SettingsScreen from '@/screens/shared/SettingsScreen';
import { AppProvider, useApp } from '@/context/AppContext';
import { log } from '@/utils/logger';

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { resolvedTheme } = useApp();

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Session check timed out')), 5000);
        });
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
        if (isMounted) {
          setSession(session);
          setIsLoading(false);
        }
      } catch (error) {
        log.error('Session load failed or timed out', error);
        if (isMounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const navigationTheme = resolvedTheme === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: '#0B1611',
          card: '#10231B',
          border: '#27463A',
          text: '#F4FBF6',
          primary: '#7BC999',
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#F4F8F4',
          card: '#FFFFFF',
          border: '#DCE7DE',
          text: '#183126',
          primary: '#2D6A4F',
        },
      };

  return (
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : session ? (
            <Stack.Screen name="MainTabs" component={MainTabs} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            </>
          )}
          <Stack.Screen name="CapstoneDetail" component={CapstoneDetailScreen} />
          <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
