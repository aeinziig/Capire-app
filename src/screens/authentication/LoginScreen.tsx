import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      // Navigate based on user role (in real app, check user metadata)
      navigation.replace('MainTabs');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View className="flex-1 bg-white p-6 space-y-4">
      <View className="space-y-4">
        <Text className="text-2xl font-bold text-gray-800">
          Welcome Back
        </Text>
        <Text className="text-sm text-gray-500">
          Sign in to your CAPIRE account
        </Text>
      </View>

      <View className="space-y-3">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
        />

        {error && (
          <View className="p-3 bg-red-50 rounded-lg">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg ${
          loading ? 'opacity-70' : ''
        }`}
      >
        {loading ? (
          <>
            <Feather name="loader" size={16} color="white" className="mr-2" />
            <Text className="text-white font-medium">Logging in...</Text>
          </>
        ) : (
          <Text className="text-white font-medium">Sign In</Text>
        )}
      </TouchableOpacity>

      <View className="flex justify-center items-center space-x-4">
        <TouchableOpacity
          onPress={handleForgotPassword}
          className="text-sm text-gray-600"
        >
          Forgot Password?
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRegister}
          className="text-sm font-medium text-primary-600"
        >
          Create Account
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;