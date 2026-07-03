import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootParamList, TabParamList } from '@/navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/context/AppContext';

import DashboardScreen from '@/screens/student/DashboardScreen';
import SearchScreen from '@/screens/student/SearchScreen';
import OriginalityCheckerScreen from '@/screens/student/OriginalityCheckerScreen';
import BookmarksScreen from '@/screens/student/BookmarksScreen';
import SubmitTopicScreen from '@/screens/student/SubmitTopicScreen';
import FacultyDashboardScreen from '@/screens/faculty/FacultyDashboardScreen';
import TopicReviewScreen from '@/screens/faculty/TopicReviewScreen';
import ChatbotScreen from '@/screens/shared/ChatbotScreen';
import MessagesScreen from '@/screens/shared/MessagesScreen';
import OwnProfileScreen from '@/screens/shared/OwnProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { user } = useAuth();
  const { resolvedTheme, unreadMessageCount } = useApp();
  const insets = useSafeAreaInsets();
  const role = (user?.user_metadata?.role || user?.app_metadata?.role || 'student') as string;
  const tabBarHeight = 72 + insets.bottom;
  const tabBarBottomOffset = 16 + insets.bottom;
  const tabBarClearance = tabBarHeight + tabBarBottomOffset + 16;
  const floatingButtonOffset = tabBarHeight + tabBarBottomOffset + 20;
  const colors = resolvedTheme === 'dark'
    ? {
        page: '#09120E',
        tab: '#10201A',
        line: '#27463A',
        accent: '#7BC999',
        accentText: '#08110D',
        active: '#7BC999',
        inactive: '#A8BDB2',
      }
    : {
        page: '#F8F9FA',
        tab: '#FFFFFF',
        line: '#E9ECEF',
        accent: '#2D6A4F',
        accentText: '#FFFFFF',
        active: '#2D6A4F',
        inactive: '#6C757D',
      };

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            paddingBottom: tabBarClearance,
          },
          tabBarActiveTintColor: colors.active,
          tabBarInactiveTintColor: colors.inactive,
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: tabBarBottomOffset,
            height: 64 + insets.bottom,
            borderRadius: 0,
            backgroundColor: colors.tab,
            borderTopWidth: 1,
            borderTopColor: colors.line,
            paddingTop: 8,
            paddingBottom: 8 + insets.bottom,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
        }}
      >
        {role === 'student' && (
          <>
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchScreen}
              options={{
                tabBarLabel: 'Search',
                tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
              }}
            />
            <Tab.Screen
              name="OriginalityChecker"
              component={OriginalityCheckerScreen}
              options={{
                tabBarLabel: 'Originality',
                tabBarIcon: ({ color, size }) => <Feather name="shield" size={size} color={color} />,
              }}
            />
          </>
        )}

        {role === 'faculty' && (
          <>
            <Tab.Screen
              name="FacultyDashboard"
              component={FacultyDashboardScreen}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
              }}
            />
            <Tab.Screen
              name="TopicReview"
              component={TopicReviewScreen}
              options={{
                tabBarLabel: 'Review',
                tabBarIcon: ({ color, size }) => <Feather name="clipboard" size={size} color={color} />,
              }}
            />
          </>
        )}

        <Tab.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="SubmitTopic"
          component={SubmitTopicScreen}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Bookmarks"
          component={BookmarksScreen}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            tabBarLabel: 'Messages',
            tabBarBadge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#D64545',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: '700',
            },
            tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={OwnProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
      <TouchableOpacity
        onPress={() => navigation.navigate('MainTabs', { screen: 'Chatbot' })}
        activeOpacity={0.88}
        style={{
          position: 'absolute',
          right: 24,
          bottom: floatingButtonOffset,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: '#E9C46A',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#E9C46A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <MaterialCommunityIcons name="robot-outline" size={26} color="#1B4332" />
      </TouchableOpacity>
    </View>
  );
};

export default MainTabs;
