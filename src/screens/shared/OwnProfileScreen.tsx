import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const OwnProfileScreen: React.FC = () => {
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'Student',
    department: 'Computer Science',
    year: 'Senior',
    studentId: 'CS2021001',
    avatar: 'https://i.pravatar.cc/150?img=1',
    stats: {
      capstonesReviewed: 5,
      originalityChecks: 12,
      bookmarks: 8,
      researchHours: 45
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex items-center justify-between border-b border-gray-200 p-4">
        <Text className="text-xl font-bold text-gray-800">
          My Profile
        </Text>
        <TouchableOpacity className="p-2">
          <Feather name="settings" size={24} className="text-gray-500" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-6">
        <View className="items-center space-y-6">
          {/* Avatar */}
          <View className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
            <Text className="text-xs font-medium text-gray-600">
              {user.name.charAt(0)}
            </Text>
          </View>

          {/* Name and Role */}
          <View className="items-center space-y-1">
            <Text className="text-2xl font-bold text-gray-800">
              {user.name}
            </Text>
            <Text className="text-sm text-gray-500">
              {user.role} • {user.department} • {user.year}
            </Text>
          </View>

          {/* Stats */}
          <View className="w-full grid grid-cols-2 gap-4">
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

          {/* Info Section */}
          <View className="w-full space-y-4">
            <Text className="font-semibold text-gray-800">
              Account Information
            </Text>
            <View className="space-y-2">
              <View className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Feather name="mail" size={20} className="text-gray-400" />
                <Text className="text-gray-700">
                  {user.email}
                </Text>
              </View>

              <View className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Feather name="user" size={20} className="text-gray-400" />
                <Text className="text-gray-700">
                  ID: {user.studentId}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="w-full space-y-3">
            <Text className="font-semibold text-gray-800">
              Actions
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <View className="flex items-center space-x-3">
                <Feather name="edit-2" size={20} className="text-primary-600" />
                <Text className="font-medium text-gray-800">
                  Edit Profile
                </Text>
              </View>
              <Feather name="chevron-right" size={20} className="text-gray-400" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <View className="flex items-center space-x-3">
                <Feather name="log-out" size={20} className="text-red-500" />
                <Text className="font-medium text-gray-800">
                  Log Out
                </Text>
              </View>
              <Feather name="chevron-right" size={20} className="text-gray-400" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OwnProfileScreen;