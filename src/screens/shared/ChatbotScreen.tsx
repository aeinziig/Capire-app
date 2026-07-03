import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
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

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('capstone') || lowerInput.includes('project')) {
      return 'Start with the problem, target users, and technology stack. I can help narrow that into a workable scope.';
    }
    if (lowerInput.includes('originality') || lowerInput.includes('plagiarism')) {
      return 'Use the originality checker after you define the title and abstract. I can help rewrite overlapping phrasing too.';
    }
    if (lowerInput.includes('cit') || lowerInput.includes('reference') || lowerInput.includes('bibliography')) {
      return 'Send the author, year, title, and source type and I can help format the reference.';
    }
    return 'Share your topic area, users, and desired output, and I will help shape a better capstone direction.';
  };

  const sendMessage = () => {
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

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}b`,
          text: generateBotResponse(trimmedInput),
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 700);
  };

  return (
    <AppLayout
      title="CAPIRE Assistant"
      subtitle="Wireframe-style research guidance, brainstorming, and writing support."
      headerRight={<HeaderIconButton icon="settings" />}
    >
      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>
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

      {messages.map((message) => (
        <View
          key={message.id}
          style={{
            alignSelf: message.isUser ? 'flex-end' : 'flex-start',
            maxWidth: '86%',
            marginBottom: 10,
          }}
        >
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
      ))}

      {loading ? <Text style={{ color: wireframeColors.muted, fontSize: 12, marginBottom: 10 }}>Assistant is typing...</Text> : null}

      <WireframeCard style={{ marginTop: 6 }}>
        <View
          style={{
            minHeight: 56,
            borderRadius: 18,
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
            style={{ flex: 1, color: wireframeColors.text, fontSize: 14 }}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} disabled={!input.trim() || loading} activeOpacity={0.85}>
            <Feather name="send" size={18} color={!input.trim() || loading ? '#9EAEA6' : wireframeColors.accent} />
          </TouchableOpacity>
        </View>
      </WireframeCard>
    </AppLayout>
  );
};

export default ChatbotScreen;
