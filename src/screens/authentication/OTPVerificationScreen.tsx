import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import {
  AuthLayout,
  WireframeButton,
  WireframeCard,
  WireframeInput,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<RootParamList>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const wireframeColors = useWireframeTheme();
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

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccess('Verification complete. You can now sign in.');
    }, 1200);
  };

  return (
    <AuthLayout
      title="Verify email"
      subtitle="Enter the 6-digit code sent to your registered email to finish account setup."
      topNote="Step 3 of 3"
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
          We sent a one-time password to your inbox. Please enter it below to continue.
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
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
              <Text style={{ color: wireframeColors.text, fontSize: 18, fontWeight: '800' }}>{digit || '•'}</Text>
            </View>
          ))}
        </View>

        <WireframeInput
          label="Enter 6-digit code"
          icon="hash"
          value={otp}
          onChangeText={(value) => {
            const numeric = value.replace(/\D/g, '').slice(0, 6);
            setOtp(numeric);
            if (error) setError(null);
          }}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="123456"
          error={error}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: wireframeColors.muted, fontSize: 12 }}>
            {resendTimer > 0 ? `Resend in 00:${String(resendTimer).padStart(2, '0')}` : 'Didn’t get the code?'}
          </Text>
          <TouchableOpacity onPress={() => setResendTimer(60)} disabled={resendTimer > 0} activeOpacity={0.85}>
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
        onPress={handleVerify}
        disabled={loading || otp.length !== 6}
        icon="check"
      />
    </AuthLayout>
  );
};

export default OTPVerificationScreen;
