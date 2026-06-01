import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar?: string; // URL or local asset
};

const MessagesScreen: React.FC = () => {
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      lastMessage: 'Have you looked at the latest research on neural networks?',
      time: '2:30 PM',
      unreadCount: 2,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'Research Group Chat',
      lastMessage: 'Meeting tomorrow at 10 AM in room 205',
      time: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Dr. Smith',
      lastMessage: 'Your capstone proposal looks good. Just need to add more references.',
      time: 'Monday',
      unreadCount: 1,
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  ];

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      className="p-4 border-b border-gray-100"
    >
      <View className="flex justify-between items-start">
        <View className="flex items-start space-x-3">
          {item.avatar && (
            <View className="w-10 h-10">
              {/* In real app, would use Image component */}
              <View className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                <Text className="text-xs font-medium text-gray-600">
                  {item.name.charAt(0)}
                </Text>
              </View>
            </View>
          )}
          <View className="flex-1">
            <Text className="font-medium text-gray-800">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500 line-clamp-1">
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <View className="items-end space-x-2">
          {item.unreadCount > 0 && (
            <View className={`w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium`}>
              {item.unreadCount}
            </View>
          )}
          <Text className="text-xs text-gray-400">
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex items-center justify-between border-b border-gray-200 p-4">
        <Text className="text-xl font-bold text-gray-800">
          Messages
        </Text>
        <TouchableOpacity className="p-2">
          <Feather name="search" size={24} className="text-gray-500" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MessagesScreen;