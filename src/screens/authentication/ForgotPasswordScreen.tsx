import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import {
  AuthLayout,
  WireframeButton,
  WireframeCard,
  WireframeInput,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootParamList>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const wireframeColors = useWireframeTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) return setError('Please enter your email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address');

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We sent a secure reset link to the address tied to your account."
        topNote="Password recovery"
        footer={
          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
            <Text style={{ color: wireframeColors.accent, textAlign: 'center', fontSize: 14, fontWeight: '700' }}>
              Back to login
            </Text>
          </TouchableOpacity>
        }
      >
        <WireframeCard style={{ alignItems: 'center', paddingVertical: 28 }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: wireframeColors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
            }}
          >
            <Feather name="mail" size={28} color={wireframeColors.accent} />
          </View>
          <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800' }}>{email}</Text>
          <Text style={{ color: wireframeColors.muted, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 21 }}>
            Open your inbox and follow the reset instructions. The link expires after 30 minutes.
          </Text>
        </WireframeCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Recover your account with a secure link sent to your institutional email."
      topNote="Need help signing in?"
      footer={
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
          <Text style={{ color: wireframeColors.accent, textAlign: 'center', fontSize: 14, fontWeight: '700' }}>
            Remembered it? Back to login
          </Text>
        </TouchableOpacity>
      }
    >
      <WireframeCard style={{ marginBottom: 18 }}>
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: wireframeColors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Feather name="lock" size={24} color={wireframeColors.accent} />
        </View>
        <Text style={{ color: wireframeColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 12 }}>
          Enter the same email you used during registration and we will send a password reset link.
        </Text>
        <WireframeInput
          label="Institutional Email"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          placeholder="name@school.edu"
        />
      </WireframeCard>

      {error ? (
        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#F0C2B6',
            backgroundColor: '#FFF3EF',
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{error}</Text>
        </View>
      ) : null}

      <WireframeButton
        label={loading ? 'Sending reset link...' : 'Send Reset Link'}
        onPress={handleResetPassword}
        disabled={loading}
        icon="send"
      />
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
