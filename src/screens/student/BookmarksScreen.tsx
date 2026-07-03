import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';
import { useBookmarks } from '@/hooks/useBookmarks';
import { supabase } from '@/services/supabase';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type BookmarkItem = {
  id: string;
  capstone_projects: {
    id: string;
    title: string;
    author: string;
    department: string;
    year: string;
    originalityScore: number | null;
  };
};

const BookmarksScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const wireframeColors = useWireframeTheme();
  const { user, loading: authLoading } = useAuth();
  const { data: userBookmarks, loading: bookmarksLoading, error } = useBookmarks(user?.id || '');
  const isLoading = authLoading || bookmarksLoading;

  const handleRemoveBookmark = async (bookmarkId: string) => {
    await supabase.from('bookmarks').delete().eq('id', bookmarkId);
  };

  return (
    <AppLayout
      title="Bookmarks"
      subtitle="Keep your strongest references close while you shape the final topic."
      headerRight={<HeaderIconButton icon="bookmark" />}
    >
      {isLoading ? (
        <WireframeCard style={{ alignItems: 'center', paddingVertical: 28 }}>
          <ActivityIndicator color={wireframeColors.accent} />
          <Text style={{ color: wireframeColors.muted, marginTop: 12 }}>Loading bookmarks...</Text>
        </WireframeCard>
      ) : error ? (
        <WireframeCard>
          <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{error}</Text>
        </WireframeCard>
      ) : !user ? (
        <WireframeCard>
          <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>Please log in to view bookmarks.</Text>
        </WireframeCard>
      ) : (userBookmarks || []).length === 0 ? (
        <WireframeCard>
          <Text style={{ color: wireframeColors.muted, fontSize: 13 }}>You have not bookmarked any projects yet.</Text>
        </WireframeCard>
      ) : (
        (userBookmarks as BookmarkItem[]).map((bookmark) => {
          const capstone = bookmark.capstone_projects;
          return (
            <WireframeCard key={bookmark.id} style={{ marginBottom: 12 }}>
              <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800' }}>{capstone.title}</Text>
              <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 6 }}>
                {capstone.author} • {capstone.department} • {capstone.year}
              </Text>
              <Text style={{ color: wireframeColors.accent, fontSize: 12, fontWeight: '700', marginTop: 10 }}>
                {capstone.originalityScore == null
                  ? 'Originality score unavailable'
                  : `Originality Score: ${capstone.originalityScore}%`}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 14 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CapstoneDetail', { capstoneId: capstone.id })}
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    minHeight: 46,
                    borderRadius: 16,
                    backgroundColor: wireframeColors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveBookmark(bookmark.id)}
                  activeOpacity={0.85}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 16,
                    backgroundColor: '#FFF3EF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="trash-2" size={18} color={wireframeColors.danger} />
                </TouchableOpacity>
              </View>
            </WireframeCard>
          );
        })
      )}
    </AppLayout>
  );
};

export default BookmarksScreen;
