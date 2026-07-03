import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootParamList } from '@/navigation/types';
import { useApp } from '@/context/AppContext';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

const timeAgo = (value: string): string => {
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays > 7) return date.toLocaleDateString();
  if (diffDays > 1) return `${diffDays} days ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffHours > 1) return `${diffHours} hours ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffMins > 1) return `${diffMins} minutes ago`;
  if (diffMins === 1) return '1 minute ago';
  return 'just now';
};

const NotificationsScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const {
    messageNotifications,
    unreadMessageCount,
    markAllMessageNotificationsRead,
    markMessageNotificationRead,
  } = useApp();

  return (
    <AppLayout
      title="Notifications"
      subtitle={`${unreadMessageCount} unread update${unreadMessageCount === 1 ? '' : 's'}`}
      headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
      headerRight={<HeaderIconButton icon="check" onPress={() => void markAllMessageNotificationsRead()} />}
    >
      <FlatList
        data={messageNotifications}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={(
          <WireframeCard>
            <Text style={{ color: colors.muted, fontSize: 13 }}>All caught up. No unread notifications right now.</Text>
          </WireframeCard>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={async () => {
              await markMessageNotificationRead(item.id);
              navigation.navigate('ChatConversation', {
                partnerId: item.partnerId,
                partnerName: item.partnerName,
              });
            }}
          >
            <WireframeCard style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    backgroundColor: colors.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialCommunityIcons name="message-text" size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>{item.title}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }} numberOfLines={1}>{item.body}</Text>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{timeAgo(item.time)}</Text>
                </View>
                {!item.isRead ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginLeft: 10 }} /> : null}
                <Feather name="chevron-right" size={18} color={colors.muted} style={{ marginLeft: 10 }} />
              </View>
            </WireframeCard>
          </TouchableOpacity>
        )}
      />
    </AppLayout>
  );
};

export default NotificationsScreen;
