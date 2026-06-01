import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

type StatItem = {
  label: string;
  value: string | number;
  icon: string;
  color: string;
};

type QuickAction = {
  label: string;
  icon: string;
};

type RecentActivity = {
  id: number;
  title: string;
  type: 'capstone' | 'research' | 'bookmark';
  time: string;
  department?: string;
};

const DashboardScreen: React.FC = () => {
  const userName = 'Alex Johnson'; // In real app, this would come from auth state

  const stats: StatItem[] = [
    {
      label: 'Capstones Reviewed',
      value: 5,
      icon: 'edit-2',
      color: '#2EA95B'
    },
    {
      label: 'Originality Checks',
      value: 12,
      icon: 'shield',
      color: '#FBBF24'
    },
    {
      label: 'Bookmarked Items',
      value: 8,
      icon: 'bookmark',
      color: '#3B82F6'
    },
    {
      label: 'Research Hours',
      value: '45h',
      icon: 'clock',
      color: '#8B5CF6'
    }
  ];

  const quickActions: QuickAction[] = [
    { label: 'Start Check', icon: 'play-circle' },
    { label: 'Upload Document', icon: 'upload' },
    { label: 'Search Capstones', icon: 'search' },
    { label: 'View Bookmarks', icon: 'bookmark' }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      title: 'Reviewed: AI Applications in Early Cancer Detection',
      type: 'capstone',
      time: '2 hours ago',
      department: 'Computer Science'
    },
    {
      id: 2,
      title: 'Checked originality for literature review section',
      type: 'research',
      time: '5 hours ago'
    },
    {
      id: 3,
      title: 'Blockchain Technology for Secure Voting Systems',
      type: 'bookmark',
      time: '1 day ago',
      department: 'Political Science'
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="p-4" contentContainerClassName="pb-8">
        {/* Welcome Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Welcome back, {userName}!
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Ready to work on your capstone project?
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <View key={index} className="p-4 bg-gray-50 rounded-lg">
              <View className="flex items-center justify-between mb-2">
                <View className="flex items-center space-x-2">
                  <Feather name={stat.icon} size={20} className={`${stat.color}-600`} />
                  <Text className="font-medium text-gray-700">
                    {stat.label}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </Text>
              </View>
              <View className="h-0.5 bg-gray-200" />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-3">
            Quick Actions
          </Text>
          <View className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                className="p-4 bg-gray-50 rounded-lg flex items-center justify-center"
              >
                <Feather name={action.icon} size={24} className="text-gray-400" />
                <Text className="mt-2 text-xs text-center text-gray-600">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-800 mb-3">
            Recent Activity
          </Text>
          <View className="space-y-3">
            {recentActivities.map((activity, index) => (
              <View key={index} className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                <View className="w-3 h-3 rounded-full">
                  {activity.type === 'capstone' && <View className="bg-primary-500" />}
                  {activity.type === 'research' && <View className="bg-amber-500" />}
                  {activity.type === 'bookmark' && <View className="bg-blue-500" />}
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    {activity.title}
                  </Text>
                  {activity.department && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {activity.department}
                    )
                  )}
                </View>
                <Text className="text-xs text-gray-400">
                  {activity.time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;