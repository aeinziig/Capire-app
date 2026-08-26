import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import { validateSpcbaEmail } from '@/utils/authValidation';
import {
  AuthLayout,
  WireframeButton,
  WireframeInput,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootParamList>;
const LAST_LOGIN_EMAIL_KEY = 'last_login_email';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const wireframeColors = useWireframeTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const loadSavedEmail = async () => {
      const savedEmail = await SecureStore.getItemAsync(LAST_LOGIN_EMAIL_KEY);
      if (savedEmail) setEmail(savedEmail);
    };

    void loadSavedEmail();
  }, []);

  const rememberEmail = async (value: string) => {
    if (!value.trim()) return;
    await SecureStore.setItemAsync(LAST_LOGIN_EMAIL_KEY, value.trim());
  };

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const accessToken = params.access_token;
    const refreshToken = params.refresh_token;

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') return;

    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) throw error;
    const sessionEmail = data.session?.user?.email;
    if (sessionEmail) await rememberEmail(sessionEmail);
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    return value.length >= 6 ? null : 'Password must be at least 6 characters';
  };

  const handleLogin = async () => {
    const nextEmailError = validateSpcbaEmail(email);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    setLoading(true);
    setFormError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await rememberEmail(email);
    } catch (err: unknown) {
      setFormError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setFormError(null);

    try {
      const redirectTo = makeRedirectUri({
        scheme: 'capire',
        path: 'auth',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('Google sign-in URL was not returned');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success') {
        await createSessionFromUrl(result.url);
      }
    } catch (err: unknown) {
      setFormError(mapAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Research smarter, browse capstones faster, and keep every project touchpoint in one place."
      topNote="AI-powered capstone archive and recommendation system"
      footer={
        <View>
          <Text style={{ color: wireframeColors.muted, textAlign: 'center', fontSize: 13 }}>
            New to CAPIRE?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.85}>
            <Text style={{ color: wireframeColors.accent, textAlign: 'center', fontSize: 14, fontWeight: '700', marginTop: 6 }}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text style={{ color: wireframeColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 24 }}>
        Sign in with your institutional account to continue.
      </Text>

      <WireframeInput
        label="Institutional Email"
        icon="mail"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (formError) setFormError(null);
          if (emailError) setEmailError(validateSpcbaEmail(value));
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        autoComplete="email"
        textContentType="username"
        importantForAutofill="yes"
        placeholder="12345678@spcba.edu.ph"
        error={emailError}
      />

      <WireframeInput
        label="Password"
        icon="lock"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (formError) setFormError(null);
          if (passwordError) setPasswordError(validatePassword(value));
        }}
        secureTextEntry
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        importantForAutofill="yes"
        placeholder="Enter your password"
        error={passwordError}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.85}>
        <Text style={{ color: wireframeColors.accent, textAlign: 'right', fontWeight: '700', marginBottom: 20 }}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      {formError ? (
        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: wireframeColors.danger,
            backgroundColor: wireframeColors.dangerSoft,
            padding: 14,
            marginBottom: 18,
          }}
        >
            <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{formError}</Text>
          </View>
        ) : null}

      <WireframeButton
        label={loading ? 'Signing in...' : 'Sign In'}
        onPress={handleLogin}
        disabled={loading || !email.trim() || !password.trim()}
        icon="arrow-right"
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 18 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: wireframeColors.line }} />
        <Text style={{ color: wireframeColors.muted, fontSize: 12, fontWeight: '700', marginHorizontal: 12 }}>OR</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: wireframeColors.line }} />
      </View>

      <WireframeButton
        label={googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        onPress={handleGoogleLogin}
        disabled={googleLoading || loading}
        variant="secondary"
        icon="globe"
      />
    </AuthLayout>
  );
};

export default LoginScreen;
