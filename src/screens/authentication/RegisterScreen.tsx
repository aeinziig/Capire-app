import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Picker } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (supabaseError) throw supabaseError;

      // In a real app, you might update the user metadata here
      // For now, we'll just navigate to OTP verification (simulated)
      navigation.navigate('OTPVerification');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="space-y-4">
        <Text className="text-2xl font-bold text-gray-800">
          Create Account
        </Text>
        <Text className="text-sm text-gray-500">
          Sign up to access CAPIRE features
        </Text>
      </View>

      <View className="space-y-3">
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
        />

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
        />

        {/* Role Selection */}
        <View className="border border-gray-300 rounded-lg p-4">
          <Text className="font-medium text-gray-700 mb-2">
            Role
          </Text>
          <View className="flex items-center space-x-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setRole('student')}
              className={`flex-1 p-3 rounded-lg ${role === 'student'
                ? 'bg-primary-50 border-primary-200'
                : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Text className={`text-center font-medium ${
                role === 'student' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setRole('faculty')}
              className={`flex-1 p-3 rounded-lg ${role === 'faculty'
                ? 'bg-primary-50 border-primary-200'
                : 'bg-gray-50 border-gray-300'
              }`}
            >
              <Text className={`text-center font-medium ${
                role === 'faculty' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                Faculty
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View className="p-3 bg-red-50 rounded-lg">
            <Text className="text-sm text-red-600">{error}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className={`w-full flex items-center justify-center px-4 py-2 bg-primary-600 rounded-lg ${
          loading ? 'opacity-70' : ''
        }`}
      >
        {loading ? (
          <>
            <Feather name="loader" size={16} color="white" className="mr-2" />
            <Text className="text-white font-medium">Creating account...</Text>
          </>
        ) : (
          <Text className="text-white font-medium">Sign Up</Text>
        )}
      </TouchableOpacity>

      <View className="flex justify-center items-center mt-4">
        <Text className="text-sm text-gray-500">
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={handleLogin}
          className="text-sm font-medium text-primary-600"
        >
          Sign In
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;