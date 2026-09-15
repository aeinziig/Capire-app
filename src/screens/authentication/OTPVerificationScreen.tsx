import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { makeRedirectUri } from 'expo-auth-session';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import {
  AuthLayout,
  WireframeButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<RootParamList>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute();
  const wireframeColors = useWireframeTheme();
  const { email } = route.params as RootParamList['OTPVerification'];
  const redirectTo = makeRedirectUri({ scheme: 'capire', path: 'auth' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer === 0) return;
    const timer = setTimeout(() => setResendTimer((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendEmail = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (resendError) throw resendError;

      setResendTimer(60);
      setSuccess('A new confirmation email has been sent. Open the link in your email to confirm your account.');
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify email"
      subtitle="Open the confirmation link in your email to finish account setup."
      topNote="Step 2 of 2"
      footer={
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
          <Text style={{ color: wireframeColors.accent, textAlign: 'center', fontSize: 14, fontWeight: '700' }}>
            Back to login
          </Text>
        </TouchableOpacity>
      }
    >
      <WireframeCard style={{ marginBottom: 18 }}>
        <View
          style={{
            width: 82,
            height: 82,
            borderRadius: 41,
            backgroundColor: wireframeColors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <Feather name="mail" size={28} color={wireframeColors.accent} />
        </View>

        <Text style={{ color: wireframeColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 16 }}>
          We sent a confirmation email to {email}. Tap the confirmation link, then return to Capire and sign in.
        </Text>
        <Text style={{ color: wireframeColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 16 }}>
          If you don’t see the email, check your spam or junk folder.
        </Text>

        {error ? (
          <Text accessibilityRole="alert" style={{ color: wireframeColors.danger, fontSize: 13, marginBottom: 16 }}>{error}</Text>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: wireframeColors.muted, fontSize: 12 }}>
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Didn't get the email?"}
          </Text>
          <TouchableOpacity
            onPress={() => void handleResendEmail()}
            disabled={resendTimer > 0 || loading}
            accessibilityRole="button"
            accessibilityLabel="Resend confirmation email"
            accessibilityState={{ disabled: resendTimer > 0 || loading, busy: loading }}
            activeOpacity={0.85}
            style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
          >
            <Text style={{ color: resendTimer > 0 || loading ? wireframeColors.muted : wireframeColors.accent, fontSize: 12, fontWeight: '700' }}>
              {loading ? 'Sending...' : 'Resend email'}
            </Text>
          </TouchableOpacity>
        </View>
      </WireframeCard>

      {success ? (
        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#C5E2CE',
            backgroundColor: '#F1FAF3',
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Text accessibilityLiveRegion="polite" style={{ color: wireframeColors.accent, fontSize: 13 }}>{success}</Text>
        </View>
      ) : null}

      <WireframeButton
        label="Continue to sign in"
        onPress={() => navigation.navigate('Login')}
        icon="arrow-right"
      />
    </AuthLayout>
  );
};

export default OTPVerificationScreen;
