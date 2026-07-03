import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type NotificationItem = {
  id: string;
  type: 'bookmark' | 'message' | 'topic' | 'system';
  title: string;
  timestamp: Date;
  isRead: boolean;
};

const timeAgo = (date: Date): string => {
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setNotifications([
      { id: '1', type: 'bookmark', title: 'Someone bookmarked your capstone project', timestamp: new Date(Date.now() - 5 * 60 * 1000), isRead: false },
      { id: '2', type: 'message', title: 'New message from John Doe', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), isRead: true },
      { id: '3', type: 'topic', title: 'Your topic submission was approved', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), isRead: false },
      { id: '4', type: 'system', title: 'System maintenance scheduled for tonight', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), isRead: true },
    ]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  const markAllRead = () => setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  const dismiss = (id: string) => setNotifications((current) => current.filter((item) => item.id !== id));

  const iconForType = (type: NotificationItem['type']) => {
    if (type === 'bookmark') return <Feather name="bookmark" size={18} color={colors.accent} />;
    if (type === 'message') return <MaterialCommunityIcons name="message-text" size={18} color={colors.accent} />;
    if (type === 'topic') return <MaterialCommunityIcons name="school" size={18} color={colors.accent} />;
    return <MaterialCommunityIcons name="cog" size={18} color={colors.accent} />;
  };

  return (
    <AppLayout
      title="Notifications"
      subtitle={`${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`}
      headerRight={<HeaderIconButton icon="check" onPress={markAllRead} />}
    >
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <WireframeCard>
            <Text style={{ color: colors.muted, fontSize: 13 }}>No notifications right now.</Text>
          </WireframeCard>
        }
        renderItem={({ item }) => (
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
                {iconForType(item.type)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>{item.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{timeAgo(item.timestamp)}</Text>
              </View>
              {!item.isRead ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginRight: 10 }} /> : null}
              <TouchableOpacity onPress={() => dismiss(item.id)} activeOpacity={0.85}>
                <Feather name="x" size={18} color={colors.muted} />
              </TouchableOpacity>
            </View>
          </WireframeCard>
        )}
      />
    </AppLayout>
  );
};

export default NotificationsScreen;
