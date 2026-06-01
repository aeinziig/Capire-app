import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="items-center space-y-4">
        {/* Logo */}
        <View className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center">
          <Text className="text-2xl font-bold text-primary-600">CA</Text>
        </View>

        <Text className="text-2xl font-bold text-gray-800">
          CAPIRE
        </Text>
        <Text className="text-sm text-gray-500">
          Collaborative Academic Project & Innovation Repository
        </Text>

        <ActivityIndicator size="large" color="#2EA95B" className="mt-4" />
      </View>
    </View>
  );
};

export default SplashScreen;