import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase, updateUser } from '@/services/supabase';
import type { RootParamList } from '@/navigation/types';
import { useApp, type ThemePreference } from '@/context/AppContext';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  WireframePill,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

const themeOptions: ThemePreference[] = ['light', 'dark', 'system'];

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { user, themePreference, resolvedTheme, setThemePreference } = useApp();
  const colors = useWireframeTheme();
  const doNotDisturb = Boolean(user?.user_metadata?.do_not_disturb);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', onPress: () => supabase.auth.signOut() },
    ]);
  };

  const handleToggleDoNotDisturb = async () => {
    if (!user) {
      return;
    }

    const { error } = await updateUser({
      data: {
        ...user.user_metadata,
        do_not_disturb: !doNotDisturb,
      },
    });

    if (error) {
      Alert.alert('Do Not Disturb', 'Could not update your message availability right now.');
    }
  };

  return (
    <AppLayout
      title="Settings"
      subtitle={`Theme is set to ${themePreference}. Currently showing ${resolvedTheme} mode.`}
      headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
    >
      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>Appearance</Text>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 14 }}>
          Choose light, dark, or follow the device setting.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {themeOptions.map((option) => (
            <WireframePill
              key={option}
              label={option.charAt(0).toUpperCase() + option.slice(1)}
              active={themePreference === option}
              onPress={() => setThemePreference(option)}
            />
          ))}
        </View>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>Messaging</Text>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 14 }}>
          Pause incoming chats for now. Other users will see that your profile is in do not disturb mode.
        </Text>
        <TouchableOpacity
          onPress={() => void handleToggleDoNotDisturb()}
          activeOpacity={0.85}
          style={{
            minHeight: 56,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: doNotDisturb ? colors.accent : colors.line,
            backgroundColor: colors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}>
            <Feather name={doNotDisturb ? 'moon' : 'message-circle'} size={18} color={doNotDisturb ? colors.accent : colors.muted} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Do Not Disturb</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {doNotDisturb ? 'Messages are paused.' : 'Available to receive messages.'}
              </Text>
            </View>
          </View>
          <WireframePill label={doNotDisturb ? 'On' : 'Off'} active={doNotDisturb} onPress={() => void handleToggleDoNotDisturb()} />
        </TouchableOpacity>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Account</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <Feather name="user" size={18} color={colors.accent} />
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginLeft: 12 }}>Back to Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            backgroundColor: colors.dangerSoft,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Feather name="log-out" size={18} color={colors.danger} />
          <Text style={{ color: colors.danger, fontSize: 14, fontWeight: '700', marginLeft: 12 }}>Log Out</Text>
        </TouchableOpacity>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>Legal</Text>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19, marginBottom: 14 }}>
          Review the current terms and privacy details used by the app.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LegalDocument', { document: 'terms' })}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <Feather name="file-text" size={18} color={colors.accent} />
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginLeft: 12 }}>Terms of Use</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('LegalDocument', { document: 'privacy' })}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Feather name="shield" size={18} color={colors.accent} />
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginLeft: 12 }}>Privacy Policy</Text>
        </TouchableOpacity>
      </WireframeCard>
    </AppLayout>
  );
};

export default SettingsScreen;
