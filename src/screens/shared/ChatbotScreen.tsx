import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
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

const ChatbotScreen: React.FC = () => {
  const wireframeColors = useWireframeTheme();
  const inputTextColor = '#183126';
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hello. I am the CAPIRE research assistant. Ask me for topic ideas, keyword suggestions, or citation help.',
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-8).map((message) => ({
        text: message.text,
        isUser: message.isUser,
      }));

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: trimmedInput,
          history,
          role: user?.user_metadata?.role || user?.app_metadata?.role || 'student',
        },
      });

      if (error || !data?.reply) {
        throw error || new Error('The assistant did not return a reply.');
      }

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}b`,
          text: data.reply,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}b`,
          text: 'I could not process that right now. Please try again in a moment.',
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="CAPIRE Assistant"
      subtitle="Wireframe-style research guidance, brainstorming, and writing support."
      headerRight={<HeaderIconButton icon="settings" />}
      scroll={false}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          <WireframeCard style={{ marginBottom: 16 }}>
            <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800', marginBottom: 6 }}>
              Assistant Brief
            </Text>
            <Text style={{ color: wireframeColors.muted, fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
              Ask for title ideas, abstract polishing, keyword suggestions, citations, or archive guidance.
            </Text>
            <Text style={{ color: wireframeColors.text, fontSize: 13, fontWeight: '800', marginBottom: 10 }}>
              Suggested prompts
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {['Give me topic ideas', 'Refine my abstract', 'Suggest keywords'].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setInput(item)}
                  activeOpacity={0.85}
                  style={{
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: wireframeColors.line,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: wireframeColors.text, fontSize: 12, fontWeight: '700' }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </WireframeCard>

          <WireframeCard style={{ marginBottom: 12 }}>
            <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800', marginBottom: 6 }}>Conversation</Text>
            <Text style={{ color: wireframeColors.muted, fontSize: 12 }}>
              AI-supported capstone guidance with live Gemini replies.
            </Text>
          </WireframeCard>

          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                flexDirection: message.isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  backgroundColor: message.isUser ? wireframeColors.accent : wireframeColors.accentSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: message.isUser ? 10 : 0,
                  marginRight: message.isUser ? 0 : 10,
                }}
              >
                <Text style={{ color: message.isUser ? '#FFFFFF' : wireframeColors.accent, fontSize: 12, fontWeight: '800' }}>
                  {message.isUser ? 'Y' : 'AI'}
                </Text>
              </View>
              <View style={{ maxWidth: '80%' }}>
                <Text
                  style={{
                    color: wireframeColors.muted,
                    fontSize: 11,
                    fontWeight: '700',
                    marginBottom: 6,
                    textAlign: message.isUser ? 'right' : 'left',
                  }}
                >
                  {message.isUser ? 'You' : 'CAPIRE Assistant'}
                </Text>
                <View
                  style={{
                    borderRadius: 22,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: message.isUser ? wireframeColors.accent : wireframeColors.surface,
                    borderWidth: message.isUser ? 0 : 1,
                    borderColor: wireframeColors.line,
                  }}
                >
                  <Text style={{ color: message.isUser ? '#FFFFFF' : wireframeColors.text, fontSize: 14, lineHeight: 20 }}>
                    {message.text}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {loading ? <Text style={{ color: wireframeColors.muted, fontSize: 12, marginBottom: 10 }}>Assistant is typing...</Text> : null}
        </ScrollView>

        <WireframeCard style={{ marginTop: 'auto' }}>
          <Text style={{ color: wireframeColors.text, fontSize: 13, fontWeight: '800', marginBottom: 10 }}>Ask CAPIRE</Text>
          <View
            style={{
              minHeight: 60,
              borderRadius: 20,
              backgroundColor: '#FAFCFA',
              borderWidth: 1,
              borderColor: wireframeColors.line,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your capstone project..."
              placeholderTextColor="#95A79D"
              multiline
              style={{ flex: 1, color: inputTextColor, fontSize: 14, maxHeight: 96, paddingVertical: 12 }}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!input.trim() || loading}
              activeOpacity={0.85}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: !input.trim() || loading ? wireframeColors.accentSoft : wireframeColors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            >
              <Feather name="send" size={18} color={!input.trim() || loading ? '#9EAEA6' : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </WireframeCard>
      </View>
    </AppLayout>
  );
};

export default ChatbotScreen;
