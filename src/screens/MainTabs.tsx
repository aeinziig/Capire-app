import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { RootParamList } from './navigation/types';

// Student tabs
import DashboardScreen from './student/DashboardScreen';
import SearchScreen from './student/SearchScreen';
import CapstoneDetailScreen from './student/CapstoneDetailScreen';
import OriginalityCheckerScreen from './student/OriginalityCheckerScreen';
import BookmarksScreen from './student/BookmarksScreen';

// Faculty tabs
import TopicReviewScreen from './faculty/TopicReviewScreen';

// Shared tabs
import ChatbotScreen from './shared/ChatbotScreen';
import MessagesScreen from './shared/MessagesScreen';
import OwnProfileScreen from './shared/OwnProfileScreen';

const Tab = createBottomTabNavigator();

// Helper function to determine user role (simplified for demo)
const getUserRole = () => {
  // In real app, this would come from auth state/Supabase
  // For demo, we'll return 'student' as default
  return 'student';
};

const MainTabs: React.FC = () => {
  const role = getUserRole();

  return (
    <View className="flex-1 bg-white">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#2EA95B',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderColor: '#E5E7EB',
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500' as const,
          },
        })}
      >
        {/* Student Tabs */}
        {role === 'student' && (
          <>
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarLabel: 'Dashboard',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="home" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchScreen}
              options={{
                tabBarLabel: 'Search',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="search" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="CapstoneDetail"
              component={CapstoneDetailScreen}
              options={{
                tabBarLabel: 'Capstones',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="book-open" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="OriginalityChecker"
              component={OriginalityCheckerScreen}
              options={{
                tabBarLabel: 'Originality',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="shield" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Bookmarks"
              component={BookmarksScreen}
              options={{
                tabBarLabel: 'Bookmarks',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="bookmark" size={size} color={color} />
                ),
              }}
            />
          </>
        )}

        {/* Faculty Tabs */}
        {role === 'faculty' && (
          <>
            <Tab.Screen
              name="TopicReview"
              component={TopicReviewScreen}
              options={{
                tabBarLabel: 'Review',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="edit-2" size={size} color={color} />
                ),
              }}
            />
          </>
        )}

        {/* Shared Tabs (visible to both roles) */}
        <Tab.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{
            tabBarLabel: 'Assistant',
            tabBarIcon: ({ color, size }) => (
              <Feather name="robot" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            tabBarLabel: 'Messages',
            tabBarIcon: ({ color, size }) => (
              <Feather name="message-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={OwnProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default MainTabs;