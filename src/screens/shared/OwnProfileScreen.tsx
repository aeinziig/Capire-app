import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { supabase, updateUser } from '@/services/supabase';
import { useApp } from '@/context/AppContext';
import type { RootParamList, TabParamList } from '@/navigation/types';
import {
  AppLayout,
  HeaderIconButton,
  WireframeButton,
  WireframeCard,
  WireframeInput,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

const OwnProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const tabNavigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const wireframeColors = useWireframeTheme();
  const { user, loading, error, refreshUserData } = useApp();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const displayProfile = user?.user_metadata?.display_profile || 'Student Researcher';
  const doNotDisturb = Boolean(user?.user_metadata?.do_not_disturb);
  const userEmail = user?.email || '';
  const userStudentId = user?.user_metadata?.student_id || user?.user_metadata?.id_number || 'No ID';

  const [displayNameInput, setDisplayNameInput] = useState(userName);
  const [displayProfileInput, setDisplayProfileInput] = useState(displayProfile);

  const initials = useMemo(() => {
    const source = displayNameInput.trim() || userName;
    return source.charAt(0).toUpperCase();
  }, [displayNameInput, userName]);

  const handleSaveProfile = async () => {
    const nextDisplayName = displayNameInput.trim();
    const nextDisplayProfile = displayProfileInput.trim();

    if (!nextDisplayName) {
      setSaveError('Display name is required.');
      return;
    }

    if (!nextDisplayProfile) {
      setSaveError('Display profile is required.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { error: updateError } = await updateUser({
        data: {
          ...user?.user_metadata,
          full_name: nextDisplayName,
          name: nextDisplayName,
          display_profile: nextDisplayProfile,
        },
      });

      if (updateError) throw updateError;
      await refreshUserData();
      setSaveSuccess('Profile updated.');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Profile" subtitle="Loading your account" scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={wireframeColors.accent} />
        </View>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Profile" subtitle="Sign in required">
        <WireframeCard>
          <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>Please log in to view your profile.</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="My Profile"
      subtitle="Customize what people see beyond your sign-in email."
      headerRight={<HeaderIconButton icon="settings" onPress={() => navigation.navigate('Settings')} />}
    >
      <WireframeCard style={{ marginBottom: 16, alignItems: 'center' }}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: wireframeColors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ color: wireframeColors.accent, fontSize: 32, fontWeight: '800' }}>{initials}</Text>
        </View>
        <Text style={{ color: wireframeColors.text, fontSize: 22, fontWeight: '800' }}>{displayNameInput.trim() || userName}</Text>
        <Text style={{ color: wireframeColors.muted, fontSize: 13, marginTop: 6 }}>
          {displayProfileInput.trim() || displayProfile}
        </Text>
        <View
          style={{
            marginTop: 12,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: doNotDisturb ? wireframeColors.accent : wireframeColors.line,
            backgroundColor: wireframeColors.inputBg,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Feather name={doNotDisturb ? 'moon' : 'message-circle'} size={14} color={doNotDisturb ? wireframeColors.accent : wireframeColors.muted} />
          <Text style={{ color: doNotDisturb ? wireframeColors.accent : wireframeColors.muted, fontSize: 12, fontWeight: '700', marginLeft: 8 }}>
            {doNotDisturb ? 'Do Not Disturb enabled' : 'Available for messages'}
          </Text>
        </View>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 14 }}>Profile customization</Text>
        <WireframeInput
          label="Display Name"
          icon="edit-3"
          value={displayNameInput}
          onChangeText={(value) => {
            setDisplayNameInput(value);
            if (saveError) setSaveError(null);
            if (saveSuccess) setSaveSuccess(null);
          }}
          placeholder="How your name appears in the app"
        />
        <WireframeInput
          label="Display Profile"
          icon="tag"
          value={displayProfileInput}
          onChangeText={(value) => {
            setDisplayProfileInput(value);
            if (saveError) setSaveError(null);
            if (saveSuccess) setSaveSuccess(null);
          }}
          placeholder="Student Researcher"
        />
        {saveError ? <Text style={{ color: wireframeColors.danger, fontSize: 12, marginBottom: 12 }}>{saveError}</Text> : null}
        {saveSuccess ? <Text style={{ color: wireframeColors.accent, fontSize: 12, marginBottom: 12 }}>{saveSuccess}</Text> : null}
        <WireframeButton label={saving ? 'Saving...' : 'Save Profile'} onPress={handleSaveProfile} disabled={saving} icon="save" />
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 14 }}>My workspace</Text>
        <TouchableOpacity
          onPress={() => tabNavigation.navigate('Bookmarks')}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: wireframeColors.line,
            backgroundColor: wireframeColors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <Feather name="bookmark" size={18} color={wireframeColors.accent} />
          <Text style={{ color: wireframeColors.text, fontSize: 14, fontWeight: '700', marginLeft: 12, flex: 1 }}>
            Saved Projects
          </Text>
          <Feather name="chevron-right" size={18} color={wireframeColors.muted} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => tabNavigation.navigate('SubmitTopic')}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: wireframeColors.line,
            backgroundColor: wireframeColors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Feather name="edit-3" size={18} color={wireframeColors.accent} />
          <Text style={{ color: wireframeColors.text, fontSize: 14, fontWeight: '700', marginLeft: 12, flex: 1 }}>
            Propose Topic
          </Text>
          <Feather name="chevron-right" size={18} color={wireframeColors.muted} />
        </TouchableOpacity>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 14 }}>Account information</Text>
        {[['Email', userEmail], ['ID Number', userStudentId]].map(([label, value]) => (
          <View
            key={label}
            style={{
              borderRadius: 16,
              backgroundColor: wireframeColors.inputBg,
              borderWidth: 1,
              borderColor: wireframeColors.line,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: wireframeColors.muted, fontSize: 11, fontWeight: '700' }}>{label}</Text>
            <Text style={{ color: wireframeColors.text, fontSize: 14, marginTop: 6 }}>{value}</Text>
          </View>
        ))}
      </WireframeCard>

      <WireframeCard>
        <TouchableOpacity
          onPress={() => supabase.auth.signOut()}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            backgroundColor: wireframeColors.dangerSoft,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Feather name="log-out" size={18} color={wireframeColors.danger} />
          <Text style={{ color: wireframeColors.danger, fontSize: 14, fontWeight: '700', marginLeft: 10 }}>Log Out</Text>
        </TouchableOpacity>
        {error ? <Text style={{ color: wireframeColors.danger, fontSize: 12, marginTop: 10 }}>{error}</Text> : null}
      </WireframeCard>
    </AppLayout>
  );
};

export default OwnProfileScreen;
