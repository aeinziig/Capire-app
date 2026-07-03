import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppLayout, HeaderIconButton, WireframeCard, useWireframeTheme } from '@/components/wireframe/Wireframe';
import type { RootParamList } from '@/navigation/types';

type LegalRoute = RouteProp<RootParamList, 'LegalDocument'>;

const LEGAL_COPY = {
  terms: {
    title: 'Terms of Use',
    subtitle: 'How CAPIRE may be used within SPCBA research workflows.',
    sections: [
      {
        heading: '1. Eligibility',
        body:
          'CAPIRE is intended for students, faculty, advisers, researchers, and authorized staff using valid SPCBA credentials. You are responsible for activity performed through your account.',
      },
      {
        heading: '2. Acceptable use',
        body:
          'Use the app for academic research, archive browsing, originality review, messaging, and related school work. Do not upload unlawful, harmful, misleading, or unauthorized material, and do not attempt to disrupt the service or access data you should not see.',
      },
      {
        heading: '3. Research content',
        body:
          'Capstone titles, abstracts, citations, originality results, and recommendations are provided to support academic work. Users remain responsible for verifying research accuracy, originality, citations, and compliance with institutional rules.',
      },
      {
        heading: '4. Messaging and conduct',
        body:
          'User-to-user chat and AI assistance must be used respectfully and for legitimate academic purposes. Harassment, impersonation, spam, and abusive behavior may lead to account restrictions.',
      },
      {
        heading: '5. Availability',
        body:
          'We may update, limit, or suspend parts of the service when needed for maintenance, security, or policy compliance. We do not guarantee uninterrupted availability.',
      },
      {
        heading: '6. Account and security',
        body:
          'Keep your SPCBA email and password secure. Notify the school or system administrator if you suspect unauthorized access or account misuse.',
      },
      {
        heading: '7. Changes to these terms',
        body:
          'These terms may be revised as the platform and school requirements evolve. Continued use of CAPIRE after updates means you accept the latest version shown in the app.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'What CAPIRE stores, uses, and protects while you use the app.',
    sections: [
      {
        heading: '1. Information we collect',
        body:
          'We may collect your SPCBA email, display name, ID-related profile data, app preferences, submitted topics, bookmarks, messages, and research content you provide for originality checking or related academic features.',
      },
      {
        heading: '2. How information is used',
        body:
          'Collected data is used to authenticate users, personalize the app, show capstone archive content, support messaging, generate recommendations, perform originality analysis, and improve reliability and security.',
      },
      {
        heading: '3. Storage and access',
        body:
          'Your information may be stored in secure cloud services used by CAPIRE, including authentication, database, and file storage systems. Access should be limited to authorized users and administrators who need it for app operations or academic support.',
      },
      {
        heading: '4. Sharing',
        body:
          'We do not treat personal data as public by default. Information is shared only as needed to deliver app features, comply with school processes, or meet legal and security requirements.',
      },
      {
        heading: '5. Messaging and uploaded content',
        body:
          'Messages and uploaded files may be processed to support delivery, storage, originality checking, moderation, or troubleshooting. Do not submit sensitive personal information unless required for legitimate academic use.',
      },
      {
        heading: '6. Your choices',
        body:
          'You can update some profile details in the app and may request help from the school or administrator regarding account access, corrections, or support concerns.',
      },
      {
        heading: '7. Policy updates',
        body:
          'This policy may be updated when app features, school procedures, or legal requirements change. The latest version available in the app is the governing version.',
      },
    ],
  },
} as const;

const LegalDocumentScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute<LegalRoute>();
  const colors = useWireframeTheme();
  const document = LEGAL_COPY[route.params.document];

  return (
    <AppLayout
      title={document.title}
      subtitle={document.subtitle}
      headerLeft={<HeaderIconButton icon="chevron-left" onPress={() => navigation.goBack()} />}
      scroll={false}
    >
      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 20 }}>
          Last updated: July 3, 2026
        </Text>
      </WireframeCard>

      <ScrollView showsVerticalScrollIndicator={false}>
        {document.sections.map((section) => (
          <WireframeCard key={section.heading} style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 8 }}>
              {section.heading}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22 }}>
              {section.body}
            </Text>
          </WireframeCard>
        ))}

        <View style={{ paddingBottom: 24 }}>
          <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, textAlign: 'center' }}>
            For policy questions, contact the school administrator or the team managing CAPIRE.
          </Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default LegalDocumentScreen;
