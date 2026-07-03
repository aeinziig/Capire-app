import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { supabase } from '@/services/supabase';
import type { TabParamList } from '@/navigation/types';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type FacultyDashboardNavigationProp = BottomTabNavigationProp<TabParamList, 'FacultyDashboard'>;

type FacultyStats = {
  pending: number;
  approved: number;
  needsRevision: number;
  rejected: number;
};

const statusCards = [
  { key: 'pending', label: 'Pending', icon: 'clock', color: '#D4A017', soft: '#FFF7E5' },
  { key: 'approved', label: 'Approved', icon: 'check-circle', color: '#40916C', soft: '#EAF6ED' },
  { key: 'needsRevision', label: 'Needs Revision', icon: 'edit-3', color: '#F4A261', soft: '#FFF7E5' },
  { key: 'rejected', label: 'Rejected', icon: 'x-circle', color: '#E76F51', soft: '#FFF3EF' },
] as const;

const FacultyDashboardScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const navigation = useNavigation<FacultyDashboardNavigationProp>();
  const [stats, setStats] = useState<FacultyStats>({
    pending: 0,
    approved: 0,
    needsRevision: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase.from('capstone_projects').select('status');
      if (queryError) throw queryError;

      const nextStats = (data || []).reduce<FacultyStats>(
        (totals, item: { status?: string | null }) => {
          if (item.status === 'approved') totals.approved += 1;
          else if (item.status === 'needs_revision') totals.needsRevision += 1;
          else if (item.status === 'rejected') totals.rejected += 1;
          else totals.pending += 1;
          return totals;
        },
        { pending: 0, approved: 0, needsRevision: 0, rejected: 0 }
      );

      setStats(nextStats);
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Faculty Dashboard" subtitle="Loading review queue" scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.accent} />
          <Text style={{ marginTop: 12, color: colors.muted }}>Loading faculty dashboard...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Faculty Dashboard"
      subtitle="Review queue and topic decisions"
      headerRight={<HeaderIconButton icon="refresh-cw" onPress={fetchStats} />}
    >
      {error ? (
        <WireframeCard style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
        </WireframeCard>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {statusCards.map((card) => (
          <View key={card.key} style={{ width: '48%' }}>
            <WireframeCard>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: card.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Feather name={card.icon} size={22} color={card.color} />
              </View>
              <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>{stats[card.key]}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{card.label}</Text>
            </WireframeCard>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('TopicReview')}
        activeOpacity={0.85}
        style={{
          minHeight: 56,
          borderRadius: 18,
          backgroundColor: colors.accent,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
        }}
      >
        <View>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Review Topics</Text>
          <Text style={{ color: '#D8F3DC', fontSize: 12, marginTop: 4 }}>Open pending submissions and decisions</Text>
        </View>
        <Feather name="arrow-right" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </AppLayout>
  );
};

export default FacultyDashboardScreen;
