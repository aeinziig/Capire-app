import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

type Conversation = {
  id: string;
  name: string;
  avatar?: string;
};

const ChatConversationScreen: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Mock initial messages
  React.useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hi! How can I help you with your capstone project?',
        isUser: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
      },
      {
        id: '2',
        text: 'Hey! I was wondering if you could help me brainstorm topics for my computer science capstone.',
        isUser: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() // 4 minutes ago
      }
    ]);
  }, [conversation]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString() + 'b',
        text: generateBotResponse(input),
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('topic') || lowerInput.includes('idea')) {
      return "Some potential CS capstone topics: 1) AI-powered app for mental health support, 2) Blockchain-based supply chain tracker, 3) AR/VR educational tool, 4) IoT smart home energy optimizer, 5) Machine learning model for predicting stock trends. What interests you most?";
    }

    if (lowerInput.includes('help') || lowerInput.includes('assist')) {
      return "I can help with topic research, literature review, methodology suggestions, or even code reviews for your project. What do you need assistance with right now?";
    }

    return "That's interesting! Tell me more about your project goals and what you're hoping to achieve.";
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
        <TouchableOpacity
          onPress={() => {
            // Go back - in real app would use navigation.goBack()
          }}
          className="p-2"
        >
          <Feather name="chevron-left" size={24} className="text-gray-500" />
        </TouchableOpacity>

        <View className="flex items-center space-x-3">
          {conversation.avatar && (
            <View className="w-10 h-10">
              {/* In real app, would use Image component */}
              <View className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-xs font-medium text-gray-600">
                  {conversation.name.charAt(0)}
                </Text>
              </View>
            </View>
          )}
          <Text className="font-medium text-gray-800">
            {conversation.name}
          </Text>
        </View>

        <View className="p-2">
          <Feather name="more-vertical" size={24} className="text-gray-500" />
        </View>
      </View>

      <ScrollView
        className="flex-1 p-4"
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View key={index}>
            {renderMessage(message)}
          }
        ))}
      </ScrollView>

      <View className="border-t border-gray-200 p-4 bg-white">
        <View className="flex items-center space-x-3">
          <TextInput
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            className="flex-1 border border-gray-300 rounded-lg p-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-base"
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim()}
            className={`p-3 rounded-lg ${!input.trim()
              ? 'bg-gray-300'
              : 'bg-primary-600'
            }`}
          >
            <Feather
              name="send"
              size={20}
              className={`${!input.trim()
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

export default ChatConversationScreen;