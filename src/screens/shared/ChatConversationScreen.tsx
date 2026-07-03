import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '@/context/AppContext';
import type { RootParamList } from '@/navigation/types';
import { supabase } from '@/services/supabase';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
};

type ChatMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
};

type UserStatusRow = {
  id: string;
  do_not_disturb: boolean | null;
};

const ChatConversationScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const inputTextColor = '#183126';
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute();
  const { user, refreshMessageNotifications } = useApp();
  const { partnerId, partnerName } = route.params as RootParamList['ChatConversation'];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerDoNotDisturb, setPartnerDoNotDisturb] = useState(false);

  const toMessage = useCallback((message: ChatMessageRow): Message => ({
    id: message.id,
    text: message.message,
    isUser: message.sender_id === user?.id,
    timestamp: message.created_at || new Date().toISOString(),
    status: message.sender_id === user?.id
      ? (message.is_read ? 'read' : 'delivered')
      : undefined,
  }), [user?.id]);

  const fetchMessages = useCallback(async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: messageError } = await supabase
        .from('chat_messages')
        .select('id, sender_id, receiver_id, message, is_read, created_at')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (messageError) {
        throw messageError;
      }

      const rows = (data ?? []) as ChatMessageRow[];
      setMessages(rows.map(toMessage));

      const unreadIds = rows
        .filter((message) => message.receiver_id === user.id && !message.is_read)
        .map((message) => message.id);

      if (unreadIds.length > 0) {
        await supabase.from('chat_messages').update({ is_read: true }).in('id', unreadIds);
        await refreshMessageNotifications();
      }
    } catch (err) {
      setMessages([]);
      setError(err instanceof Error ? err.message : 'Failed to load conversation.');
    } finally {
      setLoading(false);
    }
  }, [partnerId, refreshMessageNotifications, toMessage, user]);

  const fetchPartnerStatus = useCallback(async () => {
    const { data, error: partnerError } = await supabase
      .from('users')
      .select('id, do_not_disturb')
      .eq('id', partnerId)
      .maybeSingle();

    if (!partnerError) {
      setPartnerDoNotDisturb(Boolean((data as UserStatusRow | null)?.do_not_disturb));
    }
  }, [partnerId]);

  useEffect(() => {
    void fetchMessages();
    void fetchPartnerStatus();

    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`chat-${user.id}-${partnerId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const message = payload.new as ChatMessageRow;
        const isConversationMessage =
          (message.sender_id === user.id && message.receiver_id === partnerId) ||
          (message.sender_id === partnerId && message.receiver_id === user.id);

        if (!isConversationMessage) {
          return;
        }

        setMessages((current) => {
          const existingIndex = current.findIndex((item) => item.id === message.id);
          if (existingIndex >= 0) {
            const next = [...current];
            next[existingIndex] = {
              ...next[existingIndex],
              ...toMessage(message),
            };
            return next;
          }

          const optimisticIndex = current.findIndex((item) => (
            item.isUser &&
            item.text === message.message &&
            (item.status === 'sending' || item.status === 'sent')
          ));

          if (optimisticIndex >= 0) {
            const next = [...current];
            next[optimisticIndex] = toMessage(message);
            return next;
          }

          return [...current, toMessage(message)];
        });

        if (message.receiver_id === user.id && !message.is_read) {
          void supabase.from('chat_messages').update({ is_read: true }).eq('id', message.id);
          void refreshMessageNotifications();
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages' }, (payload) => {
        const message = payload.new as ChatMessageRow;
        const isConversationMessage =
          (message.sender_id === user.id && message.receiver_id === partnerId) ||
          (message.sender_id === partnerId && message.receiver_id === user.id);

        if (!isConversationMessage) {
          return;
        }

        setMessages((current) => current.map((item) => (
          item.id === message.id ? { ...item, ...toMessage(message) } : item
        )));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${partnerId}` }, (payload) => {
        const profile = payload.new as UserStatusRow;
        setPartnerDoNotDisturb(Boolean(profile.do_not_disturb));
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchMessages, fetchPartnerStatus, partnerId, refreshMessageNotifications, toMessage, user]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !user) {
      return;
    }

    const { data: partnerStatus, error: partnerStatusError } = await supabase
      .from('users')
      .select('id, do_not_disturb')
      .eq('id', partnerId)
      .maybeSingle();

    if (!partnerStatusError && (partnerStatus as UserStatusRow | null)?.do_not_disturb) {
      setPartnerDoNotDisturb(true);
      setError(`${partnerName} has Do Not Disturb enabled right now.`);
      return;
    }

    const text = input.trim();
    const optimisticId = `local-${Date.now()}`;
    setInput('');
    setError(null);
    setMessages((current) => [
      ...current,
      {
        id: optimisticId,
        text,
        isUser: true,
        timestamp: new Date().toISOString(),
        status: 'sending',
      },
    ]);

    const { error: insertError } = await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: partnerId,
      message: text,
      is_read: false,
    });

    if (insertError) {
      setMessages((current) => current.filter((item) => item.id !== optimisticId));
      setInput(text);
      setError(insertError.message);
      return;
    }

    setMessages((current) => current.map((item) => (
      item.id === optimisticId ? { ...item, status: 'sent' } : item
    )));
  }, [input, partnerId, partnerName, user]);

  return (
    <AppLayout
      title={partnerName}
      subtitle="Research chat"
      headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
      scroll={false}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('OtherUserProfile', { userId: partnerId })}
          >
            <WireframeCard style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 18,
                    backgroundColor: colors.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 18 }}>{partnerName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800' }}>{partnerName}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Tap to open research profile</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.muted} />
              </View>
            </WireframeCard>
          </TouchableOpacity>

          {partnerDoNotDisturb ? (
            <WireframeCard style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.accent, fontSize: 13, fontWeight: '700' }}>
                {partnerName} has Do Not Disturb enabled right now. New messages are paused.
              </Text>
            </WireframeCard>
          ) : null}

          <WireframeCard style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 6 }}>Conversation</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              Real-time capstone discussion with delivery and read updates.
            </Text>
          </WireframeCard>

          {loading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}>
              <ActivityIndicator color={colors.accent} />
              <Text style={{ marginTop: 12, color: colors.muted }}>Loading conversation...</Text>
            </View>
          ) : (
            <>
              {messages.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: item.isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      backgroundColor: item.isUser ? colors.accent : colors.accentSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: item.isUser ? 10 : 0,
                      marginRight: item.isUser ? 0 : 10,
                    }}
                  >
                    <Text style={{ color: item.isUser ? '#FFFFFF' : colors.accent, fontSize: 12, fontWeight: '800' }}>
                      {item.isUser ? 'Y' : partnerName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ maxWidth: '78%' }}>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 11,
                        fontWeight: '700',
                        marginBottom: 6,
                        textAlign: item.isUser ? 'right' : 'left',
                      }}
                    >
                      {item.isUser ? 'You' : partnerName}
                    </Text>
                    <View
                      style={{
                        borderRadius: 22,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        backgroundColor: item.isUser ? colors.accent : colors.surface,
                        borderWidth: item.isUser ? 0 : 1,
                        borderColor: colors.line,
                      }}
                    >
                      <Text style={{ color: item.isUser ? '#FFFFFF' : colors.text, fontSize: 14, lineHeight: 20 }}>{item.text}</Text>
                      <Text style={{ color: item.isUser ? '#D8F3DC' : colors.muted, fontSize: 11, marginTop: 8 }}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {item.isUser && item.status ? ` | ${formatMessageStatus(item.status)}` : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              {messages.length === 0 ? (
                <View
                  style={{
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.line,
                    backgroundColor: colors.surface,
                    padding: 18,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>No messages yet</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>
                    Start the conversation with a research question, update, or feedback note.
                  </Text>
                </View>
              ) : null}
              {error ? (
                <Text style={{ color: colors.danger, fontSize: 12, marginTop: 8 }}>{error}</Text>
              ) : null}
            </>
          )}
        </ScrollView>

        <WireframeCard style={{ marginTop: 'auto' }}>
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: '800', marginBottom: 10 }}>Reply</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 60,
              borderRadius: 20,
              backgroundColor: '#FAFCFA',
              borderWidth: 1,
              borderColor: colors.line,
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#95A79D"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => void sendMessage()}
              editable={!partnerDoNotDisturb}
              multiline
              style={{ flex: 1, color: inputTextColor, fontSize: 14, maxHeight: 96, paddingVertical: 12 }}
            />
            <TouchableOpacity
              onPress={() => void sendMessage()}
              disabled={!input.trim() || partnerDoNotDisturb}
              activeOpacity={0.85}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: !input.trim() || partnerDoNotDisturb ? colors.accentSoft : colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            >
              <Feather name="send" size={18} color={!input.trim() || partnerDoNotDisturb ? colors.muted : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </WireframeCard>
      </View>
    </AppLayout>
  );
};

const formatMessageStatus = (status: NonNullable<Message['status']>) => (
  status.charAt(0).toUpperCase() + status.slice(1)
);

export default ChatConversationScreen;
