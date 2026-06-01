import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

const ChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock initial message
  React.useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I am the CAPIRE research assistant. How can I help you with your capstone project today?',
        isUser: false,
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulate API call to Gemini Flash
      // In real app, this would call your backend which then calls Gemini API
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now().toString() + 'b',
          text: generateBotResponse(input),
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error('Error sending message:', error);
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('capstone') || lowerInput.includes('project')) {
      return "I can help you brainstorm capstone project ideas, find relevant literature, or check the originality of your work. What specific aspect would you like assistance with?";
    }

    if (lowerInput.includes('originality') || lowerInput.includes('plagiarism')) {
      return "For originality checking, you can use the Originality Checker tool in the student section. Upload your document or paste your text, and I'll analyze it for similarity against academic databases.";
    }

    if (lowerInput.includes('cit') || lowerInput.includes('reference') || lowerInput.includes('bibliography')) {
      return "I can help you generate citations in various formats (APA, MLA, Chicago, etc.). Just provide the source details like title, author, publication year, and I'll format it correctly.";
    }

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! I'm here to assist with your academic research and capstone project needs. What would you like to work on today?";
    }

    return "That's an interesting question! While I'm still learning, I can help with research guidance, topic brainstorming, and general academic advice. Could you rephrase or provide more details about what you're looking for?";
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`mb-4 ${
      item.isUser ? 'ml-auto' : 'mr-auto'
    } max-w-[80%]`}>
      <View className={`${item.isUser
        ? 'bg-primary-600 text-white'
        : 'bg-gray-100 text-gray-800'
      } rounded-lg p-3 max-w-[80%] ${item.isUser
        ? 'rounded-br-none'
        : 'rounded-bl-none'
      }`}>
        <Text className="text-sm">{item.text}</Text>
        <Text className="text-xs text-opacity-70 mt-1">
          {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex items-center justify-between border-b border-gray-200 p-4">
        <Text className="text-xl font-bold text-gray-800">
          CAPIRE Assistant
        </Text>
        <TouchableOpacity className="p-2">
          <Feather name="settings" size={24} className="text-gray-500" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-4"
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View key={index}>
            {renderMessage(message)}
          </View>
        ))}

        {loading && (
          <View className="flex items-center justify-center py-4">
            <Text className="text-gray-500">Typing...</Text>
          </View>
        )}
      </ScrollView>

      <View className="border-t border-gray-200 p-4 bg-white">
        <View className="flex items-center space-x-3">
          <TextInput
            placeholder="Ask me about your capstone project..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            className={`flex-1 border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base ${
              loading ? 'opacity-50' : ''
            }`}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-lg ${loading || !input.trim()
              ? 'bg-gray-300'
              : 'bg-primary-600'
            }`}
          >
            <Feather
              name={loading ? 'loader' : 'send'}
              size={20}
              className={`${loading || !input.trim()
                ? 'text-gray-400'
                : 'text-white'
              }`}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatbotScreen;