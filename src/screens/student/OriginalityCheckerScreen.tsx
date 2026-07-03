import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import CitationBottomSheet from '../shared/CitationBottomSheet';
import {
  AppLayout,
  HeaderIconButton,
  WireframeCard,
  useWireframeTheme,
} from '@/components/wireframe/Wireframe';
import { supabase } from '@/services/supabase';

type SimilaritySource = {
  id: number;
  title: string;
  author: string;
  year: string;
  similarityPercentage: number;
  matchedText: string;
  sourceText: string;
};

type ResultsType = {
  originalityScore: number;
  similaritySources: SimilaritySource[];
  highlightedText: string;
};

type OriginalityCheckerState =
  | { type: 'IDLE' }
  | { type: 'CHECKING' }
  | { type: 'RESULTS'; data: ResultsType }
  | { type: 'ERROR'; message: string };

type HighlightSegment = {
  text: string;
  highlighted: boolean;
};

const buildHighlightedSegments = (text: string, phrases: string[]): HighlightSegment[] => {
  const terms = [...new Set(phrases.map((phrase) => phrase.trim()).filter((phrase) => phrase.length >= 8))]
    .sort((left, right) => right.length - left.length);

  if (terms.length === 0 || !text.trim()) {
    return [{ text, highlighted: false }];
  }

  const lowerText = text.toLowerCase();
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    let nextIndex = -1;
    let nextTerm = '';

    for (const term of terms) {
      const index = lowerText.indexOf(term.toLowerCase(), cursor);
      if (index === -1) {
        continue;
      }
      if (nextIndex === -1 || index < nextIndex || (index === nextIndex && term.length > nextTerm.length)) {
        nextIndex = index;
        nextTerm = term;
      }
    }

    if (nextIndex === -1) {
      segments.push({ text: text.slice(cursor), highlighted: false });
      break;
    }

    if (nextIndex > cursor) {
      segments.push({ text: text.slice(cursor, nextIndex), highlighted: false });
    }

    segments.push({
      text: text.slice(nextIndex, nextIndex + nextTerm.length),
      highlighted: true,
    });
    cursor = nextIndex + nextTerm.length;
  }

  return segments.filter((segment) => segment.text.length > 0);
};

const OriginalityCheckerScreen: React.FC = () => {
  const colors = useWireframeTheme();
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [state, setState] = useState<OriginalityCheckerState>({ type: 'IDLE' });
  const [selectedSource, setSelectedSource] = useState<SimilaritySource | null>(null);
  const [showCitationModal, setShowCitationModal] = useState(false);

  const handleFilePick = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ],
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        setState({ type: 'ERROR', message: 'Please sign in before uploading a file.' });
        return;
      }

      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const fileBlob = await response.blob();
      const fileContentBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = typeof reader.result === 'string' ? reader.result : '';
          const base64 = dataUrl.split(',')[1];
          if (!base64) {
            reject(new Error('File encoding failed.'));
            return;
          }
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('File encoding failed.'));
        reader.readAsDataURL(fileBlob);
      });

      const { data, error } = await supabase.functions.invoke('upload-to-storage', {
        body: {
          fileContentBase64,
          fileName: asset.name,
          userId: session.user.id,
          bucket: 'originality-checks',
        },
      });

      if (error || !data?.storagePath) {
        throw error || new Error('File upload failed.');
      }

      setFileName(asset.name);
      setFilePath(data.storagePath);
      setInputText('');
      setState({ type: 'IDLE' });
    } catch {
      setFileName(null);
      setFilePath(null);
      setState({ type: 'ERROR', message: 'The file could not be uploaded. Please try again.' });
    }
  }, []);

  const handleCheckOriginality = useCallback(async () => {
    if (!inputText.trim() && !fileName) {
      setState({ type: 'ERROR', message: 'Please enter text or select a file to check.' });
      return;
    }

    setState({ type: 'CHECKING' });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('check-originality', {
        body: {
          text: inputText.trim() || undefined,
          file_path: filePath || undefined,
          user_id: session?.user?.id,
        },
      });

      if (error) {
        let functionMessage = '';
        if (error.context && typeof error.context.text === 'function') {
          try {
            const rawBody = await error.context.text();
            const parsed = JSON.parse(rawBody);
            functionMessage = typeof parsed?.error === 'string' ? parsed.error : '';
          } catch {
            functionMessage = '';
          }
        }

        const msg =
          functionMessage ||
          (error.message?.includes('fetch')
            ? 'Unable to connect. Please check your internet and try again.'
            : 'The originality check could not complete. Please try again.');
        setState({ type: 'ERROR', message: msg });
        return;
      }

      setState({ type: 'RESULTS', data });
    } catch {
      setState({ type: 'ERROR', message: 'Something went wrong. Please try again.' });
    }
  }, [fileName, filePath, inputText]);

  const handleReset = useCallback(() => {
    setInputText('');
    setFileName(null);
    setFilePath(null);
    setState({ type: 'IDLE' });
    setSelectedSource(null);
    setShowCitationModal(false);
  }, []);

  const score = state.type === 'RESULTS' ? state.data.originalityScore : null;
  const scoreColor =
    score === null
      ? colors.accent
      : score <= 30
        ? '#40916C'
        : score <= 60
          ? '#D4A017'
          : score <= 79
            ? '#E76F51'
            : '#C1121F';

  return (
    <AppLayout
      title="Originality Checker"
      subtitle="Check your work for similarity against academic databases"
      headerRight={<HeaderIconButton icon="rotate-ccw" onPress={handleReset} />}
    >
      <WireframeCard style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 14 }}>Select File or Enter Text</Text>
        <TouchableOpacity
          onPress={handleFilePick}
          activeOpacity={0.85}
          style={{
            minHeight: 52,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.inputBg,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            marginBottom: 12,
          }}
        >
          <Feather name="paperclip" size={18} color={colors.muted} />
          <Text style={{ color: colors.text, marginLeft: 10 }}>{fileName || 'Select File'}</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Paste your text here to check originality..."
          placeholderTextColor="#95A79D"
          value={inputText}
          onChangeText={setInputText}
          multiline
          textAlignVertical="top"
          style={{
            minHeight: 150,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.inputBg,
            color: colors.text,
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}
        />
        {state.type === 'ERROR' ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 10 }}>{state.message}</Text> : null}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity
            onPress={handleCheckOriginality}
            disabled={!(inputText.trim() || fileName) || state.type === 'CHECKING'}
            activeOpacity={0.85}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 18,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !(inputText.trim() || fileName) || state.type === 'CHECKING' ? 0.55 : 1,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
              {state.type === 'CHECKING' ? 'Checking...' : state.type === 'RESULTS' ? 'Check Again' : 'Check Originality'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.85}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.line,
              backgroundColor: colors.inputBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '700' }}>Reset</Text>
          </TouchableOpacity>
        </View>
      </WireframeCard>

      {state.type === 'CHECKING' ? (
        <WireframeCard style={{ alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent} />
          <Text style={{ color: colors.muted, marginTop: 12 }}>Analyzing your document...</Text>
        </WireframeCard>
      ) : null}

      {state.type === 'RESULTS' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <WireframeCard style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }}>Originality Results</Text>
            <View
              style={{
                alignSelf: 'flex-start',
                borderRadius: 999,
                backgroundColor: scoreColor,
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{state.data.originalityScore}% originality</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {state.data.originalityScore >= 80 ? 'High originality' : state.data.originalityScore >= 60 ? 'Medium originality' : 'Low originality'}
            </Text>
          </WireframeCard>

          <WireframeCard style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }}>Similarity Sources</Text>
            {state.data.similaritySources.map((source) => (
              <View
                key={source.id}
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.line,
                  backgroundColor: colors.inputBg,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: '800', fontSize: 14 }}>{source.title}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>
                  {source.author} ({source.year}) • {source.similarityPercentage}% match
                </Text>
                <Text style={{ color: colors.text, fontSize: 13, marginTop: 10 }}>Matched: "{source.matchedText}"</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>Source: "{source.sourceText}"</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSource(source);
                    setShowCitationModal(true);
                  }}
                  activeOpacity={0.85}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}
                >
                  <Feather name="file-text" size={16} color={colors.accent} />
                  <Text style={{ color: colors.accent, fontWeight: '700', marginLeft: 8 }}>View APA Citation</Text>
                </TouchableOpacity>
              </View>
            ))}
          </WireframeCard>

          <WireframeCard>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }}>Highlighted Text</Text>
            <Text style={{ color: colors.text, fontSize: 14, lineHeight: 21 }}>
              {buildHighlightedSegments(
                state.data.highlightedText,
                state.data.similaritySources.map((source) => source.matchedText)
              ).map((segment, index) => (
                <Text
                  key={`${segment.text}-${index}`}
                  style={segment.highlighted ? {
                    backgroundColor: colors.accentSoft,
                    color: colors.text,
                    fontWeight: '700',
                  } : undefined}
                >
                  {segment.text}
                </Text>
              ))}
            </Text>
          </WireframeCard>
        </ScrollView>
      ) : null}

      <Modal transparent visible={showCitationModal} onRequestClose={() => setShowCitationModal(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          {selectedSource ? (
            <CitationBottomSheet
              sourceData={{
                type: 'Journal Article',
                title: selectedSource.title,
                author: selectedSource.author,
                year: selectedSource.year,
              }}
              onClose={() => setShowCitationModal(false)}
            />
          ) : null}
        </View>
      </Modal>
    </AppLayout>
  );
};

export default OriginalityCheckerScreen;
