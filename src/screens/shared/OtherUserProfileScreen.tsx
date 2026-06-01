import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

type OtherUserProfileProps = {
  userId: string;
};

const OtherUserProfileScreen: React.FC<OtherUserProfileProps> = ({ userId }) => {
  // In real app, this data would come from Supabase based on userId
  const user = {
    name: 'Maria Garcia',
    email: 'maria.garcia@university.edu',
    role: 'Student',
    department: 'Urban Planning',
    year: 'Junior',
    studentId: 'UP2022045',
    avatar: 'https://i.pravatar.cc/150?img=2',
    stats: {
      capstonesReviewed: 3,
      originalityChecks: 7,
      bookmarks: 5,
      researchHours: 28
    },
    bio: 'Passionate about sustainable urban development and smart city technologies. Currently working on my capstone about AI-driven traffic management systems.',
    publications: [
      'Smart Cities Journal, March 2023: "IoT Applications in Urban Planning"',
      'Urban Planning Review, January 2023: "Green Spaces in Metropolitan Areas"'
    ]
  };

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

        <Text className="text-xl font-bold text-gray-800">
          User Profile
        </Text>
      </View>

      <ScrollView className="p-6">
        <View className="space-y-6">
          {/* Header with Avatar and Info */}
          <View className="flex items-center space-x-4">
            {/* Avatar */}
            <View className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <Text className="text-xs font-medium text-gray-600">
                {user.name.charAt(0)}
              </Text>
            </View>

            <View className="flex-1">
              <View className="flex justify-between items-start mb-1">
                <Text className="text-xl font-bold text-gray-800">
                  {user.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {user.role} • {user.department} • {user.year}
                </Text>
              </View>

              <View className="space-y-1">
                <Text className="text-gray-600">
                  {user.email}
                </Text>
                <Text className="text-sm text-gray-500">
                  ID: {user.studentId}
                </Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View className="space-y-3">
            <Text className="font-semibold text-gray-800">
              About
            </Text>
            <Text className="text-gray-700 leading-relaxed">
              {user.bio}
            </Text>
          </View>

          {/* Stats */}
          <View className="space-y-3">
            <Text className="font-semibold text-gray-800">
              Activity Stats
            </Text>
            <View className="grid grid-cols-2 gap-4">
              <View className="p-4 bg-gray-50 rounded-lg text-center">
                <Text className="text-2xl font-bold text-primary-600">
                  {user.stats.capstonesReviewed}
                </Text>
                <Text className="text-sm text-gray-600">
                  Capstones Reviewed
                </Text>
              </View>

              <View className="p-4 bg-gray-50 rounded-lg text-center">
                <Text className="text-2xl font-bold text-primary-600">
                  {user.stats.originalityChecks}
                </Text>
                <Text className="text-sm text-gray-600">
                  Originality Checks
                </Text>
              </View>

              <View className="p-4 bg-gray-50 rounded-lg text-center">
                <Text className="text-2xl font-bold text-primary-600">
                  {user.stats.bookmarks}
                </Text>
                <Text className="text-sm text-gray-600">
                  Bookmarks
                </Text>
              </View>

              <View className="p-4 bg-gray-50 rounded-lg text-center">
                <Text className="text-2xl font-bold text-primary-600">
                  {user.stats.researchHours}h
                </Text>
                <Text className="text-sm text-gray-600">
                  Research Hours
                </Text>
              </View>
            </View>
          </View>

          {/* Publications */}
          <View className="space-y-3">
            <Text className="font-semibold text-gray-800">
              Publications
            </Text>
            <View className="space-y-2">
              {user.publications.map((pub, index) => (
                <View key={index} className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-sm text-gray-700">
                    {pub}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-4">
            <Text className="font-semibold text-gray-800">
              Actions
            </Text>

            <View className="space-y-2">
              <TouchableOpacity
                activeOpacity={0.7}
                className="p-4 bg-primary-50 rounded-lg flex items-center justify-between"
              >
                <View className="flex items-center space-x-3">
                  <Feather name="message-circle" size={20} className="text-primary-600" />
                  <Text className="font-medium text-gray-800">
                    Send Message
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} className="text-gray-400" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                className="p-4 bg-primary-50 rounded-lg flex items-center justify-between"
              >
                <View className="flex items-center space-x-3">
                  <Feather name="bookmark" size={20} className="text-primary-600" />
                  <Text className="font-medium text-gray-800">
                    View Bookmarks
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} className="text-gray-400" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OtherUserProfileScreen;