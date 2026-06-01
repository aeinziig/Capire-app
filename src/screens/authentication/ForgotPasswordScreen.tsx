import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        // In a real app, you would set up a redirect URL
        // For now, we'll just simulate success
      });

      if (supabaseError) throw supabaseError;

      setSuccess('Password reset link sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
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
          Forgot Password
        </Text>
      </View>

      <View className="space-y-4">
        <Text className="text-sm text-gray-500">
          Enter your email to receive a password reset link
        </Text>

        <View className="space-y-3">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
          />

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

        <TouchableOpacity
          onPress={handleResetPassword}
          disabled={loading}
          className={`w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg ${
            loading ? 'opacity-70' : ''
          }`}
        >
          {loading ? (
            <>
              <Feather name="loader" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Sending...</Text>
            </>
          ) : (
            <Text className="text-white font-medium">Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;