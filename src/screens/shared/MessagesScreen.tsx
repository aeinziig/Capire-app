import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/services/supabase';
import type { RootParamList } from '@/navigation/types';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type Conversation = {
  id: string;
  partnerId: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
};

type ChatMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
};

type UserRow = {
  id: string;
  full_name: string | null;
  email: string;
};

const MessagesScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { user } = useApp();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: messageError } = await supabase
        .from('chat_messages')
        .select('id, sender_id, receiver_id, message, is_read, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messageError) {
        throw messageError;
      }

      const messages = (data ?? []) as ChatMessageRow[];
      const partnerIds = [...new Set(messages.map((message) => (
        message.sender_id === user.id ? message.receiver_id : message.sender_id
      )))];

      let usersById = new Map<string, UserRow>();
      if (partnerIds.length > 0) {
        const { data: partnerData, error: partnerError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', partnerIds);

        if (partnerError) {
          throw partnerError;
        }

        usersById = new Map(((partnerData ?? []) as UserRow[]).map((partner) => [partner.id, partner]));
      }

      const nextConversations = new Map<string, Conversation>();

      messages.forEach((message) => {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        if (!partnerId) {
          return;
        }

        const existing = nextConversations.get(partnerId);
        if (!existing) {
          const partner = usersById.get(partnerId);
          nextConversations.set(partnerId, {
            id: partnerId,
            partnerId,
            name: partner?.full_name || partner?.email || `User ${partnerId.slice(0, 8)}`,
            lastMessage: message.message,
            time: message.created_at
              ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
            unreadCount: message.receiver_id === user.id && !message.is_read ? 1 : 0,
          });
          return;
        }

        if (message.receiver_id === user.id && !message.is_read) {
          existing.unreadCount += 1;
        }
      });

      setConversations(Array.from(nextConversations.values()));
    } catch (err) {
      setConversations([]);
      setError(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchConversations();

    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`messages-list-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        const row = (payload.new || payload.old) as Partial<ChatMessageRow>;
        if (row.sender_id === user.id || row.receiver_id === user.id) {
          void fetchConversations();
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchConversations, user]);

  if (loading) {
    return (
      <AppLayout title="Messages" subtitle="Loading conversations" scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.accent} />
          <Text style={{ marginTop: 12, color: colors.muted }}>Loading messages...</Text>
        </View>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Messages" subtitle="Conversation feed">
        <WireframeCard>
          <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Messages" subtitle="Sign in required">
        <WireframeCard>
          <Text style={{ color: colors.muted, fontSize: 13 }}>Please log in to access messages.</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Messages"
      subtitle="Academic conversations and follow-ups"
      headerRight={<HeaderIconButton icon="search" />}
    >
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={(
          <WireframeCard>
            <Text style={{ color: colors.muted, fontSize: 13 }}>No conversations yet.</Text>
          </WireframeCard>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('ChatConversation', {
              partnerId: item.partnerId,
              partnerName: item.name,
            })}
          >
            <WireframeCard style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 16,
                    backgroundColor: colors.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ color: colors.accent, fontWeight: '800' }}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>{item.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{item.lastMessage}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>{item.time}</Text>
                  {item.unreadCount > 0 ? (
                    <View
                      style={{
                        minWidth: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.accent,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                        marginTop: 8,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{item.unreadCount}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </WireframeCard>
          </TouchableOpacity>
        )}
      />
    </AppLayout>
  );
};

export default MessagesScreen;
