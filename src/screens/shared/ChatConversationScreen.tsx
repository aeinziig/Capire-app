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
};

type ChatMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
};

const ChatConversationScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute();
  const { user } = useApp();
  const { partnerId, partnerName } = route.params as RootParamList['ChatConversation'];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setMessages(rows.map((message) => ({
        id: message.id,
        text: message.message,
        isUser: message.sender_id === user.id,
        timestamp: message.created_at || new Date().toISOString(),
      })));

      const unreadIds = rows
        .filter((message) => message.receiver_id === user.id && !message.is_read)
        .map((message) => message.id);

      if (unreadIds.length > 0) {
        await supabase.from('chat_messages').update({ is_read: true }).in('id', unreadIds);
      }
    } catch (err) {
      setMessages([]);
      setError(err instanceof Error ? err.message : 'Failed to load conversation.');
    } finally {
      setLoading(false);
    }
  }, [partnerId, user]);

  useEffect(() => {
    void fetchMessages();

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

        setMessages((current) => (
          current.some((item) => item.id === message.id)
            ? current
            : [
                ...current,
                {
                  id: message.id,
                  text: message.message,
                  isUser: message.sender_id === user.id,
                  timestamp: message.created_at || new Date().toISOString(),
                },
              ]
        ));

        if (message.receiver_id === user.id && !message.is_read) {
          void supabase.from('chat_messages').update({ is_read: true }).eq('id', message.id);
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchMessages, partnerId, user]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !user) {
      return;
    }

    const text = input.trim();
    setInput('');
    setError(null);

    const { error: insertError } = await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: partnerId,
      message: text,
      is_read: false,
    });

    if (insertError) {
      setInput(text);
      setError(insertError.message);
    }
  }, [input, partnerId, user]);

  return (
    <AppLayout
      title={partnerName}
      subtitle="Research chat"
      headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
      headerRight={<HeaderIconButton icon="more-vertical" />}
    >
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.accent} />
          <Text style={{ marginTop: 12, color: colors.muted }}>Loading conversation...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {messages.map((item) => (
            <View key={item.id} style={{ alignSelf: item.isUser ? 'flex-end' : 'flex-start', maxWidth: '82%', marginBottom: 12 }}>
              <View
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: item.isUser ? colors.accent : colors.surface,
                  borderWidth: item.isUser ? 0 : 1,
                  borderColor: colors.line,
                }}
              >
                <Text style={{ color: item.isUser ? '#FFFFFF' : colors.text, fontSize: 14, lineHeight: 20 }}>{item.text}</Text>
                <Text style={{ color: item.isUser ? '#D8F3DC' : colors.muted, fontSize: 11, marginTop: 6 }}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}
          {error ? (
            <Text style={{ color: colors.danger, fontSize: 12, marginTop: 8 }}>{error}</Text>
          ) : null}
        </ScrollView>
      )}

      <WireframeCard style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#95A79D"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            style={{ flex: 1, color: colors.text, fontSize: 14 }}
          />
          <TouchableOpacity onPress={() => void sendMessage()} disabled={!input.trim()} activeOpacity={0.85}>
            <Feather name="send" size={18} color={!input.trim() ? colors.muted : colors.accent} />
          </TouchableOpacity>
        </View>
      </WireframeCard>
    </AppLayout>
  );
};

export default ChatConversationScreen;
