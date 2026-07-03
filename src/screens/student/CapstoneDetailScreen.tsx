import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CitationBottomSheet from '@/screens/shared/CitationBottomSheet';
import { supabase } from '@/services/supabase';
import { useApp } from '@/context/AppContext';
import type { RootParamList } from '@/navigation/types';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  WireframePill,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type CapstoneItem = {
  id: string;
  title: string;
  author: string;
  department: string;
  year: string;
  abstract: string;
  originalityScore: number | null;
  keywords: string[];
  pdfUrl?: string | null;
};

const CapstoneDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const wireframeColors = useWireframeTheme();
  const { user } = useApp();
  const { capstoneId } = route.params as { capstoneId: string };

  const [capstone, setCapstone] = useState<CapstoneItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchCapstone = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('capstone_projects')
          .select('id, title, author, department, year, abstract, originalityScore, keywords, tags, pdfUrl')
          .eq('id', capstoneId)
          .single();

        if (queryError) throw queryError;

        const nextKeywords = Array.isArray(data.keywords) && data.keywords.length > 0
          ? data.keywords
          : Array.isArray(data.tags)
            ? data.tags
            : [];

        setCapstone({
          id: String(data.id),
          title: String(data.title || ''),
          author: String(data.author || 'Unknown Author'),
          department: String(data.department || 'Unknown Department'),
          year: String(data.year || ''),
          abstract: String(data.abstract || 'Abstract unavailable.'),
          originalityScore: typeof data.originalityScore === 'number' ? data.originalityScore : null,
          keywords: nextKeywords.map((keyword) => String(keyword)),
          pdfUrl: typeof data.pdfUrl === 'string' ? data.pdfUrl : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load capstone details.');
        setCapstone(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchCapstone();
  }, [capstoneId]);

  useEffect(() => {
    const fetchBookmarkState = async () => {
      if (!user?.id) {
        setIsBookmarked(false);
        return;
      }

      const { data, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('project_id', capstoneId)
        .maybeSingle();

      if (!bookmarkError) {
        setIsBookmarked(Boolean(data));
      }
    };

    void fetchBookmarkState();
  }, [capstoneId, user?.id]);

  const handleBookmarkToggle = async () => {
    if (!user?.id || bookmarkLoading || !capstone) return;

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', capstone.id);

        if (deleteError) throw deleteError;
        setIsBookmarked(false);
      } else {
        const { error: insertError } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, project_id: capstone.id });

        if (insertError) throw insertError;
        setIsBookmarked(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bookmark.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const citationSource = useMemo(() => {
    if (!capstone) return null;

    return {
      type: 'Thesis' as const,
      title: capstone.title,
      author: capstone.author,
      year: capstone.year,
      institution: `${capstone.department} Department`,
    };
  }, [capstone]);

  if (loading) {
    return (
      <AppLayout
        title="Capstone detail"
        subtitle="Loading project details"
        headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
        scroll={false}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={wireframeColors.accent} />
        </View>
      </AppLayout>
    );
  }

  if (!capstone) {
    return (
      <AppLayout
        title="Capstone detail"
        subtitle="Project not found"
        headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
      >
        <WireframeCard>
          <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>{error || 'This capstone could not be found.'}</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Capstone detail"
      subtitle="Review the project summary, keywords, and supporting reference details."
      headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
      headerRight={<HeaderIconButton icon="book-open" onPress={() => setShowCitationModal(true)} />}
    >
      {error ? (
        <WireframeCard style={{ marginBottom: 16 }}>
          <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{error}</Text>
        </WireframeCard>
      ) : null}

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 22, fontWeight: '800' }}>{capstone.title}</Text>
        <Text style={{ color: wireframeColors.muted, fontSize: 13, marginTop: 8 }}>
          {capstone.author} • {capstone.department} • {capstone.year}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <View style={{ flex: 1, borderRadius: 18, backgroundColor: wireframeColors.accentSoft, padding: 14 }}>
            <Text style={{ color: wireframeColors.muted, fontSize: 11 }}>Originality</Text>
            <Text style={{ color: wireframeColors.text, fontSize: 20, fontWeight: '800', marginTop: 6 }}>
              {capstone.originalityScore == null ? 'N/A' : `${capstone.originalityScore}%`}
            </Text>
          </View>
          <View style={{ flex: 1, borderRadius: 18, backgroundColor: wireframeColors.inputBg, padding: 14 }}>
            <Text style={{ color: wireframeColors.muted, fontSize: 11 }}>Keywords</Text>
            <Text style={{ color: wireframeColors.text, fontSize: 20, fontWeight: '800', marginTop: 6 }}>
              {capstone.keywords.length}
            </Text>
          </View>
        </View>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 10 }}>Abstract</Text>
        <Text style={{ color: wireframeColors.text, fontSize: 14, lineHeight: 22 }}>{capstone.abstract}</Text>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: wireframeColors.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }}>Keywords</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {capstone.keywords.length > 0 ? (
            capstone.keywords.map((keyword) => <WireframePill key={keyword} label={keyword} />)
          ) : (
            <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>No keywords available.</Text>
          )}
        </View>
      </WireframeCard>

      <WireframeCard>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity
            onPress={handleBookmarkToggle}
            disabled={bookmarkLoading}
            activeOpacity={0.85}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 18,
              backgroundColor: isBookmarked ? wireframeColors.accentSoft : wireframeColors.inputBg,
              borderWidth: 1,
              borderColor: wireframeColors.line,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Feather name="bookmark" size={18} color={wireframeColors.accent} />
            <Text style={{ color: wireframeColors.text, fontWeight: '700' }}>
              {bookmarkLoading ? 'Saving...' : isBookmarked ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowPdfModal(true)}
            activeOpacity={0.85}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 18,
              backgroundColor: wireframeColors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Feather name="file-text" size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Open PDF</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowCitationModal(true)}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            backgroundColor: wireframeColors.inputBg,
            borderWidth: 1,
            borderColor: wireframeColors.line,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            paddingHorizontal: 16,
          }}
        >
          <Feather name="file-text" size={18} color={wireframeColors.accent} />
          <Text style={{ color: wireframeColors.text, fontWeight: '700', textAlign: 'center' }}>Generate Citation</Text>
        </TouchableOpacity>
      </WireframeCard>

      <Modal visible={showPdfModal} transparent animationType="slide" onRequestClose={() => setShowPdfModal(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ backgroundColor: wireframeColors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20 }}>
            <Text style={{ color: wireframeColors.text, fontSize: 20, fontWeight: '800' }}>Reference document</Text>
            <Text style={{ color: wireframeColors.muted, fontSize: 13, marginTop: 8 }}>{capstone.pdfUrl || 'PDF unavailable'}</Text>
            <View
              style={{
                height: 220,
                borderRadius: 20,
                backgroundColor: wireframeColors.inputBg,
                borderWidth: 1,
                borderColor: wireframeColors.line,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
              }}
            >
              <Feather name="file-text" size={34} color={wireframeColors.accent} />
              <Text style={{ color: wireframeColors.muted, marginTop: 10 }}>Preview placeholder</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowPdfModal(false)}
              activeOpacity={0.85}
              style={{
                minHeight: 52,
                borderRadius: 18,
                backgroundColor: wireframeColors.accent,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 18,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showCitationModal} onRequestClose={() => setShowCitationModal(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          {citationSource ? <CitationBottomSheet sourceData={citationSource} onClose={() => setShowCitationModal(false)} /> : null}
        </View>
      </Modal>
    </AppLayout>
  );
};

export default CapstoneDetailScreen;
