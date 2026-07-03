import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  LegalDocument: { document: 'terms' | 'privacy' };
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  CapstoneDetail: { capstoneId: string };
  ChatConversation: { partnerId: string; partnerName: string };
  OtherUserProfile: { userId: string };
  Notifications: undefined;
  SubmitTopic: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  FacultyDashboard: undefined;
  Search: undefined;
  OriginalityChecker: undefined;
  Bookmarks: undefined;
  SubmitTopic: undefined;
  TopicReview: undefined;
  Chatbot: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type RootParamList = RootStackParamList;
