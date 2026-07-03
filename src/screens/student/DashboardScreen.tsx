import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList, TabParamList } from '@/navigation/types';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/services/supabase';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  WireframePill,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootParamList>
>;
type FeatherIconName = keyof typeof Feather.glyphMap;
type FeaturedResearchItem = {
  id: string;
  title: string;
  tag: string;
  score: string;
};

const quickActions = [
  { label: 'Find Capstones', icon: 'search', route: 'Search' as const },
  { label: 'Propose Topic', icon: 'edit-3', route: 'SubmitTopic' as const },
  { label: 'Bookmarks', icon: 'bookmark', route: 'Bookmarks' as const },
  { label: 'Assistant', icon: 'message-circle', route: 'Chatbot' as const },
] satisfies Array<{ label: string; icon: FeatherIconName; route: 'Search' | 'SubmitTopic' | 'Bookmarks' | 'Chatbot' }>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const wireframeColors = useWireframeTheme();
  const { userName, recentActivities, error, unreadMessageCount } = useApp();
  const [featuredResearch, setFeaturedResearch] = useState<FeaturedResearchItem[]>([]);

  useEffect(() => {
    const fetchFeaturedResearch = async () => {
      const { data, error: queryError } = await supabase
        .from('capstone_projects')
        .select('id, title, department, originalityScore')
        .order('created_at', { ascending: false })
        .limit(3);

      if (queryError || !data) {
        setFeaturedResearch([]);
        return;
      }

      setFeaturedResearch(
        data.map((item) => ({
          id: String(item.id),
          title: String(item.title || ''),
          tag: String(item.department || 'Capstone Project'),
          score:
            typeof item.originalityScore === 'number'
              ? `${item.originalityScore}% originality`
              : 'Originality pending',
        }))
      );
    };

    void fetchFeaturedResearch();
  }, []);

  return (
    <AppLayout
      title={`Hi, ${userName || 'Student'}`}
      subtitle="Continue your capstone journey with recommendations, saved work, and AI support."
      headerRight={(
        <View>
          <HeaderIconButton icon="bell" onPress={() => navigation.navigate('Notifications')} />
          {unreadMessageCount > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#D64545',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={() => navigation.navigate(action.route)}
            activeOpacity={0.85}
            style={{
              width: '48%',
              borderRadius: 22,
              backgroundColor: wireframeColors.surface,
              borderWidth: 1,
              borderColor: wireframeColors.line,
              padding: 16,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: wireframeColors.accentSoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Feather name={action.icon} size={20} color={wireframeColors.accent} />
            </View>
            <Text style={{ color: wireframeColors.text, fontSize: 14, fontWeight: '700' }}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <WireframeCard style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ color: wireframeColors.text, fontSize: 18, fontWeight: '800' }}>Recommended topics</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')} activeOpacity={0.85}>
            <Text style={{ color: wireframeColors.accent, fontSize: 13, fontWeight: '700' }}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {['AI', 'Mobile', 'Healthcare'].map((tag, index) => (
            <WireframePill key={tag} label={tag} active={index === 0} />
          ))}
        </View>
        {featuredResearch.length === 0 ? (
          <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>
            No featured capstones available yet.
          </Text>
        ) : (
          featuredResearch.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => (navigation as unknown as { navigate: (route: keyof RootParamList, params: { capstoneId: string }) => void }).navigate('CapstoneDetail', { capstoneId: item.id })}
              activeOpacity={0.85}
              style={{
                borderRadius: 18,
                backgroundColor: wireframeColors.inputBg,
                borderWidth: 1,
                borderColor: wireframeColors.line,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: wireframeColors.text, fontSize: 15, fontWeight: '800' }}>{item.title}</Text>
              <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 5 }}>{item.tag}</Text>
              <Text style={{ color: wireframeColors.accent, fontSize: 12, fontWeight: '700', marginTop: 10 }}>{item.score}</Text>
            </TouchableOpacity>
          ))
        )}
      </WireframeCard>

      <WireframeCard>
        <Text style={{ color: wireframeColors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Recent activity</Text>
        {error ? <Text style={{ color: wireframeColors.danger, fontSize: 13, marginBottom: 8 }}>{error}</Text> : null}
        {recentActivities.length === 0 ? (
          <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>
            No activity yet. Start by searching the archive or saving a project.
          </Text>
        ) : (
          recentActivities.map((activity) => (
            <View
              key={activity.id}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: wireframeColors.line,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: wireframeColors.accentSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Feather name="clock" size={16} color={wireframeColors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: wireframeColors.text, fontSize: 14, fontWeight: '700' }}>{activity.title}</Text>
                <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 4 }}>
                  {activity.department ? `${activity.department} • ` : ''}
                  {activity.time}
                </Text>
              </View>
            </View>
          ))
        )}
      </WireframeCard>
    </AppLayout>
  );
};

export default DashboardScreen;
