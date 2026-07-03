import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';

type OtherUserProfileProps = {
  userId: string;
};

const OtherUserProfileScreen: React.FC<OtherUserProfileProps> = () => {
  const colors = useWireframeTheme();
  const user = {
    name: 'Maria Garcia',
    email: 'maria.garcia@university.edu',
    role: 'Student',
    department: 'Urban Planning',
    year: 'Junior',
    studentId: 'UP2022045',
    stats: {
      capstonesReviewed: 3,
      originalityChecks: 7,
      bookmarks: 5,
      researchHours: 28,
    },
    bio: 'Passionate about sustainable urban development and smart city technologies. Currently working on my capstone about AI-driven traffic management systems.',
    publications: [
      'Smart Cities Journal, March 2023: "IoT Applications in Urban Planning"',
      'Urban Planning Review, January 2023: "Green Spaces in Metropolitan Areas"',
    ],
  };

  return (
    <AppLayout title="User Profile" subtitle="Research profile and recent output" headerLeft={<HeaderIconButton icon="chevron-left" />}>
      <WireframeCard style={{ marginBottom: 16, alignItems: 'center' }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 28 }}>{user.name.charAt(0)}</Text>
        </View>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{user.name}</Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>
          {user.role} • {user.department} • {user.year}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{user.email}</Text>
      </WireframeCard>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 10 }}>About</Text>
        <Text style={{ color: colors.text, fontSize: 14, lineHeight: 21 }}>{user.bio}</Text>
      </WireframeCard>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {[
          ['Reviewed', user.stats.capstonesReviewed],
          ['Checks', user.stats.originalityChecks],
          ['Bookmarks', user.stats.bookmarks],
          ['Hours', `${user.stats.researchHours}h`],
        ].map(([label, value]) => (
          <View key={String(label)} style={{ width: '48%' }}>
            <WireframeCard>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
              <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 8 }}>{value}</Text>
            </WireframeCard>
          </View>
        ))}
      </View>

      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }}>Publications</Text>
        {user.publications.map((publication) => (
          <View
            key={publication}
            style={{
              borderRadius: 16,
              backgroundColor: colors.inputBg,
              borderWidth: 1,
              borderColor: colors.line,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 13, lineHeight: 19 }}>{publication}</Text>
          </View>
        ))}
      </WireframeCard>

      <WireframeCard>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 18,
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.line,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="message-circle" size={18} color={colors.accent} />
            <Text style={{ color: colors.text, fontWeight: '700', marginLeft: 10 }}>Send Message</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.muted} />
        </TouchableOpacity>
      </WireframeCard>
    </AppLayout>
  );
};

export default OtherUserProfileScreen;
