import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  WireframePill,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type TopicStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

type TopicItem = {
  id: string;
  title: string;
  studentName: string;
  department: string;
  submittedAt: string;
  abstract: string;
  originalityScore: number | null;
  status: TopicStatus;
};

type TopicRow = {
  id: string;
  title: string;
  author: string;
  department: string;
  created_at: string;
  abstract: string;
  originalityScore: number | null;
  status?: TopicStatus | null;
};

const filters: { label: string; value: TopicStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Needs Revision', value: 'needs_revision' },
  { label: 'Rejected', value: 'rejected' },
];

const TopicReviewScreen: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const wireframeColors = useWireframeTheme();
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [filter, setFilter] = useState<TopicStatus | 'all'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const role = user.user_metadata?.role || user.app_metadata?.role;
      if (role !== 'faculty') throw new Error('Access denied. Faculty access required.');

      const { data, error: queryError } = await supabase
        .from('capstone_projects')
        .select('id, title, author, department, created_at, abstract, originalityScore, status')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setTopics(
        (((data as TopicRow[] | null) || []).map((topic) => ({
          id: topic.id,
          title: topic.title,
          studentName: topic.author,
          department: topic.department,
          submittedAt: new Date(topic.created_at).toLocaleDateString(),
          abstract: topic.abstract,
          originalityScore: topic.originalityScore,
          status: topic.status || 'pending',
        })))
      );
    } catch (err: unknown) {
      setError(mapAuthError(err));
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [user]);

  const stats = useMemo(
    () => ({
      total: topics.length,
      pending: topics.filter((topic) => topic.status === 'pending').length,
      approved: topics.filter((topic) => topic.status === 'approved').length,
      needs_revision: topics.filter((topic) => topic.status === 'needs_revision').length,
      rejected: topics.filter((topic) => topic.status === 'rejected').length,
    }),
    [topics]
  );

  const filteredTopics = filter === 'all' ? topics : topics.filter((topic) => topic.status === filter);

  const updateStatus = async (topic: TopicItem, status: TopicStatus) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase.from('capstone_projects').update({ status }).eq('id', topic.id);
      if (updateError) throw updateError;
      setTopics((current) => current.map((item) => (item.id === topic.id ? { ...item, status } : item)));
      setSelectedTopic(null);
      setReviewComment('');
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Faculty review"
      subtitle="Review submitted topics, check originality, and return clear decisions."
      headerRight={<HeaderIconButton icon="clipboard" />}
    >
      {authLoading || (loading && topics.length === 0) ? (
        <WireframeCard style={{ alignItems: 'center', paddingVertical: 28 }}>
          <ActivityIndicator color={wireframeColors.accent} />
          <Text style={{ color: wireframeColors.muted, marginTop: 12 }}>Loading topics...</Text>
        </WireframeCard>
      ) : (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {[
              ['Pending', stats.pending],
              ['Approved', stats.approved],
              ['Revision', stats.needs_revision],
              ['Rejected', stats.rejected],
            ].map(([label, value]) => (
              <View key={String(label)} style={{ width: '48%' }}>
                <WireframeCard>
                  <Text style={{ color: wireframeColors.muted, fontSize: 12 }}>{label}</Text>
                  <Text style={{ color: wireframeColors.text, fontSize: 24, fontWeight: '800', marginTop: 8 }}>{value}</Text>
                </WireframeCard>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {filters.map((item) => (
                <WireframePill
                  key={item.value}
                  label={`${item.label} (${item.value === 'all' ? stats.total : stats[item.value]})`}
                  active={filter === item.value}
                  onPress={() => setFilter(item.value)}
                />
              ))}
            </View>
          </ScrollView>

          {error ? (
            <WireframeCard style={{ marginBottom: 16 }}>
              <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{error}</Text>
            </WireframeCard>
          ) : null}

          {filteredTopics.length === 0 ? (
            <WireframeCard>
              <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>No topics match this filter.</Text>
            </WireframeCard>
          ) : (
            filteredTopics.map((topic) => (
              <TouchableOpacity key={topic.id} onPress={() => setSelectedTopic(topic)} activeOpacity={0.85}>
                <WireframeCard style={{ marginBottom: 12 }}>
                  <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800' }}>{topic.title}</Text>
                  <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 6 }}>
                    {topic.studentName} • {topic.department} • {topic.submittedAt}
                  </Text>
                  <Text numberOfLines={2} style={{ color: wireframeColors.text, fontSize: 13, lineHeight: 19, marginTop: 10 }}>
                    {topic.abstract}
                  </Text>
                  <Text style={{ color: wireframeColors.accent, fontSize: 12, fontWeight: '700', marginTop: 10 }}>
                    Originality {topic.originalityScore == null ? 'N/A' : `${topic.originalityScore}%`} • {topic.status.replace('_', ' ')}
                  </Text>
                </WireframeCard>
              </TouchableOpacity>
            ))
          )}
        </>
      )}

      <Modal visible={!!selectedTopic} animationType="slide" transparent onRequestClose={() => setSelectedTopic(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          {selectedTopic ? (
            <View style={{ backgroundColor: wireframeColors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 }}>
              <Text style={{ color: wireframeColors.text, fontSize: 20, fontWeight: '800' }}>{selectedTopic.title}</Text>
              <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 8 }}>
                {selectedTopic.studentName} • {selectedTopic.department}
              </Text>
              <Text style={{ color: wireframeColors.text, fontSize: 14, lineHeight: 22, marginTop: 14 }}>{selectedTopic.abstract}</Text>
              <TextInput
                value={reviewComment}
                onChangeText={setReviewComment}
                placeholder="Add faculty notes..."
                placeholderTextColor={wireframeColors.placeholder}
                multiline
                textAlignVertical="top"
                style={{
                  minHeight: 120,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: wireframeColors.line,
                  backgroundColor: wireframeColors.inputBg,
                  padding: 14,
                  color: wireframeColors.text,
                  marginTop: 16,
                }}
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                {([
                  ['Approve', 'approved'],
                  ['Revision', 'needs_revision'],
                  ['Reject', 'rejected'],
                ] as Array<[string, TopicStatus]>).map(([label, value]) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => updateStatus(selectedTopic, value)}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      minHeight: 48,
                      borderRadius: 16,
                      backgroundColor:
                        value === 'rejected'
                          ? wireframeColors.dangerSoft
                          : value === 'approved'
                            ? wireframeColors.accentSoft
                            : wireframeColors.inputBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: wireframeColors.text, fontWeight: '700' }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={() => setSelectedTopic(null)} activeOpacity={0.85} style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ color: wireframeColors.muted, fontWeight: '700' }}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
    </AppLayout>
  );
};

export default TopicReviewScreen;
