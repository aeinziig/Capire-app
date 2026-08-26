import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import { makeRedirectUri } from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import { getRoleFromEmail, validateSpcbaEmail } from '@/utils/authValidation';
import {
  AuthLayout,
  WireframeButton,
  WireframeCard,
  WireframeInput,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';
type RegisterScreenNavigationProp = NativeStackNavigationProp<RootParamList>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const wireframeColors = useWireframeTheme();
  const redirectTo = makeRedirectUri({ scheme: 'capire', path: 'auth' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordError = (value: string) => {
    if (value.length < 8 || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
      return 'Password must be at least 8 characters and include a capital letter, a number, and a symbol.';
    }
    return null;
  };

  const handleRegister = async () => {
    if (!name.trim()) return setError('Please enter your full name');
    const emailError = validateSpcbaEmail(email);
    if (emailError) return setError(emailError);
    const passwordError = getPasswordError(password);
    if (passwordError) return setError(passwordError);
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!termsAccepted) return setError('Please accept the terms before continuing');

    setLoading(true);
    setError(null);

    try {
      const institutionalId = email.trim().split('@')[0];
      const role = getRoleFromEmail(email) || 'student';

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: name,
            name,
            role,
            student_id: institutionalId,
            id_number: institutionalId,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.session) {
        navigation.navigate('OTPVerification', { email: email.trim() });
        return;
      }

      navigation.navigate('MainTabs');
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your account with your institutional email."
      topNote="Step 1 of 2"
      footer={
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
          <Text style={{ color: wireframeColors.accent, textAlign: 'center', fontSize: 14, fontWeight: '700' }}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      }
    >
      <View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {[0].map((index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                backgroundColor: index === 0 ? wireframeColors.accent : '#E4ECE6',
              }}
            />
          ))}
        </View>

        <WireframeCard style={{ marginBottom: 16 }}>
          <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 16 }}>
            Personal information
          </Text>
          <WireframeInput
            label="Full Name"
            icon="user"
            value={name}
            onChangeText={setName}
            placeholder="Juan Dela Cruz"
            textContentType="name"
            autoComplete="name"
          />
          <WireframeInput
            label="Institutional Email"
            icon="mail"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) setError(null);
            }}
            placeholder="12345678@spcba.edu.ph"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            autoComplete="email"
            importantForAutofill="yes"
          />
        </WireframeCard>

        <WireframeCard>
          <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 16 }}>
            Account security
          </Text>
          <WireframeInput
            label="Password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCorrect={false}
            placeholder="Minimum 8 characters"
            textContentType="newPassword"
            autoComplete="new-password"
            importantForAutofill="yes"
          />
          <WireframeInput
            label="Confirm Password"
            icon="check-circle"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCorrect={false}
            placeholder="Re-enter password"
            textContentType="newPassword"
            autoComplete="new-password"
            importantForAutofill="yes"
          />
        </WireframeCard>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 18 }}>
          <Checkbox value={termsAccepted} onValueChange={setTermsAccepted} color={termsAccepted ? wireframeColors.accent : undefined} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ color: wireframeColors.muted, fontSize: 13, lineHeight: 19 }}>
              I agree to the{' '}
              <Text style={{ color: wireframeColors.accent, fontWeight: '700' }} onPress={() => navigation.navigate('LegalDocument', { document: 'terms' })}>
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text style={{ color: wireframeColors.accent, fontWeight: '700' }} onPress={() => navigation.navigate('LegalDocument', { document: 'privacy' })}>
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>

        {error ? (
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
            <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{error}</Text>
          </View>
        ) : null}

        <WireframeButton
          label={loading ? 'Creating account...' : 'Create account'}
          onPress={handleRegister}
          disabled={loading}
          icon="arrow-right"
        />
      </View>
    </AuthLayout>
  );
};

export default RegisterScreen;
