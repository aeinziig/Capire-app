import 'nativewind/css/dist/index.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import { SplashScreen } from './screens/authentication/SplashScreen';
import { LoginScreen } from './screens/authentication/LoginScreen';
import { RegisterScreen } from './screens/authentication/RegisterScreen';
import { ForgotPasswordScreen } from './screens/authentication/ForgotPasswordScreen';
import { OTPVerificationScreen } from './screens/authentication/OTPVerificationScreen';
import { MainTabs } from './screens/MainTabs';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // Small delay to show splash screen
        setTimeout(() => {
          if (session) {
            setInitialRoute('MainTabs');
          } else {
            setInitialRoute('Login');
          }
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error checking session:', error);
        setInitialRoute('Login');
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('Login');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}