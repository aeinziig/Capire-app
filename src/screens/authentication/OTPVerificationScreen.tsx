import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  const otpInputRef = useRef<TextInput | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer === 0) return;
    const timer = setTimeout(() => setResendTimer((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const otpSlots = useMemo(() => Array.from({ length: 6 }, (_, index) => otp[index] || ''), [otp]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (verifyError) throw verifyError;

      setLoading(false);
      setSuccess('Verification complete. You can now sign in.');
      setTimeout(() => navigation.navigate('Login'), 600);
    } catch (err: unknown) {
      setLoading(false);
      setError(mapAuthError(err));
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) throw resendError;

      setResendTimer(60);
      setSuccess('A new verification code has been sent.');
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify email"
      subtitle="Enter the 6-digit code sent to your registered email to finish account setup."
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
          <Feather name="shield" size={28} color={wireframeColors.accent} />
        </View>

        <Text style={{ color: wireframeColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 16 }}>
          We sent a one-time password to {email}. Please enter it below to continue.
        </Text>

        <TouchableOpacity activeOpacity={1} onPress={() => otpInputRef.current?.focus()} style={{ marginBottom: 16 }}>
          <TextInput
            ref={otpInputRef}
            value={otp}
            onChangeText={(value) => {
              const numeric = value.replace(/\D/g, '').slice(0, 6);
              setOtp(numeric);
              if (error) setError(null);
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            caretHidden
            style={{
              position: 'absolute',
              opacity: 0,
              width: 1,
              height: 1,
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {otpSlots.map((digit, index) => (
              <View
                key={index}
                style={{
                  width: 44,
                  height: 56,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: digit ? wireframeColors.accent : wireframeColors.line,
                  backgroundColor: '#FAFCFA',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#183126', fontSize: 18, fontWeight: '800' }}>{digit || ''}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {error ? (
          <Text style={{ color: wireframeColors.danger, fontSize: 13, marginBottom: 16 }}>{error}</Text>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: wireframeColors.muted, fontSize: 12 }}>
            {resendTimer > 0 ? `Resend in 00:${String(resendTimer).padStart(2, '0')}` : "Didn't get the code?"}
          </Text>
          <TouchableOpacity onPress={() => void handleResendCode()} disabled={resendTimer > 0 || loading} activeOpacity={0.85}>
            <Text style={{ color: resendTimer > 0 ? '#96AAA0' : wireframeColors.accent, fontSize: 12, fontWeight: '700' }}>
              Resend Code
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
          <Text style={{ color: wireframeColors.accent, fontSize: 13 }}>{success}</Text>
        </View>
      ) : null}

      <WireframeButton
        label={loading ? 'Verifying...' : 'Verify and Continue'}
        onPress={() => void handleVerify()}
        disabled={loading || otp.length !== 6}
        icon="check"
      />
    </AuthLayout>
  );
};

export default OTPVerificationScreen;
