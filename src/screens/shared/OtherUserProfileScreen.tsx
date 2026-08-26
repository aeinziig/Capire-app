import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '@/services/supabase';
import type { RootParamList } from '@/navigation/types';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type OtherUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  department: string | null;
  role: string | null;
  do_not_disturb: boolean | null;
};

const OtherUserProfileScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute();
  const { userId } = route.params as RootParamList['OtherUserProfile'];
  const [user, setUser] = useState<OtherUserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, department, role, do_not_disturb')
      .eq('id', userId)
      .maybeSingle();

    if (userError?.message?.includes('do_not_disturb')) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('users')
        .select('id, email, full_name, department, role')
        .eq('id', userId)
        .maybeSingle();

      if (fallbackError) {
        setError(fallbackError.message);
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(fallbackData ? { ...(fallbackData as Omit<OtherUserRow, 'do_not_disturb'>), do_not_disturb: false } : null);
      setLoading(false);
      return;
    }

    if (userError) {
      setError(userError.message);
      setUser(null);
      setLoading(false);
      return;
    }

    setUser((data as OtherUserRow | null) ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const displayName = user?.full_name || user?.email || 'User';
  const subtitleBits = [user?.role, user?.department].filter(Boolean);
  const isDoNotDisturb = Boolean(user?.do_not_disturb);

  if (loading) {
    return (
      <AppLayout title="User Profile" subtitle="Loading profile" headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />} scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </AppLayout>
    );
  }

  if (error || !user) {
    return (
      <AppLayout title="User Profile" subtitle="Profile unavailable" headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}>
        <WireframeCard>
          <Text style={{ color: colors.danger, fontSize: 13 }}>{error || 'Could not load this profile.'}</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="User Profile" subtitle="Research profile and message availability" headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}>
      <WireframeCard style={{ marginBottom: 16, alignItems: 'center' }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 28 }}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{displayName}</Text>
        {subtitleBits.length > 0 ? (
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>{subtitleBits.join(' • ')}</Text>
        ) : null}
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{user.email}</Text>
        <View
          style={{
            marginTop: 12,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: isDoNotDisturb ? colors.accent : colors.line,
            backgroundColor: colors.inputBg,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Feather name={isDoNotDisturb ? 'moon' : 'message-circle'} size={14} color={isDoNotDisturb ? colors.accent : colors.muted} />
          <Text style={{ color: isDoNotDisturb ? colors.accent : colors.muted, fontSize: 12, fontWeight: '700', marginLeft: 8 }}>
            {isDoNotDisturb ? 'Do Not Disturb enabled' : 'Available for messages'}
          </Text>
        </View>
      </WireframeCard>

      <WireframeCard>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isDoNotDisturb}
          onPress={() => navigation.navigate('ChatConversation', { partnerId: user.id, partnerName: displayName })}
          style={{
            minHeight: 52,
            borderRadius: 18,
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.line,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            opacity: isDoNotDisturb ? 0.65 : 1,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="message-circle" size={18} color={colors.accent} />
            <Text style={{ color: colors.text, fontWeight: '700', marginLeft: 10 }}>
              {isDoNotDisturb ? 'Messaging Paused' : 'Send Message'}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </TouchableOpacity>
      </WireframeCard>
    </AppLayout>
  );
};

export default OtherUserProfileScreen;
