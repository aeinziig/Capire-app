import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/services/supabase';
import type { RootParamList } from '@/navigation/types';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type Conversation = {
  id: string;
  partnerId: string;
  name: string;
  lastMessage: string;
  time: string;
  lastMessageAt: string;
  unreadCount: number;
};

type ConversationState = 'archived' | 'deleted';

type StoredConversationMeta = Record<string, {
  state: ConversationState;
  hiddenAt: string;
}>;

type ConversationStateRow = {
  partner_id: string;
  state: ConversationState;
  hidden_at: string;
};

type ChatMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
};

type UserRow = {
  id: string;
  full_name: string | null;
  email: string;
};

const navigateToProfile = (
  navigation: NativeStackNavigationProp<RootParamList>,
  userId: string,
) => {
  navigation.navigate('OtherUserProfile', { userId });
};

const MessagesScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { user, refreshMessageNotifications } = useApp();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLookup, setShowLookup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserRow[]>([]);
  const [conversationMeta, setConversationMeta] = useState<StoredConversationMeta>({});

  const fetchConversationMeta = useCallback(async () => {
    if (!user) {
      setConversationMeta({});
      return;
    }

    const { data, error: stateError } = await supabase
      .from('user_conversation_states')
      .select('partner_id, state, hidden_at')
      .eq('owner_id', user.id);

    if (stateError) {
      throw stateError;
    }

    const nextMeta = ((data ?? []) as ConversationStateRow[]).reduce<StoredConversationMeta>((acc, row) => {
      acc[row.partner_id] = {
        state: row.state,
        hiddenAt: row.hidden_at,
      };
      return acc;
    }, {});

    setConversationMeta(nextMeta);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setConversationMeta({});
      return;
    }

    void fetchConversationMeta();
  }, [fetchConversationMeta, user]);

  const markConversationRead = useCallback(async (partnerId: string) => {
    if (!user) {
      return;
    }

    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', partnerId)
      .eq('is_read', false);

    await refreshMessageNotifications();
  }, [refreshMessageNotifications, user]);

  const fetchConversations = useCallback(async (metaOverride?: StoredConversationMeta) => {
    if (!user) {
      setConversations([]);
      setArchivedConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: messageError } = await supabase
        .from('chat_messages')
        .select('id, sender_id, receiver_id, message, is_read, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messageError) {
        throw messageError;
      }

      const messages = (data ?? []) as ChatMessageRow[];
      const partnerIds = [...new Set(messages.map((message) => (
        message.sender_id === user.id ? message.receiver_id : message.sender_id
      )))];

      let usersById = new Map<string, UserRow>();
      if (partnerIds.length > 0) {
        const { data: partnerData, error: partnerError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', partnerIds);

        if (partnerError) {
          throw partnerError;
        }

        usersById = new Map(((partnerData ?? []) as UserRow[]).map((partner) => [partner.id, partner]));
      }

      const nextConversations = new Map<string, Conversation>();

      messages.forEach((message) => {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        if (!partnerId) {
          return;
        }

        const existing = nextConversations.get(partnerId);
        if (!existing) {
          const partner = usersById.get(partnerId);
          nextConversations.set(partnerId, {
            id: partnerId,
            partnerId,
            name: partner?.full_name || partner?.email || `User ${partnerId.slice(0, 8)}`,
            lastMessage: message.message,
            time: message.created_at
              ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
            lastMessageAt: message.created_at || new Date().toISOString(),
            unreadCount: message.receiver_id === user.id && !message.is_read ? 1 : 0,
          });
          return;
        }

        if (message.receiver_id === user.id && !message.is_read) {
          existing.unreadCount += 1;
        }
      });

      const activeItems: Conversation[] = [];
      const archivedItems: Conversation[] = [];

      const activeMeta = metaOverride || conversationMeta;

      Array.from(nextConversations.values()).forEach((conversation) => {
        const meta = activeMeta[conversation.partnerId];
        if (!meta) {
          activeItems.push(conversation);
          return;
        }

        if (meta.state === 'archived') {
          archivedItems.push(conversation);
          return;
        }

        if (meta.state === 'deleted' && new Date(conversation.lastMessageAt).getTime() <= new Date(meta.hiddenAt).getTime()) {
          return;
        }

        activeItems.push(conversation);
      });

      setConversations(activeItems);
      setArchivedConversations(archivedItems);
    } catch (err) {
      setConversations([]);
      setArchivedConversations([]);
      setError(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [conversationMeta, user]);

  const setConversationState = useCallback(async (partnerId: string, state: ConversationState, hiddenAt: string) => {
    if (!user?.id) {
      return;
    }

    const nextMeta = {
      ...conversationMeta,
      [partnerId]: {
        state,
        hiddenAt,
      },
    };

    const { error: stateError } = await supabase
      .from('user_conversation_states')
      .upsert({
        owner_id: user.id,
        partner_id: partnerId,
        state,
        hidden_at: hiddenAt,
      });

    if (stateError) {
      throw stateError;
    }

    setConversationMeta(nextMeta);
    await markConversationRead(partnerId);
    await fetchConversations(nextMeta);
  }, [conversationMeta, fetchConversations, markConversationRead, user]);

  const clearConversationState = useCallback(async (partnerId: string) => {
    if (!user?.id) {
      return;
    }

    const nextMeta = { ...conversationMeta };
    delete nextMeta[partnerId];

    const { error: stateError } = await supabase
      .from('user_conversation_states')
      .delete()
      .eq('owner_id', user.id)
      .eq('partner_id', partnerId);

    if (stateError) {
      throw stateError;
    }

    setConversationMeta(nextMeta);
    await fetchConversations(nextMeta);
  }, [conversationMeta, fetchConversations, user]);

  useEffect(() => {
    void fetchConversations();

    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`messages-list-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload) => {
        const row = (payload.new || payload.old) as Partial<ChatMessageRow>;
        if (row.sender_id === user.id || row.receiver_id === user.id) {
          void fetchConversations();
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchConversations, user]);

  useEffect(() => {
    if (!user || !showLookup) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const { data, error: searchError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .neq('id', user.id)
          .or(`full_name.ilike.%${escapeLike(trimmedQuery)}%,email.ilike.%${escapeLike(trimmedQuery)}%`)
          .limit(8);

        if (searchError) {
          throw searchError;
        }

        if (!cancelled) {
          setSearchResults((data ?? []) as UserRow[]);
        }
      } catch (err) {
        if (!cancelled) {
          setSearchResults([]);
          setError(err instanceof Error ? err.message : 'Failed to search users.');
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, showLookup, user]);

  if (loading) {
    return (
      <AppLayout title="Messages" subtitle="Loading conversations" scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.accent} />
          <Text style={{ marginTop: 12, color: colors.muted }}>Loading messages...</Text>
        </View>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Messages" subtitle="Conversation feed">
        <WireframeCard>
          <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Messages" subtitle="Sign in required">
        <WireframeCard>
          <Text style={{ color: colors.muted, fontSize: 13 }}>Please log in to access messages.</Text>
        </WireframeCard>
      </AppLayout>
    );
  }

  const showConversationActions = (conversation: Conversation, archived = false) => {
    Alert.alert(
      conversation.name,
      archived ? 'Manage this archived conversation.' : 'Manage this conversation.',
      [
        archived
          ? {
              text: 'Unarchive',
              onPress: () => {
                void clearConversationState(conversation.partnerId).catch((err) => {
                  setError(err instanceof Error ? err.message : 'Failed to update conversation.');
                });
              },
            }
          : {
              text: 'Archive',
              onPress: () => {
                void setConversationState(conversation.partnerId, 'archived', conversation.lastMessageAt).catch((err) => {
                  setError(err instanceof Error ? err.message : 'Failed to update conversation.');
                });
              },
            },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void setConversationState(conversation.partnerId, 'deleted', conversation.lastMessageAt).catch((err) => {
              setError(err instanceof Error ? err.message : 'Failed to update conversation.');
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity activeOpacity={0.95} onLongPress={() => showConversationActions(item)}>
      <WireframeCard style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigateToProfile(navigation, item.partnerId)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              backgroundColor: colors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ color: colors.accent, fontWeight: '800' }}>{item.name.charAt(0)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigateToProfile(navigation, item.partnerId)}
            style={{ flex: 1 }}
          >
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>{item.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{item.lastMessage}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={async () => {
              await markConversationRead(item.partnerId);
              navigation.navigate('ChatConversation', {
                partnerId: item.partnerId,
                partnerName: item.name,
              });
            }}
            style={{ alignItems: 'flex-end', marginLeft: 12 }}
          >
            <Text style={{ color: colors.muted, fontSize: 11 }}>{item.time}</Text>
            {item.unreadCount > 0 ? (
              <View
                style={{
                  minWidth: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 6,
                  marginTop: 8,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>{item.unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </WireframeCard>
    </TouchableOpacity>
  );

  return (
    <AppLayout
      title="Messages"
      subtitle="Academic conversations and follow-ups"
      headerRight={<HeaderIconButton icon={showLookup ? 'x' : 'search'} onPress={() => setShowLookup((current) => !current)} />}
    >
      {showLookup ? (
        <WireframeCard style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>Start a test conversation</Text>
          <View
            style={{
              minHeight: 54,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.line,
              backgroundColor: colors.inputBg,
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              value={searchQuery}
              onChangeText={(value) => {
                setSearchQuery(value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Search users by display name or email"
              placeholderTextColor={colors.placeholder}
              style={{ color: colors.text, fontSize: 14, paddingVertical: 14 }}
            />
          </View>
          {searchLoading ? (
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>Searching users...</Text>
          ) : null}
          {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 ? (
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>No matching users found.</Text>
          ) : null}
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              activeOpacity={0.88}
              onPress={() => navigateToProfile(navigation, result.id)}
              style={{
                marginTop: 10,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.line,
                backgroundColor: colors.inputBg,
                padding: 14,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                {result.full_name || result.email}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{result.email}</Text>
            </TouchableOpacity>
          ))}
        </WireframeCard>
      ) : null}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={(
          <WireframeCard>
            <Text style={{ color: colors.muted, fontSize: 13 }}>No conversations yet.</Text>
          </WireframeCard>
        )}
        renderItem={renderConversationItem}
      />
      {archivedConversations.length > 0 ? (
        <WireframeCard style={{ marginTop: 4 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 12 }}>Archived</Text>
          {archivedConversations.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.95} onLongPress={() => showConversationActions(item, true)}>
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.line,
                  backgroundColor: colors.inputBg,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 }}>{item.name}</Text>
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => {
                      void clearConversationState(item.partnerId).catch((err) => {
                        setError(err instanceof Error ? err.message : 'Failed to update conversation.');
                      });
                    }}
                  >
                    <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '700' }}>Unarchive</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{item.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </WireframeCard>
      ) : null}
    </AppLayout>
  );
};

const escapeLike = (value: string) => value.replace(/[%_]/g, '');

export default MessagesScreen;
