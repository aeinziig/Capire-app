import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isSupabaseConfigured, supabase } from '@/services/supabase';
import type { RootParamList } from '@/navigation/types';
import { mapAuthError } from '@/utils/supabase/supabaseErrorHandler';
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
  originalityScore: number | null;
  abstract?: string;
};

const departments = ['All', 'Computer Science', 'Urban Planning', 'Political Science', 'Engineering', 'Business'];
const years = ['All', '2025', '2024', '2023', '2022'];
const loadingCards = [1, 2, 3];

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const wireframeColors = useWireframeTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: 'All', year: 'All' });
  const [capstones, setCapstones] = useState<CapstoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasActiveFilters = Boolean(searchQuery.trim()) || filters.department !== 'All' || filters.year !== 'All';

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      const term = searchQuery.trim();
      if (!term) return;
      setRecentSearches((current) => [term, ...current.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 5));
    }, 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const fetchCapstones = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured) {
        setCapstones([]);
        return;
      }

      let query = supabase
        .from('capstone_projects')
        .select('id, title, author, department, year, originalityScore, abstract');

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery.trim()}%,abstract.ilike.%${searchQuery.trim()}%`);
      }

      if (filters.department !== 'All') query = query.eq('department', filters.department);
      if (filters.year !== 'All') query = query.eq('year', Number(filters.year));

      const { data, error: queryError } = await query.order('year', { ascending: false });
      if (queryError) throw queryError;
      setCapstones(
        (((data as Array<Record<string, unknown>> | null) || []).map((item) => ({
          id: String(item.id || ''),
          title: String(item.title || ''),
          author: String(item.author || ''),
          department: String(item.department || ''),
          year: String(item.year || ''),
          originalityScore: typeof item.originalityScore === 'number' ? item.originalityScore : null,
          abstract: typeof item.abstract === 'string' ? item.abstract : undefined,
        })))
      );
    } catch (err: unknown) {
      setError(mapAuthError(err));
      setCapstones([]);
    } finally {
      setLoading(false);
    }
  }, [filters.department, filters.year, searchQuery]);

  useEffect(() => {
    fetchCapstones();
  }, [fetchCapstones]);

  return (
    <AppLayout
      title="Search archive"
      subtitle="Explore capstone studies, filter by department, and jump into promising ideas."
      headerRight={<HeaderIconButton icon="refresh-cw" onPress={() => void fetchCapstones()} />}
    >
      <WireframeCard style={{ marginBottom: 16 }}>
        <View
          style={{
            minHeight: 56,
            borderRadius: 18,
            backgroundColor: wireframeColors.inputBg,
            borderWidth: 1,
            borderColor: wireframeColors.line,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Feather name="search" size={18} color={wireframeColors.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search titles, abstracts, or keywords"
            placeholderTextColor={wireframeColors.placeholder}
            style={{ flex: 1, color: wireframeColors.text, marginLeft: 10, fontSize: 14 }}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.85}>
              <Feather name="x" size={18} color={wireframeColors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 12 }}>
          Try research areas like AI, mobile systems, records management, or healthcare.
        </Text>
      </WireframeCard>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {departments.map((department) => (
            <WireframePill
              key={department}
              label={department}
              active={filters.department === department}
              onPress={() => setFilters((current) => ({ ...current, department }))}
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {years.map((year) => (
            <WireframePill
              key={year}
              label={year}
              active={filters.year === year}
              onPress={() => setFilters((current) => ({ ...current, year }))}
            />
          ))}
        </View>
      </ScrollView>

      {recentSearches.length > 0 ? (
        <WireframeCard style={{ marginBottom: 16 }}>
          <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>Recent searches</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {recentSearches.map((item) => (
              <WireframePill key={item} label={item} onPress={() => setSearchQuery(item)} />
            ))}
          </View>
        </WireframeCard>
      ) : null}

      {error ? (
        <WireframeCard style={{ marginBottom: 16 }}>
          <Text style={{ color: wireframeColors.danger, fontSize: 13 }}>{error}</Text>
        </WireframeCard>
      ) : null}

      <WireframeCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ color: wireframeColors.text, fontSize: 18, fontWeight: '800' }}>
            Results {loading ? '' : `(${capstones.length})`}
          </Text>
          {loading ? <ActivityIndicator color={wireframeColors.accent} /> : null}
        </View>

        {loading ? (
          <View style={{ minHeight: 320 }}>
            {loadingCards.map((card) => (
              <View
                key={card}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: wireframeColors.line,
                  backgroundColor: wireframeColors.inputBg,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <View style={{ height: 16, borderRadius: 999, backgroundColor: wireframeColors.line, marginBottom: 8, width: '82%' }} />
                    <View style={{ height: 12, borderRadius: 999, backgroundColor: wireframeColors.line, width: '54%' }} />
                  </View>
                  <View style={{ width: 56, height: 28, borderRadius: 999, backgroundColor: wireframeColors.line }} />
                </View>
                <View style={{ height: 12, borderRadius: 999, backgroundColor: wireframeColors.line, marginTop: 14, width: '100%' }} />
                <View style={{ height: 12, borderRadius: 999, backgroundColor: wireframeColors.line, marginTop: 8, width: '88%' }} />
              </View>
            ))}
            <Text style={{ color: wireframeColors.muted, fontSize: 13, textAlign: 'center', marginTop: 6 }}>
              Loading capstones...
            </Text>
          </View>
        ) : capstones.length === 0 ? (
          <View
            style={{
              minHeight: 220,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 18,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: wireframeColors.accentSoft,
                marginBottom: 14,
              }}
            >
              <Feather name="search" size={22} color={wireframeColors.accent} />
            </View>
            <Text style={{ color: wireframeColors.text, fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
              No capstones found
            </Text>
            <Text style={{ color: wireframeColors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center' }}>
              {hasActiveFilters
                ? 'Try a broader keyword or clear one of the filters.'
                : 'Capstones will appear here once archive data is available.'}
            </Text>
          </View>
        ) : (
          capstones.map((capstone) => {
            const originalityLabel = capstone.originalityScore == null ? 'N/A' : `${capstone.originalityScore}%`;
            const originalityBackground =
              capstone.originalityScore == null
                ? '#EEF2EF'
                : capstone.originalityScore >= 90
                  ? '#EAF6ED'
                  : '#FFF4D8';

            return (
              <TouchableOpacity
                key={capstone.id}
                onPress={() => navigation.navigate('CapstoneDetail', { capstoneId: capstone.id })}
                activeOpacity={0.85}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: wireframeColors.line,
                  backgroundColor: wireframeColors.inputBg,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: wireframeColors.text, fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 12 }}>
                    {capstone.title}
                  </Text>
                  <View
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: originalityBackground,
                    }}
                  >
                    <Text style={{ color: wireframeColors.text, fontSize: 11, fontWeight: '700' }}>
                      {originalityLabel}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: wireframeColors.muted, fontSize: 12, marginTop: 6 }}>
                  {[capstone.author, capstone.department, capstone.year].filter(Boolean).join(' / ')}
                </Text>
                <Text numberOfLines={2} style={{ color: wireframeColors.text, fontSize: 13, lineHeight: 19, marginTop: 10 }}>
                  {capstone.abstract || 'Abstract unavailable.'}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </WireframeCard>
    </AppLayout>
  );
};

export default SearchScreen;
