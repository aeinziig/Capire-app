import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootParamList>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#1B4332', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          borderWidth: 1.5,
          borderColor: '#8FD0A1',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <Text style={{ color: '#F7FCF8', fontWeight: '800', fontSize: 16 }}>SPCBA</Text>
      </View>
      <Text style={{ color: '#FFFFFF', fontSize: 42, fontWeight: '900', letterSpacing: 2 }}>CAPIRE</Text>
      <View style={{ width: 84, height: 4, borderRadius: 999, backgroundColor: '#52B788', marginVertical: 16 }} />
      <Text style={{ color: '#D8F3DC', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
        AI-Powered Capstone Archive and Topic Recommendation System
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 28 }}>
        {[0, 1, 2].map((dot) => (
          <View key={dot} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E9C46A' }} />
        ))}
      </View>
      <Text style={{ color: '#B7C9BF', fontSize: 12, marginTop: 16 }}>Loading your academic archive...</Text>
    </View>
  );
};

export default SplashScreen;
