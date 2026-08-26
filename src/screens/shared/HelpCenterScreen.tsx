import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  WireframePill,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';
import { log } from '@/utils/logger';

const HelpCenterScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const [activeTab, setActiveTab] = useState<'FAQ' | 'Contact Us'>('FAQ');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqData, setFaqData] = useState<Array<{ question: string; answer: string }>>([]);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setFaqData([
      {
        question: 'How do I submit a capstone topic?',
        answer: 'Go to your dashboard, open Submit Topic, fill in the required fields, and send it for faculty review.',
      },
      {
        question: 'What is the originality checker and how does it work?',
        answer: 'It compares your document against stored academic material and reports a similarity score with matched passages.',
      },
      {
        question: 'How do I cite a capstone project in APA format?',
        answer: 'Open the citation sheet from a capstone detail page to generate an APA reference.',
      },
      {
        question: 'How do I change my notification preferences?',
        answer: 'Go to Settings and update the options you want to receive.',
      },
    ]);
  }, []);

  const filteredFaq = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const lowerQuery = searchQuery.toLowerCase();
    return faqData.filter(
      (faq) => faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery)
    );
  }, [faqData, searchQuery]);

  const handleSubmit = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      setSubmitStatus('error');
      return;
    }
    setSubmitStatus('success');
    log.info('Contact form submitted');
    setTimeout(() => {
      setContactForm({ subject: '', message: '' });
      setSubmitStatus('idle');
    }, 1500);
  };

  return (
    <AppLayout title="Help Center" subtitle="FAQs, support notes, and contact form" headerRight={<HeaderIconButton icon="help-circle" />}>
      <WireframeCard style={{ marginBottom: 16 }}>
        <View
          style={{
            minHeight: 54,
            borderRadius: 18,
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.line,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            placeholder="Search FAQs..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, marginLeft: 10, color: colors.text, fontSize: 14 }}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          <WireframePill label="FAQ" active={activeTab === 'FAQ'} onPress={() => setActiveTab('FAQ')} />
          <WireframePill label="Contact Us" active={activeTab === 'Contact Us'} onPress={() => setActiveTab('Contact Us')} />
        </View>
      </WireframeCard>

      {activeTab === 'FAQ' ? (
        filteredFaq.length === 0 ? (
          <WireframeCard>
            <Text style={{ color: colors.muted, fontSize: 13 }}>No FAQs matched your search.</Text>
          </WireframeCard>
        ) : (
          <FlatList
            data={filteredFaq}
            keyExtractor={(item) => item.question}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <WireframeCard style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>{item.question}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 10 }}>{item.answer}</Text>
              </WireframeCard>
            )}
          />
        )
      ) : (
        <WireframeCard>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 14 }}>Contact Us</Text>
          <TextInput
            placeholder="Subject"
            placeholderTextColor={colors.placeholder}
            value={contactForm.subject}
            onChangeText={(subject) => setContactForm((current) => ({ ...current, subject }))}
            style={{
              minHeight: 52,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.line,
              backgroundColor: colors.inputBg,
              color: colors.text,
              paddingHorizontal: 14,
              marginBottom: 12,
            }}
          />
          <TextInput
            placeholder="Message"
            placeholderTextColor={colors.placeholder}
            value={contactForm.message}
            onChangeText={(message) => setContactForm((current) => ({ ...current, message }))}
            multiline
            textAlignVertical="top"
            style={{
              minHeight: 120,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.line,
              backgroundColor: colors.inputBg,
              color: colors.text,
              paddingHorizontal: 14,
              paddingVertical: 14,
            }}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.85}
            style={{
              minHeight: 52,
              borderRadius: 18,
              backgroundColor: submitStatus === 'success' ? '#40916C' : colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 16,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
              {submitStatus === 'success' ? 'Sent!' : 'Send Message'}
            </Text>
          </TouchableOpacity>
          {submitStatus === 'error' ? (
            <Text style={{ color: colors.danger, fontSize: 12, marginTop: 10 }}>
              Fill out both fields before sending.
            </Text>
          ) : null}
        </WireframeCard>
      )}
    </AppLayout>
  );
};

export default HelpCenterScreen;
