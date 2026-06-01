import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OTPVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigation = useNavigation();

  // Simulate OTP verification (in real app, this would check with Supabase or backend)
  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      // In real app, verify against Supabase
      setLoading(false);
      setSuccess('Email verified successfully!');

      // Navigate to main tabs after successful verification
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 1500);
    }, 1500);
  };

  const handleResend = () => {
    // Simulate resending OTP
    setSuccess('New verification code sent!');
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex justify-between items-start mb-4">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Feather name="chevron-left" size={24} className="text-gray-500" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">
          Verify Email
        </Text>
      </View>

      <View className="space-y-6">
        <View className="space-y-3">
          <Text className="text-sm text-gray-500">
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </Text>

          <View className="flex space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View key={index} className="flex-1">
                <TextInput
                  maxLength={1}
                  value={otp[index] || ''}
                  onChangeText={(text) => {
                    const newOtp = otp.split('');
                    newOtp[index] = text || '';
                    setOtp(newOtp.join(''));

                    // Auto-focus next input
                    if (text && index < 5) {
                      // In real app, would use refs to focus next input
                    }
                  }}
                  keyboardType="number-pad"
                  autoFocus={index === 0}
                  className={`border border-gray-300 rounded-lg p-4 text-center font-medium ${
                    otp.length >= index + 1 ? 'border-primary-500' : 'border-gray-300'
                  }`}
                />
              </View>
            ))}
          </View>

          {error && (
            <View className="p-3 bg-red-50 rounded-lg">
              <Text className="text-sm text-red-600">{error}</Text>
            </View>
          )}

          {success && (
            <View className="p-3 bg-green-50 rounded-lg">
              <Text className="text-sm text-green-600">{success}</Text>
            </View>
          )}
        </View>

        <View className="space-y-3">
          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading || otp.length !== 6}
            className={`w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg ${
              loading || otp.length !== 6 ? 'opacity-70' : ''
            }`}
          >
            {loading ? (
              <>
                <Feather name="loader" size={16} color="white" className="mr-2" />
                <Text className="text-white font-medium">Verifying...</Text>
              </>
            ) : (
              <Text className="text-white font-medium">Verify Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResend}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-500"
          >
            Didn't receive the code? Resend
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OTPVerificationScreen;